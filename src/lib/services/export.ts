import { PrismaClient } from '@prisma/client';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell } from 'docx';
import Papa from 'papaparse';

import prisma from '@/lib/prisma';

export async function exportDocument(
  jobId: string, 
  type: string, 
  format: string, 
  documentId?: string, 
  projectId?: string
) {
  try {
    // 1. Fetch data based on type
    let data: any = null;
    let title = 'Export Report';

    if (type === 'PROPOSAL' && documentId) {
      data = await prisma.proposal.findUnique({
        where: { documentId },
        include: { sections: { orderBy: { order: 'asc' } } }
      });
      title = data?.title || 'Proposal';
    } else if (type === 'GAP_ANALYSIS') {
      const whereClause = documentId ? { documentId } : { projectId };
      data = await prisma.gap.findMany({ where: whereClause });
      title = 'Gap Analysis Report';
    } else if (type === 'COMPLIANCE_REPORT' && documentId) {
      data = await prisma.requirement.findMany({ where: { documentId } });
      title = 'Compliance Report';
    } else if (type === 'DECISION_REPORT' && documentId) {
      data = await prisma.decision.findUnique({ where: { documentId } });
      title = 'Decision Report';
    } else if (type === 'EXECUTIVE_SUMMARY' && documentId) {
      data = await prisma.executiveSummary.findUnique({ where: { documentId } });
      title = 'Executive Summary';
    }

    if (!data) {
      throw new Error('No data found for the requested export');
    }

    // 2. Generate content
    let fileData = '';
    
    if (format === 'JSON') {
      fileData = JSON.stringify(data, null, 2);
    } else if (format === 'CSV') {
      if (Array.isArray(data)) {
        fileData = Papa.unparse(data);
      } else if (data.sections) {
        fileData = Papa.unparse(data.sections.map((s: any) => ({ title: s.title, content: s.content })));
      } else {
        fileData = Papa.unparse([data]);
      }
    } else if (format === 'MARKDOWN') {
      fileData = generateMarkdown(title, data, type);
    } else if (format === 'DOCX') {
      const buffer = await generateDocx(title, data, type);
      fileData = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${buffer.toString('base64')}`;
    } else if (format === 'PDF') {
      // For simplicity in this demo without external binary deps, 
      // we'll just mock PDF with a base64 encoded dummy string or fallback to Markdown
      // In a real app we would use pdfkit or puppeteer here.
      fileData = `data:text/plain;base64,${Buffer.from('PDF Generation requires a rendering engine in this environment. Please use DOCX or Markdown.').toString('base64')}`;
    }

    // 3. Update job
    await prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: 'COMPLETED',
        progress: 100,
        fileUrl: fileData, // Storing raw data/base64 in DB for demonstration
        completedAt: new Date()
      }
    });

  } catch (error: any) {
    console.error('Export worker error:', error);
    await prisma.exportJob.update({
      where: { id: jobId },
      data: {
        status: 'FAILED',
        error: error.message
      }
    });
  }
}

function generateMarkdown(title: string, data: any, type: string) {
  let md = `# ${title}\n\n`;
  if (Array.isArray(data)) {
    data.forEach((item, i) => {
      md += `## Item ${i + 1}\n`;
      Object.entries(item).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          md += `**${k}**: ${v}\n\n`;
        }
      });
    });
  } else if (data.sections) {
    data.sections.forEach((sec: any) => {
      md += `## ${sec.title}\n${sec.content}\n\n`;
    });
  } else {
    Object.entries(data).forEach(([k, v]) => {
      if (typeof v === 'string') {
        md += `## ${k}\n${v}\n\n`;
      }
    });
  }
  return md;
}

async function generateDocx(title: string, data: any, type: string) {
  const children: any[] = [
    new Paragraph({
      text: title,
      heading: HeadingLevel.HEADING_1,
    })
  ];

  if (Array.isArray(data)) {
    data.forEach((item) => {
      children.push(new Paragraph({ text: '---' }));
      Object.entries(item).forEach(([k, v]) => {
        if (typeof v === 'string' || typeof v === 'number') {
          children.push(new Paragraph({
            children: [
              new TextRun({ text: `${k}: `, bold: true }),
              new TextRun({ text: `${v}` }),
            ]
          }));
        }
      });
    });
  } else if (data.sections) {
    data.sections.forEach((sec: any) => {
      children.push(new Paragraph({ text: sec.title, heading: HeadingLevel.HEADING_2 }));
      children.push(new Paragraph({ text: sec.content }));
    });
  } else {
    Object.entries(data).forEach(([k, v]) => {
      if (typeof v === 'string') {
        children.push(new Paragraph({ text: k, heading: HeadingLevel.HEADING_2 }));
        children.push(new Paragraph({ text: v }));
      }
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  return await Packer.toBuffer(doc);
}
