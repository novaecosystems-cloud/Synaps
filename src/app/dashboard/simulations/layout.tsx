import type { Metadata } from 'next';
import { getSimulationsMetadata } from '@/lib/openseo';

export const metadata: Metadata = getSimulationsMetadata();

export default function SimulationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
