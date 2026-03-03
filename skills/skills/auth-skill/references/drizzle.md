# Drizzle ORM Reference

This document defines the Drizzle ORM setup, schema, and migration patterns used by auth-skill.

---

## Setup

Follow these steps in sequence.

### Step 1 - Install packages

```bash
{package_manager} add drizzle-orm pg
{package_manager} add -D drizzle-kit @types/pg
```

---

## Database Connection (PostgreSQL)

**File:** `lib/db.ts`

```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool)
```

## Auth Schema (PostgreSQL)

> **Note for auth:** Never write the auth schema manually — Better Auth generates it via CLI command.

```bash
yes | {package_manager}x @better-auth/cli@latest generate --output src/lib/auth-schema.ts --config src/lib/auth.ts
# If using TSX: --config src/lib/auth.tsx
```

---

---

## Drizzle Config (PostgreSQL)

**File:** `drizzle.config.ts` (project root)

```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/auth-schema.ts", // modify file name accordingly
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

---

## Migration Commands

Generate migration:
```bash
{package_manager} run drizzle-kit generate
```

Run migration to database:
```bash
{package_manager} run drizzle-kit migrate
```

- **Always** use `generate` + `migrate` instead of direct push.

### Migration Failure Protocol

If `drizzle-kit migrate` or `drizzle-kit push` fails with schema conflicts:

1. Never automatically suggest the `--force` flag.
2. Warn the user: "Migration failed due to [specific error]. The `--force` flag can resolve this but may wipe/reset your database, causing permanent data loss. Options: (1) Fix schema conflicts manually, (2) Use `--force` (destructive — may delete data), (3) Cancel."
3. Only proceed with `--force` if the user explicitly confirms they understand the data loss risk.
4. If the user chooses to fix manually, help them analyze the error and adjust the schema.

> The `--force` flag with drizzle-kit can drop tables, delete data, and reset database state. Only use when explicitly confirmed by the user after explaining consequences.
