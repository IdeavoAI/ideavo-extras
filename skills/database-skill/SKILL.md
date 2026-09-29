---
name: database-skill
description: Sets up a PostgreSQL database with Drizzle ORM (Neon is provisioned natively) and adds tables and migrations. Use this skill whenever the user asks to add a database, store data, create tables or schemas, or run migrations, or mentions Drizzle, Neon or PostgreSQL, even if they only say something like "save this data" or "add a database".
---

# Database

Native: PostgreSQL with Drizzle ORM. Neon is provisioned through the `integration` tool, and the user's own PostgreSQL URL works too. If the project already uses another ORM or database, keep it and follow its official documentation; never switch or add a second one.

## When another skill invokes this one

Do only the setup: the connection, Drizzle, the tables that skill asks for, and migrations. Reuse the scan already done, ask only what's missing, and skip API routes, UI and the final checks.

## 1. Scan

In one parallel batch, skipping anything already read in this task, read `ui-skill`'s `SKILL.md` (its rules shape the questions below) and scan: the package manifest, `tsconfig` paths, existing ORM config and schema files, the migrations folder, whether `.env` has `DATABASE_URL` (the name only), where shared server code lives (`src/lib`, `lib`, `server` or `db`), the router style, and the app's current data sources: `localStorage` or `sessionStorage`, mock data, hardcoded arrays and in-memory stores, with the types, components and routes that use them.

## 2. Ask once

Ask everything still open in a single `question` call, as separate questions (the tool takes a list), each with its own short options. Skip anything the scan already settled.

- Database, unless `DATABASE_URL` exists: **provision Neon (Recommended)** or use their own PostgreSQL URL.
- The tables, inferred from the request and the current data sources.
- The API operations the UI needs (list, get, create, update, delete), inferred from how the app uses the data.
- Seed data: **seed the existing sample data (Recommended when mock data exists)** or start empty.

## 3. Build

Read [drizzle.md](./references/drizzle.md). To provision Neon, call the `integration` tool with `type: "database"` and `provider: "neon"` and write the returned `DATABASE_URL` to `.env`. Then set up Drizzle, define the tables and run the migrations as `drizzle.md` says.

- **Payment tables:** follow [payments-schema.md](./references/payments-schema.md), and never add generic create, update or delete routes for them.
- **Schema:** normalized, with foreign keys between related tables. When extending, keep existing tables and never drop or rename a column without the user's confirmation.
- **API routes** for each chosen operation, in the framework's route convention: validate input with `drizzle-zod`, write only the fields the route allows (never the raw request body), and wrap database calls so errors return a friendly message.
- **Wire the app:** replace every `localStorage`, mock or in-memory data source with these routes, following the project's existing data-fetching convention, following `ui-skill`'s rules for layout, states and forms. Every route has a matching UI action, and every async operation gets its three states, as the user chose.
- **Seed**, if chosen: `<lib>/seed.ts` and a `db:seed` script.

## 4. Finish

Go through every answer from the question call and confirm the code reflects it; fix what doesn't. Check that the migrations ran, that no `localStorage`, mock or in-memory source remains for the moved data, that every route has a UI action, that every async operation shows its three states, and that code uses the inferred types (no `any`). With the dev server running, call each new API route once with `curl` and confirm it responds as expected. Reply in at most five lines: the tables added, where the schema lives, and the database scripts.
