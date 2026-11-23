'use client';
import { usePresence } from '@/hooks/use-presence';
import { ViewerStack } from '@/components/drops/viewer_stack';

export function PresenceWidget(
  { dropId }: { dropId: number }) {
  const viewers = usePresence(dropId);
  return <ViewerStack viewers={viewers} />;
}