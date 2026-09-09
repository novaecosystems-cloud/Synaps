import { NextRequest, NextResponse } from 'next/server';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  HeadingLevel,
  CommentRangeStart,
  CommentRangeEnd,
  CommentReference,
  UnderlineType
} from 'docx';
import { RedlineFinding, NegotiationStance } from '../redline/route';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      contractTitle = 'Commercial Contract Review',
      contractType = 'custom',
      negotiationStance = 'founder_protective',
      overallRiskScore = 75,
      riskCategory = 'CRITICAL',
      executiveSummary = 'Fiduciary redline review required.',
      delawareSafeHarborStatus = 'NON_COMPLIANT',
      findings = [],
      merkleAudit = {
        merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000',
        leafCount: 0,
        auditTimestamp: new Date().toISOString(),
        sha256Signature: '0000000000000000000000000000000000000000000000000000000000000000'
      },
      companyName = 'Apex Global Enterprise'
    } = body;

    const typedFindings: RedlineFinding[] = findings;

    const stanceLabels: Record<NegotiationStance, string> = {
      founder_protective: 'Founder-Protective (Maximum Shield & Downside Defense)',
      balanced_commercial: 'Balanced Commercial (High-Velocity Bilateral Standards)',
      enterprise_hardball: 'Enterprise Hardball (Aggressive Corporate Power Stance)'
    };

    const stanceLabel = stanceLabels[negotiationStance as NegotiationStance] || negotiationStance;

    // Generate native margin comments for each finding
    const commentsList = typedFindings.map((finding, idx) => ({
      id: idx + 1,
      author: 'Delaware DGCL § 141 Safe Harbor Counsel',
      date: new Date(),
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: `[DGCL § 141 FIDUCIARY COMMENT: ${finding.clauseType} - ${finding.riskLevel} RISK]`,
              bold: true,
              color: finding.riskLevel === 'CRITICAL' ? 'DC2626' : 'D97706'
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Statutory Risk Analysis: ${finding.legalAnalysis}`
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Market Benchmark: ${finding.industryBenchmark}`,
              italics: true
            })
          ]
        })
      ]
    }));

    // Construct Header block
    const headerElements = [
      new Paragraph({
        children: [
          new TextRun({
            text: 'CAUSARIX SOVEREIGN FIDUCIARY REDLINE AUDIT',
            bold: true,
            size: 28,
            color: '1E3A8A'
          })
        ],
        spacing: { after: 120 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'Delaware DGCL § 141 Safe Harbor Compliance & Attorney-Grade Contract Redlines',
            size: 20,
            color: '475569',
            italics: true
          })
        ],
        spacing: { after: 300 }
      }),
      new Paragraph({
        text: `Target Agreement: ${contractTitle}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      })
    ];

    // Executive Scorecard Table
    const scorecardTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 35, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: 'Audited Organization:', bold: true })] })]
            }),
            new TableCell({
              width: { size: 65, type: WidthType.PERCENTAGE },
              children: [new Paragraph({ children: [new TextRun({ text: companyName })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Negotiation Stance:', bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: stanceLabel, bold: true, color: '2563EB' })] })]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Legal Exposure Score:', bold: true })] })]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${overallRiskScore} / 100 (${riskCategory} RISK)`,
                      bold: true,
                      color: riskCategory === 'CRITICAL' ? 'DC2626' : riskCategory === 'HIGH' ? 'D97706' : '16A34A'
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'DGCL § 141 Safe Harbor:', bold: true })] })]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: delawareSafeHarborStatus === 'PROTECTED'
                        ? 'PROTECTED (Business Judgment Rule Enforced)'
                        : 'NON-COMPLIANT (Fiduciary Breach Hazard If Executed As-Is)',
                      bold: true,
                      color: delawareSafeHarborStatus === 'PROTECTED' ? '16A34A' : 'DC2626'
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'SHA-256 Merkle Root Seal:', bold: true })] })]
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: merkleAudit.merkleRoot,
                      font: 'Courier New',
                      size: 16,
                      color: '059669'
                    })
                  ]
                })
              ]
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: 'Audit Timestamp:', bold: true })] })]
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: merkleAudit.auditTimestamp || new Date().toISOString() })] })]
            })
          ]
        })
      ]
    });

    // Executive Directive Paragraph
    const executiveDirectiveParagraph = new Paragraph({
      children: [
        new TextRun({ text: 'EXECUTIVE FIDUCIARY DIRECTIVE: ', bold: true, color: '1E3A8A' }),
        new TextRun({ text: executiveSummary, italics: true })
      ],
      spacing: { before: 240, after: 360 }
    });

    // Heading for findings
    const findingsHeading = new Paragraph({
      text: `Audited Redlines & Track Changes (${typedFindings.length} Identified Clauses)`,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 300, after: 200 }
    });

    // Build paragraphs for each finding with strikethrough, insertion, and margin comment reference
    const findingParagraphs: Paragraph[] = [];

    typedFindings.forEach((finding, idx) => {
      const commentId = idx + 1;

      // Clause Title & Risk
      findingParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Clause ${idx + 1}: ${finding.clauseType}`,
              bold: true,
              size: 22,
              color: '0F172A'
            }),
            new TextRun({ text: '   ' }),
            new TextRun({
              text: `[${finding.riskLevel} RISK]`,
              bold: true,
              size: 18,
              color: finding.riskLevel === 'CRITICAL' ? 'DC2626' : finding.riskLevel === 'HIGH' ? 'D97706' : '16A34A'
            })
          ],
          spacing: { before: 240, after: 80 }
        })
      );

      // Track Changes Redline (Strikethrough original + Comment reference + Underline insertion)
      findingParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Redline Track Changes: ', bold: true, color: '64748B' }),
            new CommentRangeStart(commentId),
            new TextRun({
              text: finding.originalText,
              strike: true,
              color: 'DC2626'
            }),
            new CommentRangeEnd(commentId),
            new TextRun({
              children: [new CommentReference(commentId)]
            }),
            new TextRun({ text: ' ' }),
            new TextRun({
              text: finding.recommendedRedline,
              color: '16A34A',
              bold: true,
              underline: { type: UnderlineType.SINGLE }
            })
          ],
          spacing: { after: 120 }
        })
      );

      // Fiduciary Legal Analysis & Industry Benchmark
      findingParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Fiduciary Duty Analysis (DGCL § 141): ', bold: true, color: '334155' }),
            new TextRun({ text: finding.legalAnalysis })
          ],
          spacing: { after: 60 }
        })
      );

      findingParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Market Standard Benchmark: ', bold: true, color: '334155' }),
            new TextRun({ text: finding.industryBenchmark, italics: true, color: '475569' })
          ],
          spacing: { after: 200 }
        })
      );
    });

    // Fiduciary Sign-off Block
    const signoffParagraphs = [
      new Paragraph({
        text: 'Statutory Fiduciary Verification & Board Audit Trail',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 160 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: 'This document represents an automated Delaware DGCL § 141 fiduciary audit generated by Causarix AI. All redlines conform to Delaware Court of Chancery standards for Director Care and Safe Harbor defense.',
            size: 18,
            color: '64748B'
          })
        ],
        spacing: { after: 200 }
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: 'General Counsel / Reviewing Attorney:', bold: true })] }),
                  new Paragraph({ children: [new TextRun({ text: 'Signature: ___________________________' })], spacing: { before: 100 } }),
                  new Paragraph({ children: [new TextRun({ text: 'Date: _______________________________' })], spacing: { before: 60 } })
                ]
              }),
              new TableCell({
                width: { size: 50, type: WidthType.PERCENTAGE },
                children: [
                  new Paragraph({ children: [new TextRun({ text: 'Board Fiduciary Sign-Off (DGCL § 141):', bold: true })] }),
                  new Paragraph({ children: [new TextRun({ text: 'Signature: ___________________________' })], spacing: { before: 100 } }),
                  new Paragraph({ children: [new TextRun({ text: 'Date: _______________________________' })], spacing: { before: 60 } })
                ]
              })
            ]
          })
        ]
      })
    ];

    // Assemble Document
    const doc = new Document({
      comments: {
        children: commentsList
      },
      sections: [
        {
          properties: {},
          children: [
            ...headerElements,
            scorecardTable,
            executiveDirectiveParagraph,
            findingsHeading,
            ...findingParagraphs,
            ...signoffParagraphs
          ]
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);
    const sanitizedTitle = (contractTitle || 'Contract')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 35);
    const filename = `Causarix-Redlined-${sanitizedTitle}-${negotiationStance}.docx`;

    return new Response(buffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString()
      }
    });
  } catch (error: any) {
    console.error('Error generating docx:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate redlined docx document.' },
      { status: 500 }
    );
  }
}
