"use client";

import { useOnline } from "@/hooks/use-online";

export function OnlineIndicator() {
  const users = useOnline();

  return (
    <span
      role="status"
      aria-live="polite"
      className="text-sm text-muted-foreground"
    >
      {users.length} en ligne
    </span>
  );
}