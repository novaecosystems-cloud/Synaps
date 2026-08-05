import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface GuideflowStep {
  id: string;
  title: string;
  description: string;
  mediaUrl: string;
  hotspot?: { x: number; y: number; label: string };
}

interface GuideflowData {
  id: string;
  name: string;
  steps: GuideflowStep[];
  views: number;
  leads: number;
  completionRate: number;
}

export async function GET(req: NextRequest) {
  const sampleGuideflows: GuideflowData[] = [
    {
      id: 'gf_001',
      name: 'SYNAPS Executive Contract Audit Walkthrough',
      views: 1420,
      leads: 184,
      completionRate: 78.4,
      steps: [
        {
          id: 'step_1',
          title: '1. Ingest Master Services Agreement',
          description: 'Upload PDF contract file to the Zero-Trust memory vault.',
          mediaUrl: '/synaps_logo_square.jpg',
          hotspot: { x: 50, y: 40, label: 'Click to Upload PDF' }
        },
        {
          id: 'step_2',
          title: '2. Perform Evidenced Clause Search',
          description: 'Query "Find every mention of termination notice window".',
          mediaUrl: '/synaps_banner_landscape.jpg',
          hotspot: { x: 30, y: 60, label: 'Run Clause Query' }
        },
        {
          id: 'step_3',
          title: '3. Review Evidenced Decision Brief',
          description: 'Inspect line citations on Page 8 Section 8.4 and export PDF report.',
          mediaUrl: '/synaps_banner_landscape.jpg',
          hotspot: { x: 70, y: 50, label: 'Export Decision Brief' }
        }
      ]
    }
  ];

  return NextResponse.json({
    success: true,
    data: sampleGuideflows
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: 'Guideflow step created successfully',
      data: {
        id: `gf_step_${Date.now()}`,
        ...body
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create guideflow step' },
      { status: 500 }
    );
  }
}
