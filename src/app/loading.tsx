import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40">
      <Spinner scale={1.5} style={{ margin: 0 }} />
    </div>
  );
}
