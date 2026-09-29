---
name: auth-skill
description: Adds authentication with Better Auth on the project's PostgreSQL database with Drizzle, covering sign-up, sign-in, sessions and protected pages. Use this skill whenever the user asks to add authentication, login, sign-up, user accounts, sessions or social login, or mentions Better Auth, even if they only say something like "add login".
---

# Auth

Native: Better Auth with Drizzle on PostgreSQL. If the user asks for another library (Clerk, Auth.js, Supabase Auth), use it and follow its official documentation. If the project already has one, ask whether to keep it or migrate to Better Auth; never run two. If Better Auth is already set up, extend its config, schema and pages instead of recreating them.

## When another skill invokes this one

Set up email and password sign-in with the sign-in and sign-up pages and the header auth state. Reuse the scan already done, and skip the final checks. If the app already has data tables, still ask the sign-in and per-user questions and secure the app as chosen.

## 1. Scan

In one parallel batch, skipping anything already read in this task, read `ui-skill`'s `SKILL.md` (its rules shape the questions below) and scan: the package manifest, the framework and router, `tsconfig` paths, existing auth code, the ORM config and schema, whether `.env` has `DATABASE_URL`, `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` (names only), the UI library, the existing layout and header, the data tables, and every page, route or server action that reads or writes them.

If there's no database or Drizzle yet, invoke `database-skill` first; it sets up the shared Drizzle config.

## 2. Ask once

Ask everything still open in a single `question` call, as separate questions (the tool takes a list), each with its own short options. Skip anything the scan already settled.

- Sign-in methods, only if the user mentioned more than email and password (social providers, magic link, passkey). Otherwise use email and password without asking.
- Features (multiple allowed): email verification, password reset, two-factor authentication, organizations or teams, admin, API keys.
- Email provider, if a feature sends email: **Resend (Recommended)** or log emails to the console for now.
- **Sign-in page layout:** centred card (Recommended) or split with a brand panel.
- **Where the account menu (profile, settings, sign-out) goes:** the places the scan found, such as the header or the sidebar, with the detected one recommended. If no place is clear, ask without recommending.
- **Which pages require sign-in.** List the pages found and let the user pick; pages that show or change data are the recommended defaults.
- **Whether existing data becomes per-user,** so each user sees and changes only their own rows. Name the tables found.
- **Existing rows,** only if some exist and data becomes per-user: assign them to the first user who signs up, delete them, or keep them shared.

For social providers, collect their client ID and secret with a follow-up `question` call.

## 3. Build

Read [better-auth.md](./references/better-auth.md), and [email.md](./references/email.md) only if a chosen feature sends email.

- **Pages:** sign-in, sign-up and account settings (profile and security) with better-auth-ui, and the account menu where the user chose (see `better-auth.md`).
- **Features** (two-factor, organizations, admin, API keys): add the Better Auth plugin on the server and client, and its better-auth-ui plugin, following the plugin's docs page.
- **Secure the app as the user chose:** the chosen pages redirect signed-out users (read `ui-skill`'s `references/access.md`). The pages' routes and server actions return 401 without a session. Per-user tables get a `user_id` foreign key to the auth user table, following the relations rules in `database-skill`'s `drizzle.md` (same type as the user `id`, `cascade` on delete, per-user unique constraints), handle existing rows as chosen, and every read and write on them is scoped to the session user on the server. Implement the three states for every async operation, as the user chose.
- Use the detected package manager, keep existing infrastructure, confirm before breaking changes, never mock session or user data, and don't add emojis unless the project uses them.

## 4. Finish

Go through every answer from the question call and confirm the code reflects it; fix what doesn't. Check that the auth tables exist (migrations ran), that the account menu shows the right state on every page, that a failed sign-in shows an error, that every async operation shows its three states, that signed out, the chosen pages redirect and their API calls return 401, and that signed in, users only see and change their own data where it's per-user. With the dev server running, `curl` each private page and API route without a session and confirm the redirect or 401. Reply in at most five lines: the sign-in methods, the pages, and the environment variables to set in production (`BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` as the production URL, and any provider secrets).
