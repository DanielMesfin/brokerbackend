# Social Media Starter (SMS)

This workspace contains a minimal scaffold for a Social Media app:

- `backend/` — NestJS + Prisma (Postgres recommended) API server on port `3001`
- `frontend/` — Next.js app on port `3000` that calls the backend

This update converts the frontend to TypeScript and adds JWT auth and media upload support to the backend. Use the new endpoints:

- `POST /api/auth/register` { email, password }
- `POST /api/auth/login` { email, password } -> { accessToken }
- `POST /api/posts` multipart form with `content` and optional `media` file (authenticated)
- `GET /api/posts` list posts (media served from `/public/uploads`)
Additional endpoints added:

- `GET /api/auth/me` — return current user (requires `Authorization: Bearer <token>`)
- `POST /api/posts/:id/like` — body `{ userId }` to like a post
- `DELETE /api/posts/:id/like` — body `{ userId }` to unlike
- `POST /api/posts/:id/comment` — body `{ userId, content }` to add a comment
- `GET /api/posts/:id/comments` — list comments for a post
- `POST /api/users/:id/follow` — body `{ followerId }` to follow user
- `DELETE /api/users/:id/follow` — body `{ followerId }` to unfollow

Quick start (PowerShell):

```powershell
# 1) Backend
cd backend
npm install
npm run start:dev

# 2) Frontend (in a new terminal)
cd frontend
npm install
npm run dev
```

Using Docker (recommended for production-like local environment):

```powershell
# Start Postgres and Redis locally
cd c:\Users\Daniel.Mesfin\Desktop\SMS\social_network_backend
docker-compose up -d

# Then start backend/frontends as above (or build images)
```

Prisma (if you use Postgres):

```powershell
cd backend
npm install
# generate client
npx prisma generate
# run migrations (create initial migration after editing prisma/schema.prisma)
npx prisma migrate dev --name init
```

Notes
- Backend is a small NestJS app exposing `POST /api/posts` and `GET /api/posts`.
- SQLite DB file is `backend/db.sqlite` (auto-created).
- This scaffold is minimal — extend with auth, uploads, and production configs.
