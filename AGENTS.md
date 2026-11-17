## Project context

This project is part of an advanced frontend developpement course.

The goal is to create the frontend of an application based on an existing API.

The app's purpose is to create and share "Drops", they are geographical points with text, pictures or riddles attached.

It is a short scoped project in the span of 6 days centered around the MMI Department (where the course takes place).

## Features

- Basic UI in french
- Authentification
- Profile customization
- Creating, updating and deleting drops
- Listing drops, filtering by category
- Liking and commenting drops
- Reporting drops or comments

## Tech Stack

- Framework : Next
- Code Hosting : GitHub
- Deployement : Vercel
- API : Custom Nodejs API detailed below

## Custom API details

The API is accessed at `drops-api-production.up.railway.app`.

Documentation for it is readable at `drops-api-production.up.railway.app/docs`.

OpenAPI specification is at `drops-api-production.up.railway.app/openapi.json`.

### API Contract

JSON, camelCase, dates ISO 8601 UTC, ids full. Auth : `Authorization: Bearer <token>` (no cookie).
Token exists but is invalid, expired or revoked get 401 on all routes, even public ones.
Strict body : unknown field = 422, no type conversion (`"47.4"` is not a number).
Interactive doc : /docs. Specification : /openapi.json.

#### Types

```ts
type Category = "note" | "photo" | "tip" | "riddle";
type ReportReason = "spam" | "offensive" | "personal_info" | "other";
interface PublicUser {
  id: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}
interface PrivateUser extends PublicUser {
  email: string;
  bio: string | null;
  createdAt: string;
}
interface Profile extends PublicUser {
  bio: string | null;
  createdAt: string;
  stats: { dropsCount: number; likesReceived: number; commentsCount: number };
}
interface Drop {
  id: number;
  title: string;
  content: string | null;
  category: Category;
  imageUrl: string | null;
  location: { lat: number; lng: number; precision: "exact" | "approx" };
  locked: boolean;
  hidden: boolean;
  author: PublicUser;
  likesCount: number;
  commentsCount: number;
  opensCount: number;
  likedByMe: boolean;
  openedByMe: boolean;
  isMine: boolean;
  createdAt: string;
  updatedAt: string;
}
interface Comment {
  id: number;
  dropId: number;
  content: string;
  author: PublicUser;
  isMine: boolean;
  createdAt: string;
}
interface CategoryItem {
  id: Category;
  label: string;
}
interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
interface AuthResponse {
  user: PrivateUser;
  token: string;
  expiresAt: string;
}
interface ApiError {
  error: {
    status: number;
    code: string;
    message: string;
    fields: Record<string, string[]>;
    requestId: string;
    simulated: boolean;
  };
}
```

`likedByMe`, `openedByMe`, `isMine` are `false` without token. `hidden` is only `true` for the author.
Pagination : `?page=1` (≥1), `?pageSize=20` (1 to 50). Page after end : 200 with `items: []`.

#### Routes

Access : public, token? (optional token), token, admin (`X-Admin-Key`). Format : success | possible errors.

```
GET    /                            public      200 | 429,500
GET    /health                      public      200,503 | 500
GET    /docs                        public      200 | 500
GET    /openapi.json                public      200 | 500
GET    /contract.md                 public      200 | 500
POST   /auth/register               public      201 | 400,409,422,429,500
POST   /auth/login                  public      200 | 400,401,422,429,500
POST   /auth/logout                 token       204 | 401,429,500
GET    /auth/me                     token       200 | 401,429,500
PATCH  /auth/me                     token       200 | 400,401,422,429,500
GET    /users/{username}            token?      200 | 401,404,429,500
GET    /categories                  public      200 | 429,500
GET    /drops                       token?      200 | 401,422,429,500
GET    /drops/{id}                  token?      200 | 401,404,429,500
POST   /drops                       token       201 | 400,401,422,429,500
PATCH  /drops/{id}                  token       200 | 400,401,403,404,422,429,500
DELETE /drops/{id}                  token|admin 204 | 401,403,404,429,500
POST   /drops/{id}/like             token       200 | 401,404,429,500
DELETE /drops/{id}/like             token       200 | 401,404,429,500
GET    /drops/{id}/comments         token?      200 | 401,404,422,429,500
POST   /drops/{id}/comments         token       201 | 400,401,404,422,429,500
DELETE /comments/{id}               token       204 | 401,403,404,429,500
POST   /drops/{id}/report           token       202 | 400,401,403,404,422,429,500
POST   /admin/reset                 admin       200 | 400,403,422,500
GET    /admin/reports               admin       200 | 403,500
POST   /admin/drops/{id}/unhide     admin       200 | 403,404,500
```

#### Errors

Unique format, `fields` always present (key = field's body or parameter, value = messages) :
`{ "error": { "status": 422, "code": "validation_failed", "message": "…", "fields": { "title": ["…"] }, "requestId": "req_…", "simulated": false } }`

400 bad_request · 401 unauthorized, invalid_token, token_expired, token_revoked, invalid_credentials · 403 forbidden
404 not_found · 409 conflict · 422 validation_failed · 429 rate_limited (Retry-After) · 500 internal_error · 503 service_unavailable
Coordinate errors (type, boundaries, 3 km zone around the MMI department): always under the `location` key.

#### Educational tools

- `?delay=<ms>` (0 to 10000) on all routes.
- `?fail=<statut>` (400, 401, 403, 404, 409, 422, 429, 500, 503) : request not executed, error with `simulated: true` and `X-Simulated: true`.
  `fail=422` put « Erreur simulée sur ce champ. » under every field's body. `fail=429` add `Retry-After: 5`.
- `POST /auth/login?ttl=<secondes>` (10 to 28800) : short duration token.
- Demo account : `demo` / `drops2026` (other names : same password).

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.
