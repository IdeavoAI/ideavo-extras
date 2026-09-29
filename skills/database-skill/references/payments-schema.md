# Payments schema

One table records purchases, for any provider. The provider stays the system of record for money movements (attempts, renewals, refunds); this table holds what the app needs to decide access and show what was bought. Use the project's ORM, migrations and naming style (Drizzle, as `database-skill` sets it up, if the project had none), extend an existing table that already holds this data, and never write raw SQL around the ORM.

## Rules

- Money is an integer in the unit the user chose (micros or the provider's smallest unit), in a 64-bit column (`bigint`), with the currency beside it. Never floats or decimals.
- `provider_ref` is unique. That's what makes repeated confirmations and webhooks harmless.
- Statuses only move forward, and rows are never deleted.
- A purchase copies the product's ID, name and amount when created, so later catalog changes don't rewrite history.

## `purchases`

One row per purchase. Also `created_at` and `updated_at`; index `user_id` and `provider_ref`.

| Column | Notes |
|---|---|
| `id` | Primary key |
| `user_id` | Nullable for guest purchases. When auth exists: a foreign key with the auth user `id`'s type and `on delete set null`, so history survives |
| `buyer_email`, `buyer_phone` | For guest purchases |
| `type` | `one_time` or `subscription` |
| `product_id`, `product_name`, `amount`, `currency` | Copied at purchase |
| `status` | One-time: `created`, `paid`, `failed`. Subscription: the provider's lifecycle |
| `provider`, `provider_ref` | The provider's order ID or subscription ID |
| `provider_payment_id`, `method`, `paid_at` | One-time only, set when paid |
| `current_end`, `cancel_at_period_end` | Subscription only |

Add a separate `payments` table linked to `purchases` only when refunds, instalments or revenue reports from the app's own database are needed.
