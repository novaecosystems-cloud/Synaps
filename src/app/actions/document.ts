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

    // Hard delete from storage provider
    for (const version of doc.versions) {
      await deleteFile(version.storagePath);
    }

    // Soft delete from DB
    await prisma.document.update({
      where: { id: documentId },
      data: { isDeleted: true }
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete document.' };
  }
}
