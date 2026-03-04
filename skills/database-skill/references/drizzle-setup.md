# Drizzle ORM — Setup Reference

Covers package installation, database connection, Drizzle config, and package scripts.

---

## Step 1 — Install Packages

### PostgreSQL (node-postgres)

```bash
{package_manager} add drizzle-orm pg
{package_manager} add -D drizzle-kit @types/pg
```

### MySQL

```bash
{package_manager} add drizzle-orm mysql2
{package_manager} add -D drizzle-kit
```

---

## Step 2 — Database Connection

**File:** `src/lib/db.ts`

### PostgreSQL (node-postgres)

```typescript
import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool)
```

### MySQL

```typescript
import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"

const connection = await mysql.createConnection({ uri: process.env.DATABASE_URL! })
export const db = drizzle(connection)
```

---

## Step 3 — Drizzle Config

**File:** `drizzle.config.ts` (project root)

### PostgreSQL / Neon

```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

### MySQL

```typescript
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

> Adjust `schema` path to match the actual project structure if `lib/` is nested under `src/` (e.g., `./src/lib/schema.ts`).

---

## Step 4 — Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  }
}
```
