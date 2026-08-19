/**
 * Temporal Decision Telemetry & Proprietary Data Flywheel Engine
 * 
 * Logs executive decisions, simulation variables, and predicted 30/60/90-day key results.
 * As actual quarterly performance data arrives from ERP/CRM systems, computes the delta
 * between prediction and reality, fine-tuning internal Bayesian risk-weighting models.
 */

export interface DecisionPredictionLog {
  decisionId: string;
  title: string;
  category: 'M&A' | 'Pricing' | 'Hiring' | 'Infrastructure' | 'Product';
  timestamp: string;
  predictedOutcomes: {
    period: '30_DAYS' | '60_DAYS' | '90_DAYS';
    metric: string;
    predictedValue: number;
    unit: string;
    confidenceInterval: [number, number]; // [P10, P90]
  }[];
  actualOutcomes?: {
    period: '30_DAYS' | '60_DAYS' | '90_DAYS';
    metric: string;
    actualValue: number;
    recordedTimestamp: string;
    deltaPercentage: number;
  }[];
  modelCalibrationAdjustmentFactor: number;
}

export const SEEDED_TELEMETRY_LOGS: DecisionPredictionLog[] = [
  {
    decisionId: 'DEC-2025-089',
    title: 'Enterprise Price Increase (+15% Tier Expansion)',
    category: 'Pricing',
    timestamp: '2025-11-10T10:00:00Z',
    predictedOutcomes: [
      {
        period: '30_DAYS',
        metric: 'Net ARR Growth',
        predictedValue: 4.2,
        unit: '$M',
        confidenceInterval: [3.8, 4.6]
      },
      {
        period: '90_DAYS',
        metric: 'Gross Logo Churn Rate',
        predictedValue: 2.1,
        unit: '%',
        confidenceInterval: [1.8, 2.7]
      }
    ],
    actualOutcomes: [
      {
        period: '30_DAYS',
        metric: 'Net ARR Growth',
        actualValue: 4.35,
        recordedTimestamp: '2025-12-10T10:00:00Z',
        deltaPercentage: 3.57 // +3.57% prediction accuracy
      },
      {
        period: '90_DAYS',
        metric: 'Gross Logo Churn Rate',
        actualValue: 2.05,
        recordedTimestamp: '2026-02-10T10:00:00Z',
        deltaPercentage: -2.38 // Accurate within 0.05%
      }
    ],
    modelCalibrationAdjustmentFactor: 1.02
  },
  {
    decisionId: 'DEC-2026-004',
    title: 'Acquisition of Edge Infrastructure Startup ($200M Valuation vs $130M Counter)',
    category: 'M&A',
    timestamp: '2026-01-20T14:30:00Z',
    predictedOutcomes: [
      {
        period: '60_DAYS',
        metric: 'GPLv3 Codebase Clean-Room Rewrite Cost',
        predictedValue: 42.0,
        unit: '$M',
        confidenceInterval: [38.0, 46.5]
      },
      {
        period: '90_DAYS',
        metric: 'Cash Runway Preservation',
        predictedValue: 18.5,
        unit: 'Months',
        confidenceInterval: [16.0, 20.0]
      }
    ],
    actualOutcomes: [
      {
        period: '60_DAYS',
        metric: 'GPLv3 Codebase Clean-Room Rewrite Cost',
        actualValue: 41.2,
        recordedTimestamp: '2026-03-20T14:30:00Z',
        deltaPercentage: -1.90 // Predicted with 98.1% precision
      }
    ],
    modelCalibrationAdjustmentFactor: 1.01
  }
];

export function computeTelemetryDelta(predicted: number, actual: number): {
  delta: number;
  accuracyScore: number;
  calibrationMultiplier: number;
} {
  const delta = ((actual - predicted) / predicted) * 100;
  const accuracyScore = Math.max(0, 100 - Math.abs(delta));
  const calibrationMultiplier = 1 + (delta / 1000); // Micro-tuning factor

  return {
    delta: Number(delta.toFixed(2)),
    accuracyScore: Number(accuracyScore.toFixed(1)),
    calibrationMultiplier: Number(calibrationMultiplier.toFixed(4))
  };
}
