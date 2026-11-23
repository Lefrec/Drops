# Error handling

This document describes how expected failures are returned to users and how unexpected failures are logged and recovered from. Keep it up to date whenever an error path, API helper, session guard, form, or error boundary changes.

## API requests

[src/lib/api/client.ts](src/lib/api/client.ts) is the server-only boundary for requests to the Drops API.

- Requests use `cache: "no-store"` so personalized and changing API data is not served from a stale cache.
- A missing `API_URL` throws a configuration error.
- A network `TypeError` becomes `ApiNetworkError`, with a French message suggesting the user check their connection and retry.
- Non-2xx responses become `ApiError`. The helper parses the API's standard `{ error: ... }` response, preserving `status`, `code`, `fields`, `requestId`, and `Retry-After`. If the body is malformed, it uses a status-based French fallback instead.
- `toActionError()` converts only known API and network errors into serializable action state. It includes field errors for a 422 response when the API provides them. Unknown errors return `null` and should be rethrown by the caller.
- The client does not turn every 404 into a Next.js not-found result. Callers decide whether a 404 means a missing page or a user-visible mutation failure.

API result types and the shared action-state shape are in [src/lib/api/types.ts](src/lib/api/types.ts); the generated API contract is in [src/lib/api/schema.d.ts](src/lib/api/schema.d.ts).

## Session requirements

[src/lib/session.ts](src/lib/session.ts) reads the `session` cookie through `getSessionToken()`, returning a token or `null`. It does not redirect.

Protected server-rendered pages check for a token before making API requests:

- [src/app/drops/page.tsx](src/app/drops/page.tsx) gates the drops list and filters.
- [src/app/drops/add/page.tsx](src/app/drops/add/page.tsx) gates drop creation.
- [src/app/drops/[id]/page.tsx](src/app/drops/[id]/page.tsx) gates drop details.

When no token is present, these pages render [src/components/auth/login_required.tsx](src/components/auth/login_required.tsx), which explains that sign-in is required and links to the login page. The protected content is not fetched. These checks are in components rendered under `Suspense` boundaries so request-time cookie access does not block the rest of the page from rendering.

Server actions independently check the session in [src/app/drops/actions.ts](src/app/drops/actions.ts). A missing token returns a clear login-required action error; authentication is not enforced only by hiding UI.

## Server actions and forms

Expected failures from Server Actions are returned as state for `useActionState`; unexpected failures are thrown and reach an error boundary.

- [src/lib/actions/auth.ts](src/lib/actions/auth.ts) handles known API/network failures from registration and login as form state. Successful authentication stores the token and redirects to `/drops`. Logout clears the local cookie even if remote logout fails; that case redirects to `/auth/login?logout=local`, and [src/app/auth/login/page.tsx](src/app/auth/login/page.tsx) displays a notice.
- [src/app/drops/actions.ts](src/app/drops/actions.ts) validates mutation inputs, calls `toActionError()` for known API/network failures, and returns success state only after the request succeeds. Unexpected errors are rethrown.
- Login and registration field errors are displayed by [src/app/auth/login/login-form.tsx](src/app/auth/login/login-form.tsx) and [src/app/auth/register/register-form.tsx](src/app/auth/register/register-form.tsx).
- Drop creation and editing display 422 field messages next to their controls. Coordinate errors under the API's `location` field are shown by [src/components/drops/location_field.tsx](src/components/drops/location_field.tsx). Non-validation failures use toasts.
- Comment submission displays content validation errors inline and uses a toast for other expected failures. Like failures appear inline; delete failures use a toast.
- [src/components/ui/field.tsx](src/components/ui/field.tsx) provides `FieldError` (`role="alert"`). Toast rendering and management live in [src/components/ui/toast.tsx](src/components/ui/toast.tsx), with the app-level provider mounted by [src/app/layout.tsx](src/app/layout.tsx).

Pending actions disable their submit controls. Do not return success-shaped state when an API request fails.

## Async components and route errors

`Suspense` fallbacks indicate loading; they do not handle errors. An uncaught failure in an async Server Component should bubble to the nearest route error boundary.

- [src/app/drops/[id]/page.tsx](src/app/drops/[id]/page.tsx) converts a 404 for the drop or its comments into `notFound()`. Other errors are rethrown.
- [src/app/drops/error.tsx](src/app/drops/error.tsx), [src/app/auth/login/error.tsx](src/app/auth/login/error.tsx), and [src/app/error.tsx](src/app/error.tsx) provide localized retry UI. The general and drops boundaries also link to login in case the session expired.
- [src/app/global-error.tsx](src/app/global-error.tsx) handles failures that escape the root layout. It defines its own `<html>` and `<body>` as required by Next.js.
- These boundaries log unexpected errors with `console.error`; they avoid exposing server exception details to users.

The API status page is a deliberate exception: [src/app/status/page.tsx](src/app/status/page.tsx) reports “API hors ligne” for non-2xx health responses and network `TypeError`s. Other unexpected errors still propagate to a boundary.

Browser geolocation is handled separately from API errors. [src/lib/use_geoloc.ts](src/lib/use_geoloc.ts) stores the browser result as a status, and [src/components/drops/location_field.tsx](src/components/drops/location_field.tsx) displays the appropriate denied, unavailable, or failure message.

## When changing error handling

When adding or changing an error path:

1. Decide whether it is an expected user-facing failure or an unexpected exception.
2. For API calls, preserve the structured API error through `ApiError`; for actions, return known failures as serializable state and rethrow unknown failures.
3. Ensure 422 field keys are rendered next to the corresponding control, including any API-specific keys such as `location`.
4. Ensure async route failures have a suitable boundary or an intentional local fallback, and keep request-time reads inside an appropriate `Suspense` boundary.
5. Update this document with the changed behavior and the new or changed file locations.
