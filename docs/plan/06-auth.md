# Phase 06 — Firebase Auth

## Deliverables

- `packages/auth`:
  - `firebase.ts` initializes the client SDK from `import.meta.env`.
  - `useAuth()` hook returning `{ user, status, signIn, signUp, signOut,
    sendReset, signInWithGoogle, signInWithApple }`.
  - `<RequireAuth roles={[...]} />` route guard component.
  - `<RedirectIfAuthed />` for `/auth/*` pages.
- Server-side: a tiny verifier helper that decodes the Firebase ID token and
  upserts the matching `users` row in Postgres on first sign-in (called on
  app boot, not on every request).
- TanStack Router context exposes the auth user so loaders can branch.

## UI

- Login (`/auth/login`) — matches the "Welcome Back" screen exactly:
  email + password, remember me, forgot password, Sign In CTA, Google + Apple
  OAuth, Request Access link to `/auth/register`.
- Register (`/auth/register`) — "Create Your Curator Account" form with the
  underlined input style. ToS + Privacy checkbox is required.
- Reset (`/auth/reset`) — side-by-side image + form layout per Figma.

## Env

`.env.example`:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
DATABASE_URL=postgres://rocksa:rocksa@localhost:5432/rocksa
```

## Acceptance

- E2E happy path: register → email/password sign-in → access workspace → sign
  out. Covered by Vitest with the Firebase emulator.
