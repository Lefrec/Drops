# WebSocket integration

This document describes the live, browser-to-server WebSocket integration used by the app.
Keep it synchronized with the implementation whenever realtime events or lifecycle behavior
change.

## Overview

The app uses one shared WebSocket connection for all browser realtime features. It is
initialized lazily and remains open for one second after the last consumer releases it.
This avoids reconnecting for short-lived React component remounts.

The implementation is split across these files:

- `src/lib/realtime.ts`: shared WebSocket singleton, ticket setup, subscriptions, reconnect
  logic, and outgoing messages.
- `src/app/api/realtime/ticket/route.ts`: authenticated Next.js server route that obtains a
  short-lived WebSocket URL from the Drops API.
- `src/hooks/use-presence.ts`: React hook for the existing drop-viewer feature.
- `src/hooks/use-online.ts`: React hook for the server-wide online user list.
- `src/components/drops/presence_widget.tsx`: viewer-widget component.
- `src/components/drops/viewer_stack.tsx`: visualizes the list of current viewers.
- `src/components/layout/user_count.tsx`: client indicator used in the global header.
- `src/app/drops/[id]/page.tsx`: mounts the viewer widget on drop detail pages.

The browser must never contain or use the API token directly. It calls the local Next.js
ticket route, and that route forwards the session token to the API.

## Connection lifecycle

1. A client-side hook calls `retain()`.
2. `retain()` registers a consumer and starts the ticket request if needed.
3. `POST /api/realtime/ticket` reads the HTTP-only `session` cookie server-side.
4. The route calls `POST /realtime/ticket` on the Drops API with
   `Authorization: Bearer <token>`.
5. The API returns a WebSocket URL.
6. `src/lib/realtime.ts` opens the URL with `new WebSocket(url)`.
7. When the socket opens, it runs all listeners registered with `onOpen()`.
8. Incoming JSON messages are dispatched by `message.type`:

   ```ts
   {
     type: string;
     data: object;
   }
   ```

The local ticket route returns `401` when no session exists. Other API responses are forwarded
with their original status and body.

## Shared realtime API

The module exports four primitives.

### `retain()`

```ts
const release = retain();
// ...
release();
```

Call `retain()` once for each mounted realtime consumer. It:

- increments the consumer count;
- starts connection setup when this is the first consumer;
- returns an idempotent cleanup function;
- closes the socket after a 1-second grace period when the final consumer releases it.

Do not call `retain()` as a render side effect. Call it inside a React `useEffect()` and release
it in that effect's cleanup.

### `subscribe(type, listener)`

```ts
const unsubscribe = subscribe("example:event", (data) => {
  // Update component state here.
});

unsubscribe();
```

- `type` is matched against `message.type`.
- `listener` receives only `message.data`, not the complete envelope.
- A subscriber should be removed during effect cleanup.
- Each subscription set is independent. The same `type` may have multiple listeners.
- Keep listeners small. Put feature-specific parsing and state updates in a hook or store.

Listener data is currently untyped. New features should define a TypeScript payload interface
and validate or guard runtime fields before use.

### `onOpen(listener)`

```ts
const stopOpen = onOpen(() => {
  send("example:join", { resourceId });
});

stopOpen();
```

Use `onOpen()` for initial subscriptions or join commands that must be sent only after the
socket reaches `OPEN`. If the socket is already open, the listener runs immediately.

Remove the listener during effect cleanup.

### `send(type, data)`

```ts
send("example:update", { resourceId: 123, value: "updated" });
```

Messages use this envelope:

```ts
{
  type: "example:update";
  data: {
    resourceId: 123;
    value: "updated";
  };
}
```

`send()` silently does nothing unless the socket is open. For client actions that must send a
state-changing command, rely on `onOpen()` for join/subscribe messages and call `send()` for
commands only after a successful initial state load. Future features may need an explicit
queued-send or ready-state API if that behavior becomes insufficient.

## Existing viewer feature

The drop presence feature demonstrates the intended integration pattern.

Protocol:

- C2S `presence:view`, data `{ dropId: number }`
- C2S `presence:leave`, data `{}` (default payload)
- S2C `presence:drop`, data `{ dropId: number, viewers: Viewer[] }`

`Viewer` has this shape:

```ts
type Viewer = {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};
```

`usePresence(dropId)`:

1. retains the shared connection;
2. registers `presence:drop`;
3. sends `presence:view` whenever the socket opens;
4. filters updates to the current `dropId`;
5. sends `presence:leave` and releases subscriptions on cleanup.

`PresenceWidget` is a client component that passes `dropId` to `usePresence()` and renders
`ViewerStack`. The widget appears on the drop detail page, not in server-rendered drop data.

Changing to a different drop causes the hook effect to clean up and rerun because `dropId`
is an effect dependency.

## Existing server-wide online feature

