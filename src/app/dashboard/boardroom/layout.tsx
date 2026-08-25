import type { Metadata } from 'next';
import { getBoardroomMetadata } from '@/lib/openseo';

export const metadata: Metadata = getBoardroomMetadata();

export default function BoardroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
