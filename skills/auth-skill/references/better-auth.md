# Better Auth

Follow the version installed in the project; when unsure, check the docs below for that version. Put files in the same shared server folder as the database code (`<lib>`, as in `database-skill`'s `drizzle.md`).

## Server

- `<lib>/auth.ts`: `betterAuth({ database: drizzleAdapter(db, { provider: "pg", schema }), emailAndPassword: { enabled: true } })`, plus the chosen social providers.
- `.env`: `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`, never print it). Don't set `BETTER_AUTH_URL` in development; the preview hosts below resolve the URL. It's set only in production, as the handoff lists.
- **Preview hosts:** the sandbox app is reached through the preview hosts listed in the environment, not localhost. Outside production, set `baseURL: { allowedHosts: [<production host>, <preview hosts>, "localhost:*"], fallback: process.env.BETTER_AUTH_URL }`. On versions without the object form, add them to `trustedOrigins` as `https://<host>` instead.
- **Cookies in the preview iframe:** outside production, set `advanced.defaultCookieAttributes` to `{ sameSite: "none", secure: true }`, adding `partitioned: true` if the installed version accepts it. Production keeps the defaults.

## Schema

Generate the auth tables; never write them by hand:

```bash
npx auth@latest generate --config <lib>/auth.ts --output <schema folder>/auth-schema.ts -y
```

Use the project's package runner. Add `auth-schema.ts` to `drizzle.config.ts`'s `schema` and pass it to `drizzleAdapter`, then run `db:generate` and `db:migrate`. A 500 error right after setup usually means the migrations haven't run.

## Route handler

| Framework | Handler |
|---|---|
| Next.js App Router | `app/api/auth/[...all]/route.ts`: `export const { GET, POST } = toNextJsHandler(auth)` from `better-auth/next-js` |
| Express | `app.all("/api/auth/*", toNodeHandler(auth))` from `better-auth/node` (Express 5: `"/api/auth/*splat"`), registered before `express.json()` |
| Hono | `app.all("/api/auth/*", (c) => auth.handler(c.req.raw))` |
| Others | See the integrations in the docs |

## Client and sessions

- `createAuthClient({ baseURL: window.location.origin })` from the framework's client package (for example `better-auth/react`). Never a hardcoded URL.
- Gate private pages in one place: group them under one layout (a route group in Next.js) that checks `auth.api.getSession({ headers })` on the server and redirects to `/auth/sign-in?redirectTo=<path>`. API routes and server actions check the session themselves; a proxy or middleware cookie check is only a faster redirect, never the gate.
- After sign-in and sign-out, server-rendered pages must re-run their session check. In Next.js, pass `navigate={({ to, replace }) => { replace ? router.replace(to) : router.push(to); router.refresh() }}` to `AuthProvider`, and send sign-out to `/auth/sign-in`, so private pages redirect immediately.
- Show sign-in errors in the form; don't let a failed attempt just clear the fields.

## Pages with better-auth-ui

The default for projects on shadcn/ui (or with no component library yet). If the project already uses the older `@daveyplate/better-auth-ui` package, keep it and follow its installed version instead of adding these components. Before writing these files, read https://better-auth-ui.com/docs/shadcn/integrations/nextjs.md; its example enables every plugin, so keep only the chosen sign-in methods.

1. `npx shadcn@latest add @better-auth-ui/auth @better-auth-ui/user-button @better-auth-ui/settings`, and add the settings route as the guide shows, so the menu's profile and settings links work. Make sure `sonner` and `@tanstack/react-query` are installed.
2. A shared query client and a providers component: `QueryClientProvider` around `AuthProvider` (with the auth client, `navigate`, `Link` and a `redirectTo` after sign-in), and the `Toaster`. Wrap the root layout with it.
3. `app/auth/[path]/page.tsx` renders `<Auth path={path} />` inside the chosen sign-in layout, for the paths in `viewPaths.auth`, and `notFound()` for anything else.
4. With social providers configured, their buttons appear on the sign-in page (pass them to `AuthProvider`'s `socialProviders`).
5. **Account menu, on every page, where the user chose,** as `ui-skill`'s `access.md` describes: signed out, a "Sign in" button in the app's style; signed in, the `UserButton` with `links` for Profile (`/settings/account`), Security (`/settings/security`) and any app pages that need sign-in, such as the plan page, all with `visibility: "authenticated"`, and, if the app has dark mode, the theme toggle through better-auth-ui's `themePlugin`.

Projects on another component library build sign-in and sign-up with it, following `ui-skill`.

## Docs

Fetch a page only if a step here doesn't cover it or a command fails.

- Installation: https://better-auth.com/docs/installation.md
- Options (baseURL, trustedOrigins, cookies): https://better-auth.com/docs/reference/options.md
- CLI: https://better-auth.com/docs/concepts/cli.md
- Drizzle adapter: https://better-auth.com/docs/adapters/drizzle.md
- Next.js: https://better-auth.com/docs/integrations/next.md
- Express: https://better-auth.com/docs/integrations/express.md
- Hono: https://better-auth.com/docs/integrations/hono.md
- OAuth providers: https://better-auth.com/docs/concepts/oauth.md
- Plugins: two-factor https://better-auth.com/docs/plugins/2fa.md, organization https://better-auth.com/docs/plugins/organization.md, admin https://better-auth.com/docs/plugins/admin.md, API keys https://better-auth.com/docs/plugins/api-key.md, magic link https://better-auth.com/docs/plugins/magic-link.md, passkey https://better-auth.com/docs/plugins/passkey.md
- better-auth-ui for shadcn/ui: https://better-auth-ui.com/docs/shadcn.md
