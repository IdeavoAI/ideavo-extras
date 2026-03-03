# Drizzle Schema & CRUD Reference

Schema definition and seed file patterns.

- Setup (install, connection, config, scripts) — see [setup.md](./setup.md)
- Migrations — see [drizzle-migrations.md](./drizzle-migrations.md)
- API routes & custom hooks — see [ui.md](./ui.md)

---

## Implementation Order

1. Setup — see [setup.md](./setup.md)
2. Schema — define tables in `lib/schema.ts` (below)
3. Migrations — see [drizzle-migrations.md](./drizzle-migrations.md)
4. API routes & hooks — see [ui.md](./ui.md)
5. Seed data — create `lib/seed.ts` if requested (below)

---

## Schema

**File:** `lib/schema.ts`

### PostgreSQL / Neon

```typescript
import { pgTable, uuid, serial, text, timestamp } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

### MySQL

```typescript
import { mysqlTable, serial, varchar, timestamp } from "drizzle-orm/mysql-core"

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
```

Always export `$inferSelect` and `$inferInsert` for every table. Never use `any` for database records.

---

## Seed File

**File:** `lib/seed.ts`

```typescript
import { db } from "./db"
import { tableName } from "./schema"

async function seed() {
  await db.insert(tableName).values([
    { /* record 1 */ },
    { /* record 2 */ },
  ])
  console.log("Seeded successfully")
}

seed().catch(console.error).finally(() => process.exit())
```
