# Razorpay webhooks

Razorpay sends events to the app so payment state stays correct even when the buyer closes the tab. Build the handler first, then register it.

## Handler

A server route such as `POST /api/webhooks/razorpay`.

1. Read the raw request body before any JSON parsing.
2. Compute HMAC-SHA256 of the raw body with `RAZORPAY_WEBHOOK_SECRET` as the key, as hex. Compare it with the `X-Razorpay-Signature` header using a timing-safe comparison. Reject a mismatch with 400.
3. Parse the body and handle the event through the same idempotent functions the app already uses, so a repeated delivery changes nothing.
4. Answer with a 2xx within 5 seconds, including for events you don't handle. Razorpay retries anything else for 24 hours and then disables the webhook.

| Event | Handling |
|---|---|
| `order.paid` | Match the local order by `provider_order_id`, check the amount, then mark it paid. |
| `payment.failed` | Record the attempt in `payments` with status `failed`, `error_code` and `error_description`. The order stays open for another try. |
| `subscription.authenticated`, `subscription.activated`, `subscription.charged`, `subscription.pending`, `subscription.halted`, `subscription.cancelled`, `subscription.completed` | Update the local subscription's `status` and `current_end`. For `subscription.charged`, also record the payment. |

Events can arrive out of order. Apply a status only if it moves the record forward.

## Register the webhook

Always build the handler. Register the webhook only for the deployed app, because a sandbox URL changes and Razorpay disables a webhook after 24 hours of failed deliveries.

The merchant registers it in their Razorpay Dashboard; Razorpay's API doesn't allow it with our access token. In the final reply, ask them to add a webhook under Accounts & Settings, then Webhooks, once the app is deployed: the deployed URL plus the handler path, the events from the table above, and a secret of their choice, which they set as `RAZORPAY_WEBHOOK_SECRET` in production.

The app stays correct without it: confirmation, rechecks and subscription syncing keep payments up to date. Only guests who close the tab after paying wait for the webhook.

## Test

Once a webhook is registered, make a test payment (see [web.md](./web.md)), then check that the handler received `order.paid` and that a repeated delivery changes nothing.

## Docs

- Webhooks overview: https://razorpay.com/docs/webhooks.md
- Validate and test: https://razorpay.com/docs/webhooks/validate-test.md
- Best practices: https://razorpay.com/docs/webhooks/best-practices.md
- Set up payment webhooks: https://razorpay.com/docs/webhooks/setup-edit-payments.md
- Subscription events: https://razorpay.com/docs/webhooks/subscriptions.md
