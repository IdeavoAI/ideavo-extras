# Razorpay

Razorpay is for Indian businesses and charges in **INR only**. Razorpay's API takes integers in paise (₹1 = 100 paise). The app stores micros, so convert with paise = micros / 10,000 when calling Razorpay, and back with micros = paise × 10,000.


## Questions

No questions beyond the general ones. For subscriptions, the billing period must be `daily`, `weekly`, `monthly` or `yearly`, and Razorpay needs the total number of billing cycles.

## Schema

The tables come from `database-skill`'s `payments-schema.md`. Razorpay's objects map onto them like this:

| Razorpay | Table and columns |
|---|---|
| Order `id` | `orders.provider_order_id` |
| Payment `id`, `status`, `method`, `error_code`, `error_description`, `amount` | `payments.provider_payment_id`, `status`, `method`, `error_code`, `error_description`, `amount` (paise to micros) |
| Subscription `id`, `status`, `current_end` (Unix seconds) | `subscriptions.provider_subscription_id`, `status`, `current_end` |
| Plan `id` | Not stored in a table. It lives in `.env` as `RAZORPAY_PLAN_ID_<NAME>` because it differs between test and live mode. |

If the project already has payment tables, check they can hold these fields with consistent types (money in micros, unique provider IDs, forward-only statuses). If they can, use them as they are. If not, add only what's missing, and ask the user before changing existing columns.

## Files

Read all the files for the chosen flow in one batch:

- **One-time:** [setup.md](./razorpay/setup.md), [orders.md](./razorpay/orders.md), [web.md](./razorpay/web.md), [webhooks.md](./razorpay/webhooks.md).
- **Subscription:** the same, plus [subscriptions.md](./razorpay/subscriptions.md).

## Handoff

Environment variables the user must set in production:

- `RAZORPAY_ACCESS_TOKEN`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_ACCOUNT_ID`
- `RAZORPAY_WEBHOOK_SECRET`
- Each `RAZORPAY_PLAN_ID_<NAME>`, for subscriptions. Plans in live mode have different IDs from test mode.
