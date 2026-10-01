# Drizzle with PostgreSQL

Put new files where the project keeps shared server code, and import them with the project's alias. If there's no such place yet, use `src/lib` when `src/` exists, otherwise `lib`. Below, `<lib>` means that folder.

## Setup

- Install `drizzle-orm`, `pg` and `dotenv`, and as dev dependencies `drizzle-kit` and `@types/pg`, with the project's package manager.
- `<lib>/db.ts`, server only: `export const db = drizzle(new Pool({ connectionString: process.env.DATABASE_URL }))`, from `drizzle-orm/node-postgres` and `pg`.
- One `drizzle.config.ts` at the project root: `import "dotenv/config"`, `dialect: "postgresql"`, `out: "./drizzle"`, `dbCredentials: { url: process.env.DATABASE_URL! }`, and a `schema` that covers **every** schema file (a folder, glob or array, including `auth-schema.ts` when auth is set up). If the file exists, extend its `schema`; never replace it with a narrower one, or migrations silently skip tables.
- Scripts: `db:generate` (`drizzle-kit generate`), `db:migrate` (`drizzle-kit migrate`), `db:studio` (`drizzle-kit studio`).

## Schema

- Keep tables in the project's schema file or folder, and export `$inferSelect` and `$inferInsert` types for each.
- Never change a primary key's type. Store money as integers (`bigint`), never floats or decimals. Index foreign keys.
- Validate route input with schemas from `drizzle-zod` (`createInsertSchema`, `createUpdateSchema`); install it, and `zod` if the project lacks it, when adding the first route.

## Relations and constraints

- A foreign key has exactly the type of the key it references (Better Auth's `user.id` is `text`).
- Choose `onDelete` on purpose: `cascade` for data the parent owns, `set null` or `restrict` for records that must survive, such as purchases.
- Adding a required column to a table with rows takes three steps, each its own generated and applied migration: add it nullable, fill it as the user chose, then set `NOT NULL`. Never fill it with placeholder values; if rows stay shared, it stays nullable.
- When data becomes per-user, unique constraints usually become per-owner, for example `unique(name)` becomes `unique(user_id, name)`.
- Before adding a unique constraint, foreign key or `NOT NULL`, check existing rows for violations and ask the user how to resolve them.

## Migrations

- Always `db:generate` then `db:migrate`, before starting the app. Never `drizzle-kit push`, and never edit an existing migration file. Commit the generated `drizzle/meta` snapshots.
- If a migration fails on existing data (for example a new `NOT NULL` column), migrate the data first, then add the constraint.
- If a migration fails, never add `--force` yourself. Explain the error and let the user choose: fix the schema, run with `--force` (it can delete data), or stop.

## Docs

Fetch a page only if a step here doesn't cover it or a command fails.

- Neon in an existing project: https://orm.drizzle.team/docs/get-started/neon-existing
- Config file: https://orm.drizzle.team/docs/drizzle-config-file
- Schema: https://orm.drizzle.team/docs/sql-schema-declaration
- PostgreSQL column types: https://orm.drizzle.team/docs/column-types/pg
- Migrations: https://orm.drizzle.team/docs/kit-overview
- drizzle-zod: https://orm.drizzle.team/docs/zod
