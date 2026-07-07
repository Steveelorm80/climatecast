# Deployment Checklist (go-live on unified backend)

Status: Phase 1 code complete and verified locally. Remaining:

## 1. Neon (database)
- Create free project at https://neon.tech
- Copy the JDBC connection details:
  - `JDBC_DATABASE_URL` = `jdbc:postgresql://<host>/<db>?sslmode=require`
  - `JDBC_DATABASE_USERNAME`, `JDBC_DATABASE_PASSWORD`

## 2. Render (backend)
- New Web Service → Docker runtime
- Root directory: `backend/climatecast-api`
- Environment variables:
  - `OPENWEATHER_API_KEY`
  - `JDBC_DATABASE_URL`, `JDBC_DATABASE_USERNAME`, `JDBC_DATABASE_PASSWORD`
  - `ALLOWED_ORIGINS=https://climatecast-app.vercel.app,http://localhost:3000`
- Delete the two old Render services (weather + event) once live.

## 3. Vercel (frontend)
- Project settings → Environment Variables:
  - `NEXT_PUBLIC_API_URL` = new Render service URL
- Redeploy.

## Phase 2 additions (once auth is set up)
- Render: `CLERK_JWKS_URL` = `https://<your-clerk-domain>/.well-known/jwks.json`
- Vercel: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`
