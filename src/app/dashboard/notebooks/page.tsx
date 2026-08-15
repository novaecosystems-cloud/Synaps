import React from 'react';
import { Metadata } from 'next';
import MatterNotebookStudio from '@/components/notebooks/MatterNotebookStudio';

export const metadata: Metadata = {
  title: 'Matter Notebooks & Audio Briefings — Synaps AI',
  description: 'Multi-document research notebooks with 2-Host conversational audio podcast synthesis.',
};

export default function MatterNotebooksDashboardPage() {
  return <MatterNotebookStudio />;
}
