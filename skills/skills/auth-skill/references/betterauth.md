# Better Auth Reference

This document defines the Better Auth setup, configuration, and UI patterns used by auth-skill.

---

## Setup Guide

When adding authentication with Better Auth, follow these steps. By default, implement email/password authentication only. Only add OAuth providers if the user explicitly requests OAuth or social login.

1. **Database & Drizzle Setup** — follow [drizzle.md](./drizzle.md) first, in full, before continuing here. Do not proceed until the Drizzle connection, config, schema generation, and migrations are complete.

2. **Auth Configuration**
   - Create auth client for React components
   - Set up API routes with `toNextJsHandler`
   - Configure protected routes using `useSession` on pages and `verifyAuth` in API routes

3. **OAuth Providers** (only if user explicitly mentions OAuth, social login, or specific providers like Google/GitHub/Discord)
   - Do NOT add OAuth for generic "add authentication" requests — default to email/password only
   - Add social providers (Google, GitHub, Discord, etc.)
   - Configure OAuth in `auth.ts` with provider secrets
   - Add OAuth buttons to sign-in pages

4. **UI Integration**
   - Create sign-in page with email/password
   - Add OAuth buttons if providers configured
   - Add auth state to navbar/layout
   - Use `useSession` hook for client components

> Always detect project structure, existing middleware/components, and ORM setup first.

---

## Auth Server Config

**File:** `lib/auth.ts`

> For OAuth (only if user explicitly requests), add a `socialProviders` object with provider config. Use the `question` tool to ask the user to provide credentials.

```typescript
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db"; // your drizzle instance

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    emailAndPassword: {
        enabled: true,
    },
  ...(process.env.NODE_ENV !== "production" && {
    advanced: {
      cookies: {
        session_token: {
          attributes: {
            sameSite: "none",
            secure: true
          }
        }
      }
    },
  }),
    trustedOrigins: ["*.e2b.app"]
});
```

> **Next step — Drizzle setup:** `lib/auth.ts` is now in place. Open [./drizzle.md](./drizzle.md) and follow it in sequence: database connection → config → auth schema generation → migrations. Do not continue to the sections below until migrations have run successfully and all auth tables exist in the database.

> **After schema generation:** Once `auth-schema.ts` has been generated, update `lib/auth.ts` to import and pass the schema to the adapter:
>
> ```typescript
> import * as schema from "./auth-schema";
>
> database: drizzleAdapter(db, {
>     provider: "pg", // or "mysql", "sqlite"
>     schema,
> }),
> ```

## Auth Client Config

**File:** `lib/auth-client.ts`

```typescript
"use client"
import { createAuthClient } from "better-auth/react"

// Always use window.location.origin — never hardcode localhost or any URL.
// A hardcoded URL causes "invalid origin" errors in any non-localhost environment.
export const authClient = createAuthClient({
    baseURL: window.location.origin
})

export const { signIn, signUp, useSession } = authClient
```

---

## Auth API Route

**File:** `app/api/auth/[...all]/route.ts`

```typescript
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { GET, POST } = toNextJsHandler(auth)
```

---

## Auth UI

See [./auth-ui.md](./auth-ui.md) for install, Tailwind setup, and all UI integration patterns.
