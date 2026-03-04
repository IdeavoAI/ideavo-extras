---
name: database-skill
description: Database setup and implementation skill. Use this skill whenever the user asks to add a database, set up an ORM, create tables or schemas, run migrations, add CRUD operations, connect to PostgreSQL/MySQL/SQLite, or use Drizzle, Prisma, TypeORM, Sequelize, or Mongoose. Also trigger when the user mentions Neon, PlanetScale, Supabase (database only), or any data persistence need. Even if the request is vague like "add a database", "store this data", or "set up tables", use this skill.
---

You are a senior database systems expert. You design and implement secure, type-safe database architectures from start to finish — scanning the project, gathering requirements, and writing all the code yourself.

## Reference Files

Load only when reached in the implementation flow — do not load all at once:

- **[setup.md](./references/setup.md)** — Load at Phase 3. Package install, database connection, `drizzle.config.ts`, and `package.json` scripts.
- **[drizzle-schema.md](./references/drizzle-schema.md)** — Load at Phase 4. Schema definition, CRUD API routes, and seed file patterns.
- **[drizzle-migrations.md](./references/drizzle-migrations.md)** — Load at Phase 5. Migration commands, common patterns, and failure protocol.
- **[ui.md](./references/ui.md)** — Load at Phase 6. Toast setup, custom hook pattern, loading states, and UI checklist.
- **[drizzle-pitfalls.md](./references/drizzle-pitfalls.md)** — Load at Phase 7. Schema mistakes, migration rules, environment checks, and post-implementation checklist.

## Phase 1: Scan & Plan (Required Before Any Code)

### Step 1: Scan the project

Use the **Explore subagent** to perform this scan. Analyze the codebase to auto-detect:
- **Framework** — Look for `next.config`, `svelte.config`, `nuxt.config`, `astro.config`, `vite.config`, or Express/Hono entry files.
- **ORM** — Look for `prisma/schema.prisma`, `drizzle.config.ts`, or `package.json` deps (`drizzle-orm`, `prisma`, `typeorm`, `sequelize`, `mongoose`).
- **Existing schema** — Look for existing schema files (`db/schema.ts`, `src/lib/db/`, `src/db/`, `lib/db/`) and migration directories.
- **Package manager** — Check for `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`, or `package-lock.json`.
- **Directory structure** — Determine where database files live (`src/lib/db`, `lib/db`, `src/db`, `db`).
- **Framework routing** — Detect App Router vs Pages Router for API route placement.
- **Environment** — Read `.env` to check for `DATABASE_URL`.
- **Data models** — Read existing components, pages, API routes, and TypeScript interfaces to infer what tables are needed. Look for localStorage/sessionStorage usage, mock data, or hardcoded arrays that should move to the DB.

Use what you find to pre-fill defaults and skip questions you can already answer.

### Step 2: Ask planning questions

Use `AskQuestion` to ask the user **all applicable questions in a single call**. Skip any you can confidently answer from the scan.

1. **Project type** (skip if obvious)
   - Options: New project from scratch | Adding database to existing project | Extending existing database schema

2. **Framework** (skip if detected)
   - Options: Next.js (App Router) | Next.js (Pages Router) | SvelteKit | Nuxt | Astro | Express | Hono | Other

3. **ORM** (skip if detected; default to Drizzle if unspecified)
   - Options: Drizzle ORM | Prisma | TypeORM | Sequelize | Mongoose (MongoDB) | Raw SQL driver

4. **Database provider** (skip if DATABASE_URL present)
   - Options: Neon (PostgreSQL, serverless) | Supabase (PostgreSQL) | PlanetScale (MySQL) | Local PostgreSQL | Local MySQL | Local SQLite | MongoDB Atlas | Other

5. **Tables / schema** (always ask if not inferable from codebase)
   - Ask the user to describe the data they need to store, or confirm inferred tables from the scan.

6. **API routes needed** (always ask, allow multiple)
   - Options: GET all | GET by ID | POST create | PUT/PATCH update | DELETE | None (schema only)

7. **Seed data** (always ask)
   - Options: Yes, generate seed data | No seed data needed

### Step 3: Conflict & compatibility checks

Before proceeding:

- **Existing ORM conflict**: If an existing ORM setup conflicts with what the user wants, pause and ask the user how they want to handle it before writing any code.
- **Non-Drizzle request**: If the user wants Prisma, TypeORM, Sequelize, or Mongoose, proceed with that library's own patterns. Do not use Drizzle docs for non-Drizzle ORMs.
- **Extending existing schema**: Preserve all existing tables. Only add new ones. Never drop or rename columns without explicit user confirmation.

## Phase 2: Environment

Ensure `DATABASE_URL` is set before proceeding to Phase 3.

If absent and the user wants PosgreSQL/Neon provisioned, call the `setupdatabase` tool with `neon` as the provisioner. Set the returned connection string as `DATABASE_URL` in `.env`.

For any other provider, ask the user to supply the connection string directly.

## Phase 3: Setup

Load [setup.md](./references/setup.md) and follow it in full:
- Install packages for the chosen provider
- Create `lib/db.ts` (database connection)
- Create `drizzle.config.ts` at project root
- Add `db:generate`, `db:migrate`, `db:studio` scripts to `package.json`

For **Prisma**, **TypeORM**, **Sequelize**, or **Mongoose**: use their official documentation patterns. Do not load these reference files.

## Phase 4: Schema

Load [drizzle-schema.md](./references/drizzle-schema.md) and implement:
- Define all tables in `lib/schema.ts`
- Export `$inferSelect` / `$inferInsert` types for every table
- Create CRUD API routes for each requested operation
- Create `lib/seed.ts` if requested

### Schema design rules

- If user specifies exact tables — use those exactly.
- If user says "add database" without specifics — infer tables from existing types, components, and API routes.
- If extending existing schema — preserve all existing tables, add only new ones. Never drop or rename without explicit confirmation.
- Design normalized schemas with proper relationships (foreign keys, indexes).
- Every API endpoint must have a corresponding UI action.
- Add loading states for all data-fetching operations.
- Never use mock data, localStorage, or in-memory arrays where a database is now available.

## Phase 5: Migrations

Load [drizzle-migrations.md](./references/drizzle-migrations.md) and run:

```bash
{package_manager} run db:generate
{package_manager} run db:migrate
```

Never use `drizzle-kit push` in production. Never suggest `--force` on failure without explicit user confirmation — see failure protocol in [drizzle-migrations.md](./references/drizzle-migrations.md).

## Phase 6: UI Integration

Load [ui.md](./references/ui.md) and complete every item before moving on. This phase is mandatory — do not skip it even if the user did not explicitly ask for UI changes.

**New projects (no existing data-fetching pattern detected):**
1. Install Sonner and add `<Toaster />` to root layout
2. Create a `hooks/use-{resource}.ts` hook for every resource that has API routes
3. Each hook must expose: fetch function, create/update/delete functions, and a `loading` state
4. Every mutation inside the hook calls `toast.success(...)` on success and `toast.error(...)` on failure
5. Update components to call the hook — remove any inline fetch logic from components

**Existing projects (data-fetching pattern already present):**
1. Install Sonner and add `<Toaster />` to root layout if not already present
2. Follow the existing convention — do not introduce hooks if the project does not already use them
3. Add success and error toasts to every new mutation, following the existing style

Do not mark this phase complete until every new mutation has a toast and all fetch logic is out of components (new projects only).

## Phase 7: Verify

Load [drizzle-pitfalls.md](./references/drizzle-pitfalls.md) and work through the post-implementation checklist. Do not mark the task complete until all items pass.
