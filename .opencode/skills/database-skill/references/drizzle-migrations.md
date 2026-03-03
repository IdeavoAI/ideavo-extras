# Drizzle Migrations Reference

---

## Commands

Generate migration files from schema:
```bash
{package_manager} run db:generate
```

Apply migrations to the database:
```bash
{package_manager} run db:migrate
```

Always use `generate` + `migrate`. Never use `drizzle-kit push` against a production database.

---

## Common Patterns

### Add a column

```sql
ALTER TABLE users ADD COLUMN phone TEXT;
```

```typescript
phone: text("phone"),
```

### Add a column with index

```sql
ALTER TABLE users ADD COLUMN phone TEXT;
CREATE INDEX idx_users_phone ON users(phone);
```

### Create a junction table

```sql
CREATE TABLE provider_specialties (
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  PRIMARY KEY (provider_id, specialty_id)
);
```

```typescript
export const providerSpecialties = pgTable("provider_specialties", {
  providerId: uuid("provider_id").notNull().references(() => providers.id, { onDelete: "cascade" }),
  specialtyId: uuid("specialty_id").notNull().references(() => specialties.id, { onDelete: "cascade" }),
}, (t) => ({ pk: primaryKey(t.providerId, t.specialtyId) }))
```

### Change a column type

```sql
ALTER TABLE services ALTER COLUMN price TYPE DECIMAL(10, 2);
```

```typescript
price: decimal("price", { precision: 10, scale: 2 }).notNull(),
```

### Add a constraint

```sql
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
```

---

## Failure Protocol

If `drizzle-kit migrate` fails with schema conflicts:

1. Never suggest `--force` automatically.
2. Present options to the user: (1) fix schema conflicts manually, (2) use `--force` (destructive — may delete data), (3) cancel.
3. Only run `--force` after explicit user confirmation.
4. For data constraint violations: run a data migration first, then the schema migration.

```sql
-- data migration before adding NOT NULL constraint
UPDATE users SET status = 'active' WHERE status IS NULL;
ALTER TABLE users ALTER COLUMN status SET NOT NULL;
```

---

## Rules

- Never modify existing migration files — always create a new one.
- Never run `drizzle-kit push` in production.
- Always add indexes on foreign key columns.
- Commit generated snapshot files in `drizzle/meta/` to version control.
