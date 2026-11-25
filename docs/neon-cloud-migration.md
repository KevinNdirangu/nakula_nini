# Kwa Mathe cloud data foundation

## Current state
The app currently stores its complete working state in browser local storage
under `kwa-mathe-data-v1`. Do not remove or rename that key during migration.

## Neon connection
Vercel's Neon integration provides `DATABASE_URL` and related PostgreSQL
connection variables. These are server-only secrets. Never prefix them with
`VITE_` or expose them to browser code.

Neon Auth is configured separately through `VITE_NEON_AUTH_URL`, which is
a public auth-service URL and may be used by the browser authentication client.

## Migration strategy
1. Authenticate a user with Neon Auth.
2. Read the existing `kwa-mathe-data-v1` object without modifying it.
3. Upload the entire object to that user's cloud record.
4. Read it back and compare it with the original before enabling cloud-first saves.
5. Keep the local copy as a recoverable cache until the user explicitly confirms
   that cloud data is present and verified.

## Database
The initial migration creates `public.kwa_mathe_user_data`, one JSONB document
per authenticated user. This deliberately mirrors the existing local state
shape, avoiding a risky premature rewrite of the app's many save points.
RLS is enabled immediately. No public access policy is created until the
authentication and database access path is implemented and verified.

Apply `migrations/001_kwa_mathe_user_data.sql` to the Neon production branch
only after reviewing the SQL. Do not apply it to Ledger or TV Tracker.
