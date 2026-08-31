export const dynamic = 'force-dynamic';

import React from 'react';
import { Metadata } from 'next';
import { CausarixExecutiveMatterCockpit } from '@/components/dashboard/CausarixExecutiveMatterCockpit';

export const metadata: Metadata = {
  title: 'Strategic Matters & Cases | Causarix AI',
  description: 'Executive legal matters, boardroom cases, and evidentiary audit cockpit.',
};

export default function MattersPage() {
  return <CausarixExecutiveMatterCockpit />;
}
