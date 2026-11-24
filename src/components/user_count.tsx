'use client'

import { useOnline } from "@/hooks/use-online";

export function OnlineIndicator({ userId }: { userId?: number }) {
  const users = useOnline();

  if (users === null) {
    return (
      <span
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        <span
          aria-hidden="true"
          className="size-2 shrink-0 rounded-full bg-red-500"
        />
        Chargement...
      </span>
    );
  }

  const otherUsers = userId
    ? users.filter((onlineUser) => onlineUser.id !== userId)
    : users;
  const hasOtherUsers = otherUsers.length > 0;
  const isOnlyOneOnline = userId !== undefined && users.length === 1 &&
    users[0].id === userId;

  let label: string;
  if (isOnlyOneOnline) {
    label = "tu es seul en ligne";
  } else if (hasOtherUsers) {
    label = `${otherUsers.length} ${otherUsers.length === 1 ? "personne" : "personnes"} en ligne`;
  } else {
    label = "0 personne en ligne";
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span
        aria-hidden="true"
        className={`size-2 shrink-0 rounded-full ${
          hasOtherUsers ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {label}
    </span>
  );
}