The global header counter in `src/components/layout/user_count.tsx` uses
`src/hooks/use-online.ts`.

Protocol:

- S2C `hello`, data `{ online: PublicUser[] }`
- S2C `presence:online`, data `{ users: PublicUser[] }`

The initial list is read from `hello.online`. Later updates replace the list using
`presence:online.users`. The feature does not send `presence:online` as a client message:
that name belongs to the server event.

The WebSocket ticket route requires an authenticated session:

```text
POST /api/realtime/ticket -> 401 without a session cookie
```

Consequently, the counter stays empty when no authenticated session is available. It is also
correct to avoid showing this feature as "live" while the ticket request is pending or fails.

## Reconnection behavior

The realtime client reconnects automatically after unexpected socket closure while at least
one consumer remains.

- The retry delay starts at 2 seconds and doubles.
- The delay is capped at 15 seconds.
- A successful connection resets the retry attempt.
- Retry setup is cancelled when the consumer count reaches zero.
- Close codes `4001`, `4008`, and `4009` are considered terminal and do not reconnect.
- Socket closure is currently silent. Ticket failures and unexpected network closures are
  retried, but the UI does not receive a user-facing connection status.

Do not add an independent retry loop to a feature hook. Retain and use the shared client
instead.

## Adding a new realtime feature

Follow this sequence for every new feature:

1. **Agree on the protocol**
   - Add an exact message name, direction, payload shape, and resource identifier.
   - Use namespaces for related events, for example `comments:created`,
     `comments:updated`, or `drop:locked`.
   - Keep event names and payload fields in camelCase, consistent with the API contract.

2. **Create feature types and a hook**
   - Add a payload type near the feature, for example in `src/hooks/use-comments-live.ts`.
   - Call `retain()` in the hook's `useEffect()`.
   - Call `subscribe()` for each server event.
   - Call `onOpen()` for join/view/subscription commands.
   - Remove every listener and release the consumer in cleanup.

3. **Filter by resource**
   - An event such as `drop:updated` may apply to any drop.
   - Compare `data.dropId` with the hook's active resource ID before changing state.
   - Clear feature state on effect cleanup or when the resource changes.

4. **Update REST state safely**
   - Realtime events may arrive before, after, or instead of a REST response.
   - A real-time update should merge with existing state; it should not assume its event is
     the only source of truth.
   - Prefer server authoritative data such as `Drop` or `Comment` payloads when the API
     provides them.
   - Ignore stale or unrelated events by resource ID.

5. **Render in a client component**
   - Hooks using `retain()`, `subscribe()`, or `send()` must live in a component marked
     `"use client"` or be imported only by a client component.
   - Keep data fetching and initial server rendering separate from WebSocket-only updates.

6. **Test lifecycle and duplicates**
   - Opening and closing the component twice must not retain duplicate subscriptions.
   - Switching resources must stop stale updates.
   - Opening the socket after mount must send the correct join command.
   - Reconnection must re-register join/view state through `onOpen()`.
   - Multiple widgets must share one socket and not call `retain()` outside React effects.

7. **Update this document**
   - Add the new event names and payload shapes to the protocol section.
   - Update or add file locations.
   - Document terminal close codes or reconnection changes.
   - Document any new outgoing queue, authentication, or error behavior.

## Example: adding live comments

The following is a pattern for a future comments feature. The names and payloads are
illustrative until the API contract for live comments is confirmed.

```ts
"use client";

import { useEffect, useState } from "react";
import { onOpen, retain, subscribe } from "@/lib/realtime";

type LiveComment = {
  id: number;
  dropId: number;
  content: string;
};

export function useLiveComments(dropId: number) {
  const [comments, setComments] = useState<LiveComment[]>([]);

  useEffect(() => {
    const release = retain();
    const stopOpen = onOpen(() => {
      // send("comments:view", { dropId });
    });
    const stopComment = subscribe("comments:created", (data) => {
      if (data.dropId !== dropId) return;
      setComments((current) => [...current, data.comment]);
    });

    return () => {
      // send("comments:leave", { dropId });
      stopComment();
      stopOpen();
      release();
    };
  }, [dropId]);

  return comments;
}
```

The comments contract must be finalized before this example is treated as an implemented
protocol. Do not send or listen for an event until the API documents it.

## Testing and debugging

Use the browser DevTools Network panel and filter by WebSocket:

- verify that `/api/realtime/ticket` returns a WebSocket URL;
- verify that outgoing frames use the expected `{ type, data }` envelope;
- verify that incoming frames use the same envelope;
- verify that leaving the drop sends `presence:leave`;
- verify that reconnecting sends `presence:view` again;
- verify that only the current drop's `presence:drop` frame changes viewer state.

The browser console does not currently print parsed WebSocket messages or connection errors.
Future debugging features should preserve privacy and avoid logging authenticated payload
content unnecessarily.
