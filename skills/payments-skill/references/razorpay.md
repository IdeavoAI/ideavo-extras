# Razorpay

India only, INR only. The API takes integers in paise (₹1 = 100 paise); convert from the stored unit at the API boundary only. Use Razorpay's docs (links below) for request and response details; this file covers what differs in our setup.

## Our setup (OAuth, no API keys)

- **Credentials:** call the `integration` tool with `type: "payments"` and `provider: "razorpay"`, and write the returned `KEY=value` lines into `.env`, replacing existing keys. If Razorpay isn't connected, the user sees a Connect button: say so in one sentence and stop until they confirm.
- **Variables:** `RAZORPAY_ACCESS_TOKEN` is secret and `RAZORPAY_ACCOUNT_ID` isn't needed in the browser; both stay server only, with no public prefix. `RAZORPAY_KEY_ID` is the Checkout key and the only public value: store it with the framework's public prefix so the browser can read it (for example `NEXT_PUBLIC_RAZORPAY_KEY_ID` for Next.js, `VITE_RAZORPAY_KEY_ID` for Vite). Never put that prefix on the other two.
- **Calling the API:** `https://api.razorpay.com/v1` with `Authorization: Bearer <RAZORPAY_ACCESS_TOKEN>`, using plain HTTP (`fetch` or similar), from server code only. A 401 means the token is invalid; from the shell, call `integration` again.
- **No signature check:** without a key secret, Checkout's `razorpay_signature` can't be verified. Confirm by fetching instead, as below.
- **Mode:** the tool reports test or live. In live mode, warn the user that real money moves before any payment.
- **Shell calls** (plans, token checks): load `.env` in the same command and print only what you need, never the token. Confirm with the user before creating anything on their account.

## One-time payments

1. The server creates a local order, then `POST /orders` with the amount in paise (at least 100), `currency: "INR"` and the local order ID as `receipt`.
2. The browser opens Checkout with `key`, `order_id` and a `handler`.
3. The handler sends `razorpay_payment_id` and `razorpay_order_id` to a confirm route, which fetches `GET /payments/{id}` and grants access only if `order_id`, `amount`, `currency` and `status: "captured"` all match. `authorized` isn't final yet.
4. The billing page rechecks the user's unpaid orders under 3 days old with `GET /orders/{id}/payments`. Three days is Razorpay's capture window.

## Subscriptions

1. **Plan:** confirm the details with the user, reuse a matching plan from `GET /plans`, otherwise `POST /plans`. Store its ID in `.env` as `RAZORPAY_PLAN_ID_<NAME>`, because test and live IDs differ.
2. `POST /subscriptions` with `plan_id`, `total_count` and, for a trial, `start_at`. Checkout opens with `subscription_id`. Confirm by fetching `GET /subscriptions/{id}`.
3. **Access:** yes for `authenticated`, `active` and `pending` (Razorpay is retrying a charge). No for `halted`, `cancelled`, `completed` and `expired`; a cancellation at period end keeps access until `current_end`.
4. When an access check or the billing page finds a subscription past `current_end`, fetch it first and record new charges.
5. **Cancel:** `POST /subscriptions/{id}/cancel` with `cancel_at_cycle_end` as the user chose, then update the row from the response.

## Checkout (web)

Load `https://checkout.razorpay.com/v1/checkout.js` from Razorpay's CDN; never bundle or self-host it. Load it once, only when needed (for example `next/script` with `lazyOnload` in Next.js, or inject the tag on the first Buy click in a single-page app and wait for `window.Razorpay`), and declare `window.Razorpay` for TypeScript. Use `handler`, not `callback_url`. Show a spinner only between `handler` firing and the confirm route's answer. `modal.ondismiss` returns to the Buy button. Checkout lets the buyer retry a failed payment while it's open; once it's closed, every new attempt needs a new order, because Razorpay rejects a reused order ID.

## Webhooks

Always build the handler: HMAC-SHA256 of the **raw** body with `RAZORPAY_WEBHOOK_SECRET`, compared timing-safely with `X-Razorpay-Signature`. Answer 2xx within 5 seconds, also for events you ignore. Handle `order.paid`, `payment.failed` and `subscription.*` through the same idempotent functions.

The merchant registers it in their Razorpay Dashboard after deploying (our token can't use the webhooks API): the deployed URL plus the handler path, those events, and a secret they set as `RAZORPAY_WEBHOOK_SECRET`. The app stays correct without it.

## Testing

Test mode: UPI `success@razorpay` succeeds and `failure@razorpay` fails. Test cards are in the docs.

## Docs

- OAuth tokens: https://razorpay.com/docs/partners/technology-partners/onboard-businesses/integrate-oauth/integration-steps.md
- Orders: https://razorpay.com/docs/api/orders/create.md
- Payments: https://razorpay.com/docs/api/payments/fetch-with-id.md
- Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration.md
- Subscriptions: https://razorpay.com/docs/payments/subscriptions/integration-guide.md
- Subscription states: https://razorpay.com/docs/payments/subscriptions/states.md
- Webhooks: https://razorpay.com/docs/webhooks/validate-test.md
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details.md
