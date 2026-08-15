import React from 'react';
import { Metadata } from 'next';
import UniversalChartStudio from '@/components/charts/UniversalChartStudio';

export const metadata: Metadata = {
  title: 'Chart Studio (ARLM) — Synaps AI',
  description: 'Generate, customize, and export high-accuracy executive charts with ARLM mathematical validation.',
};

export default function ChartsDashboardPage() {
  return <UniversalChartStudio />;
}
