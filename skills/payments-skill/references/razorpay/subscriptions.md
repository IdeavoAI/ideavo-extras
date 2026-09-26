# Razorpay subscriptions

Flow: a plan defines the price and billing period. Each buyer gets a subscription on that plan, authorises it once through Checkout (see [web.md](./web.md)), and Razorpay charges them every period.

As with orders, Checkout's `razorpay_signature` can't be verified without a key secret. Confirm by fetching the subscription.

## Plans

Plans live on the merchant's Razorpay account and are separate in test and live mode.

1. Confirm the plan details with the user: name, amount, period (`daily`, `weekly`, `monthly` or `yearly`) and interval.
2. `GET /v1/plans` from the shell and reuse a matching plan instead of creating a duplicate.
3. Otherwise `POST /v1/plans` with `period`, `interval` and `item: { name, amount, currency: "INR", description }`.
4. Store the plan ID in `.env` as `RAZORPAY_PLAN_ID_<NAME>` (for example `RAZORPAY_PLAN_ID_PRO_MONTHLY`). The app reads it from there, because the ID differs between test and live.

## Tables

Uses the product catalog, `subscriptions` and `payments` (see the schema mapping in [razorpay.md](../razorpay.md)), with `provider` set to `razorpay`. A recurring product's `period` and `interval` match its Razorpay plan. Each charge is recorded in `payments`, so it appears in the billing history.

## Create a subscription

A server route that receives only the plan being bought.

1. `POST /v1/subscriptions` with `plan_id`, `total_count` (number of billing cycles), `customer_notify: true` and `notes: { userId }`. For a free trial, set `start_at` to the Unix time when billing should begin.
2. Insert the local row with the returned `id` and `status`, copying the product's ID, name and amount, and return the subscription ID and the public key to the client.

## Confirm after Checkout

A server route that receives `razorpay_subscription_id` from Checkout's handler.

1. Check the subscription belongs to the current buyer.
2. `GET /v1/subscriptions/{id}` and store its `status` and `current_end`.
3. Grant access through the one idempotent function when the status is `authenticated` (trial) or `active`.

## Status and access

| Status | Access |
|---|---|
| `authenticated`, `active` | Yes |
| `pending` (a charge failed; Razorpay is retrying) | Yes, while Razorpay retries |
| `halted`, `cancelled`, `completed`, `expired` | No (for a cancellation at period end, until `current_end`) |

Webhooks keep the status current (see [webhooks.md](./webhooks.md)). Don't rely on them alone: when an access check or the billing page finds a subscription past `current_end`, or in `created` or `pending`, fetch it (`GET /v1/subscriptions/{id}`) first, store its `status` and `current_end`, and record any new charges.

## Cancel

A server route for the billing page's cancel action.

1. Check the subscription belongs to the current buyer.
2. `POST /v1/subscriptions/{id}/cancel` with `cancel_at_cycle_end: true` to end at the paid period's end, or `false` to end now, as the user chose in step 3.
3. Update the local row from the response: its `status`, and `cancel_at_period_end` when it ends later. The billing page then shows when access ends.
4. The `subscription.cancelled` webhook confirms it later, idempotently.

A cancelled subscription can't be restarted; the buyer subscribes again.

## Docs

- Integration guide: https://razorpay.com/docs/payments/subscriptions/integration-guide.md
- Create a plan: https://razorpay.com/docs/api/payments/subscriptions/create-plan.md
- Create a subscription: https://razorpay.com/docs/api/payments/subscriptions/create-subscription.md
- Fetch a subscription: https://razorpay.com/docs/api/payments/subscriptions/fetch-subscription-id.md
- Cancel a subscription: https://razorpay.com/docs/api/payments/subscriptions/cancel-subscription.md
- Subscription states: https://razorpay.com/docs/payments/subscriptions/states.md
