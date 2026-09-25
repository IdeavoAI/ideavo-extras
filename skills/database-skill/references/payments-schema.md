# Payments schema

Tables for payments, for any provider. Create them with the project's existing ORM and migration setup, and follow the project's naming style (the names below are a guide). Extend existing tables that already hold this data instead of adding duplicates.

## Rules

- **Money is stored in micros:** an integer equal to the amount × 1,000,000 in the currency's main unit (₹499.00 is `499000000`). Never use a float or decimal. Use a 64-bit integer column (`bigint`); a 32-bit integer overflows at about 2,147 units. Store the currency next to every amount.
- **All price calculations happen in micros.** Convert to the provider's unit (for example paise) only when calling the provider, in one helper with a defined rounding rule, and convert the provider's amounts back the same way.
- **Provider IDs are unique.** A unique constraint on each provider ID is what makes duplicate confirmations and webhooks harmless.
- **Statuses are a fixed set**, as an enum or a checked text column, and only move forward.
- **Rows are never deleted.** Payment history is a record; change the status instead.
- Index every buyer column and every provider ID.

## Tables

Every table also has `created_at` and `updated_at`.

Products are defined in server code, not in a table (see `payments-skill`). Create a `products` table only if the user asks for one.

### `orders`

One row per purchase.

| Column | Notes |
|---|---|
| `id` | Primary key |
| `user_id` | The buyer; nullable for guest purchases |
| `buyer_email`, `buyer_phone` | For guest purchases |
| `product_id`, `product_name` | The catalog key and name, copied when the order is created |
| `amount`, `currency` | In micros, copied from the product when the order is created |
| `status` | `created`, `paid`, `failed` |
| `provider`, `provider_order_id` | Unique together |
| `paid_at` | |

### `subscriptions`

One row per subscription. Only needed for recurring payments.

| Column | Notes |
|---|---|
| `id` | Primary key |
| `user_id` | The subscriber |
| `product_id`, `product_name` | The catalog key and name, copied when subscribing |
| `amount`, `currency` | In micros, copied from the product when subscribing, so later price changes don't rewrite what the buyer agreed to |
| `status` | The provider's lifecycle, for example `created`, `authenticated`, `active`, `pending`, `halted`, `cancelled`, `completed` |
| `provider`, `provider_subscription_id` | Unique together |
| `current_end` | End of the paid period |
| `cancel_at_period_end` | Boolean |

### `payments`

One row per payment attempt, successful or failed, for an order or a subscription charge. It is the single place a provider payment ID is stored, and the billing page reads it.

| Column | Notes |
|---|---|
| `id` | Primary key |
| `user_id` | The buyer; nullable for guest purchases |
| `order_id`, `subscription_id` | Exactly one is set |
| `amount`, `currency` | In micros, converted from the provider's amount |
| `status` | `captured`, `failed` or `refunded` |
| `method` | For example `card`, `upi`, `netbanking`, `wallet` |
| `error_code`, `error_description` | For failed attempts |
| `amount_refunded` | In micros; `0` until refunds exist |
| `provider`, `provider_payment_id` | Unique together |
| `paid_at` | For captured payments |
