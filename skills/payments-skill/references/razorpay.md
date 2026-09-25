# Razorpay

Razorpay is for Indian businesses and charges in **INR only**. Razorpay's API takes integers in paise (₹1 = 100 paise). The app stores micros, so convert with paise = micros / 10,000 when calling Razorpay, and back with micros = paise × 10,000.

Read each file below in full when its part of the build is reached.

## Questions

Ask these together with the general requirements in step 4:

- One-time payment or subscription?
- For a subscription: billing period (daily, weekly, monthly or yearly), how many periods between charges, how many billing cycles in total, and whether it starts with a free trial.

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

| File | Load when |
|---|---|
| [setup.md](./razorpay/setup.md) | First, before any code: credentials, test vs live mode, and how to call the API. |
| [orders.md](./razorpay/orders.md) | For one-time payments: creating orders, verifying payments, rechecking pending orders. |
| [subscriptions.md](./razorpay/subscriptions.md) | For subscriptions only: plans, subscriptions and their lifecycle. |
| [webhooks.md](./razorpay/webhooks.md) | After the payment flow works: registering the webhook, the handler and its events. |
| [web.md](./razorpay/web.md) | When building the checkout in the browser, and for test payment methods. |

## Handoff

Environment variables the user must set in production:

- `RAZORPAY_ACCESS_TOKEN`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `RAZORPAY_ACCOUNT_ID`
- `RAZORPAY_WEBHOOK_SECRET`
- Each `RAZORPAY_PLAN_ID_<NAME>`, for subscriptions. Plans in live mode have different IDs from test mode.
