# Drizzle ORM Pitfalls

Common mistakes and correct patterns. Load this after implementation to verify correctness.

---

## Schema

**Never change primary key types** — `serial` to `uuid` or `varchar` breaks existing migrations and requires a destructive rebuild.

**Array columns** use method chaining, not a wrapper:
```typescript
// correct
allowedTokens: text("allowed_tokens").array()

// wrong
array(text("allowed_tokens"))
```

**Always export inferred types** for every table:
```typescript
export type Strategy = typeof strategies.$inferSelect
export type NewStrategy = typeof strategies.$inferInsert
```

Never use `any` for database records — always use `$inferSelect` / `$inferInsert`.

**Use drizzle-zod for input validation** at API boundaries:
```typescript
import { createInsertSchema } from "drizzle-zod"

export const insertStrategySchema = createInsertSchema(strategies)
```

---

## Migrations

- Never modify existing migration files — create a new one.
- Never run `drizzle-kit push` in production — always use `generate` + `migrate`.
- `drizzle.config.ts` schema path must match the actual schema file location — a mismatch produces empty or wrong migrations.
- Migrations must be generated and run before starting the app — a successful connection with no tables causes runtime errors.

---

## Environment

- `DATABASE_URL` must be present in `.env` before running the app or migrations.
- Never hardcode connection strings — always use `process.env.DATABASE_URL!`.

---

## Post-Implementation Checklist

Verify before marking implementation complete:

- `DATABASE_URL` is set in `.env`
- `drizzle.config.ts` schema path matches actual schema file location
- `db:generate` and `db:migrate` completed without errors
- `$inferSelect` / `$inferInsert` types exported from `schema.ts` and used throughout — no `any`
- No primary key type changes introduced
- Array columns use `.array()` chaining syntax
- All localStorage / in-memory data call sites migrated to DB-backed routes
- Every API endpoint has a corresponding UI action
- Existing tables preserved when extending schema

---

## UI Checklist

These must already be complete — UI integration is done in Phase 6 before reaching this checklist. If any item is missing, go back and fix it before marking the task done.

- `<Toaster />` added to root layout (once only)
- Every mutation (create, update, delete) shows a success toast and an error toast
- New projects use the custom hook pattern — fetch logic and toasts are not inline in components
- Existing projects follow their established data-fetching convention (do not change unless asked)
- Action buttons are disabled while a mutation is in progress
- Loading state is shown while data is being fetched
- Forms reset after a successful create
- Local state updated after mutations — no stale data left in the UI
