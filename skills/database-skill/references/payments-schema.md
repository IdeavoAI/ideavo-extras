# Payments schema

Tables for payments, for any provider. Use the project's ORM, migrations and naming style, and extend existing tables that already hold this data.

## Rules

- Money is an integer in the unit the user chose (micros or the provider's smallest unit), in a 64-bit column (`bigint`), with the currency beside it. Never floats or decimals.
- Provider IDs are unique. That's what makes repeated confirmations and webhooks harmless.
- Statuses are a fixed set and only move forward. Rows are never deleted.
- Orders and subscriptions copy the product's ID, name and amount when created, so later catalog changes don't rewrite history.

## Tables

Each also has `created_at` and `updated_at`; index buyer columns and provider IDs.

- **`orders`:** `id`, `user_id` (nullable for guests), `buyer_email`, `buyer_phone`, `product_id`, `product_name`, `amount`, `currency`, `status` (`created`, `paid`, `failed`), `provider`, `provider_order_id`, `paid_at`.
- **`subscriptions`:** `id`, `user_id`, `product_id`, `product_name`, `amount`, `currency`, `status` (the provider's lifecycle), `provider`, `provider_subscription_id`, `current_end`, `cancel_at_period_end`.
- **`payments`:** one row per attempt, successful or failed: `id`, `user_id`, `order_id` or `subscription_id`, `amount`, `currency`, `status` (`captured`, `failed`, `refunded`), `method`, `error_code`, `error_description`, `provider`, `provider_payment_id`, `paid_at`. The billing page's history reads it.
