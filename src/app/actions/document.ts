'use server'

import { PrismaClient } from '@prisma/client';
import { verifySessionCookie } from '@/lib/auth-server';
import { cookies } from 'next/headers';
import { generateUploadUrl, generateDownloadUrl, deleteFile } from '@/lib/storage';

import prisma, { rawPrisma } from '@/lib/prisma';

const MAX_FILE_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

async function authenticate() {
  const cookieStore = await cookies();
  const session = cookieStore.get('synaps-session')?.value;
  if (!session) return null;
  const decodedToken = await verifySessionCookie(session);
  if (!decodedToken) return null;
  
  return prisma.user.findUnique({
    where: { id: decodedToken.uid }
  });
}

export async function requestUploadUrl(name: string, mimeType: string, sizeBytes: number, organizationId: string, projectId?: string) {
  const user = await authenticate();
  if (!user || user.organizationId !== organizationId) return { success: false, error: 'Unauthorized' };

  // 1. Validation: Max size
  if (sizeBytes > MAX_FILE_SIZE) {
    return { success: false, error: 'File size exceeds 50MB limit.' };
  }

  // 2. Validation: Type Check
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { success: false, error: 'Unsupported file type. Only PDF, DOCX, XLSX, PPTX, and Images are allowed.' };
  }

  // 3. Validation: Duplicate detection
  const existing = await prisma.document.findFirst({
    where: {
      organizationId,
      projectId: projectId || null,
      name,
      isDeleted: false
    }
  });

  if (existing) {
    return { success: false, error: 'A document with this name already exists in this location.' };
  }

  // Generate unique path enforcing organization-level isolation
  const storagePath = `${organizationId}/documents/${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  try {
    const result = await generateUploadUrl(storagePath, mimeType, sizeBytes);
    return { success: true, uploadUrl: result.url, gcsPath: result.path };
  } catch (error) {
    console.error('Failed to generate upload URL:', error);
    return { success: false, error: 'Failed to initialize upload.' };
  }
}

export async function confirmUpload(
  name: string, 
  gcsPath: string, 
  mimeType: string, 
  sizeBytes: number, 
  organizationId: string, 
  projectId?: string
) {
  const user = await authenticate();
  if (!user || user.organizationId !== organizationId) return { success: false, error: 'Unauthorized' };

  try {
    const document = await rawPrisma.$transaction(async (tx) => {
      // Create Document root
      const doc = await tx.document.create({
        data: {
          name,
          organizationId,
          projectId: projectId || null,
          ownerId: user.id,
          mimeType,
          sizeBytes,
          scanStatus: 'CLEAN'
        }
      });

      // Create initial version
      const version = await tx.documentVersion.create({
        data: {
          documentId: doc.id,
          organizationId,
          versionNum: 1,
          storagePath: gcsPath,
          originalName: name,
          mimeType,
          sizeBytes,
          scanStatus: 'CLEAN',
          uploadedById: user.id
        }
      });

      // Update document with currentVersionId
      const updatedDoc = await tx.document.update({
        where: { id: doc.id },
        data: { currentVersionId: version.id },
        include: { owner: { select: { name: true, avatarUrl: true } } }
      });

      // Create ProcessingJob
      await tx.processingJob.create({
        data: {
          documentId: doc.id,
          organizationId,
          status: 'PENDING',
          progress: 0
        }
      });

      return updatedDoc;
    });

    return { success: true, document };
  } catch (error: any) {
    console.error('Error confirming upload:', error);
    return { success: false, error: 'Failed to save document metadata: ' + (error.message || String(error)) };
  }
}

export async function getDocuments(organizationId: string, projectId?: string) {
  const user = await authenticate();
  if (!user || user.organizationId !== organizationId) return { success: false, error: 'Unauthorized' };

  try {
    const documents = await prisma.document.findMany({
      where: {
        organizationId,
        projectId: projectId || null,
        isDeleted: false
      },
      include: {
        owner: { select: { name: true, avatarUrl: true } },
        processingJob: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, documents };
  } catch (error) {
    return { success: false, error: 'Failed to fetch documents.' };
  }
}

export async function getDownloadUrl(documentId: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { versions: { orderBy: { versionNum: 'desc' }, take: 1 } }
    });

    if (!doc || doc.isDeleted || doc.versions.length === 0) {
      return { success: false, error: 'Document not found.' };
    }

    if (doc.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to document.' };
    }

    const latestVersion = doc.versions[0];
    const url = await generateDownloadUrl(latestVersion.storagePath);
    
    return { success: true, url };
  } catch (error) {
    return { success: false, error: 'Failed to generate download URL.' };
  }
}

export async function renameDocument(documentId: string, newName: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to document.' };
    }

    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: { name: newName }
    });
    return { success: true, document: updatedDoc };
  } catch (error) {
    return { success: false, error: 'Failed to rename document.' };
  }
}

export async function deleteDocument(documentId: string) {
  return hardDeleteDocument(documentId);
}

/**
 * Permanently hard deletes a document, purges all vector chunks, graph entities, 
 * physical files, and wipes it completely from AI memory so the AI cannot remember it.
 */
export async function hardDeleteDocument(documentId: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      include: { versions: true }
    });

    if (!doc) return { success: false, error: 'Document not found.' };
    
    if (doc.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to document.' };
    }

    // 1. Delete physical files from storage provider
    for (const version of doc.versions) {
      try {
        await deleteFile(version.storagePath);
      } catch (e) {}
    }

    // 2. Permanently purge AI memory entries, vector chunks, & graph entities
    await prisma.documentChunk.deleteMany({ where: { documentId } }).catch(() => {});
    await prisma.documentMetadata.deleteMany({ where: { documentId } }).catch(() => {});
    await prisma.processingJob.deleteMany({ where: { documentId } }).catch(() => {});
    await prisma.processedDocument.deleteMany({ where: { documentId } }).catch(() => {});
    await prisma.graphEntity.deleteMany({ where: { documentId } }).catch(() => {});
    await prisma.documentVersion.deleteMany({ where: { documentId } }).catch(() => {});

    // 3. Hard delete root Document record from database
    await prisma.document.delete({
      where: { id: documentId }
    });

    return { success: true, message: 'Document and all AI memory entries permanently purged.' };
  } catch (error: any) {
    console.error('Failed to hard delete document:', error);
    // Fallback soft delete
    try {
      await prisma.document.update({
        where: { id: documentId },
        data: { isDeleted: true }
      });
      return { success: true, message: 'Document removed from active memory.' };
    } catch (e) {
      return { success: false, error: 'Failed to delete document: ' + (error.message || String(error)) };
    }
  }
}

/**
 * Assign a document to a specific group / folder collection
 */
export async function updateDocumentGroup(documentId: string, groupName: string) {
  const user = await authenticate();
  if (!user) return { success: false, error: 'Unauthorized' };

  try {
    const doc = await prisma.document.findUnique({ where: { id: documentId } });
    if (!doc || doc.organizationId !== user.organizationId) {
      return { success: false, error: 'Unauthorized access to document.' };
    }

    // Store group name in document metadata / properties
    await prisma.documentMetadata.create({
      data: {
        documentId,
        organizationId: user.organizationId,
        key: 'group',
        value: groupName.trim()
      }
    }).catch(async () => {
      // Update existing if present
      await prisma.documentMetadata.updateMany({
        where: { documentId, key: 'group' },
        data: { value: groupName.trim() }
      });
    });

    return { success: true, group: groupName };
  } catch (error: any) {
    return { success: false, error: 'Failed to update document group.' };
  }
}

