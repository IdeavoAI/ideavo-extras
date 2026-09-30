# Razorpay

India only, INR only. The API takes integers in paise (₹1 = 100 paise); convert from the stored unit at the API boundary only. Use Razorpay's docs (links below) for request and response details; this file covers what differs in our setup.

## Our setup (OAuth, no API keys)

- **Credentials:** if `.env` already has `RAZORPAY_ACCESS_TOKEN`, check it with a status-only `GET /orders?count=1` and reuse it on 200. Otherwise, or on 401, call the `integration` tool with `type: "payments"` and `provider: "razorpay"`, and write the returned `KEY=value` lines into `.env`, replacing existing keys. If Razorpay isn't connected, the user sees a Connect button: say so in one sentence and stop until they confirm.
- **Variables:** `RAZORPAY_ACCESS_TOKEN` is secret and `RAZORPAY_ACCOUNT_ID` isn't needed in the browser; both stay server only, with no public prefix. `RAZORPAY_KEY_ID` is the Checkout key and the only public value: store it with the framework's public prefix so the browser can read it (for example `NEXT_PUBLIC_RAZORPAY_KEY_ID` for Next.js, `VITE_RAZORPAY_KEY_ID` for Vite). Never put that prefix on the other two.
- **Calling the API:** `https://api.razorpay.com/v1`, using plain HTTP (`fetch` or similar), from server code only. Authenticate with Basic auth (`RAZORPAY_KEY_ID:RAZORPAY_KEY_SECRET`) when `RAZORPAY_KEY_SECRET` is set, which is how the user's own live keys work, and with `Authorization: Bearer <RAZORPAY_ACCESS_TOKEN>` otherwise. `RAZORPAY_KEY_SECRET` is secret and server only, like the token. Errors come back as `{ error: { code, description, field } }`: show the user a generic message and log the code and description. A 401 means the credentials are invalid: fail without retrying; from the shell, call `integration` again.
- **No signature check:** without a key secret, Checkout's `razorpay_signature` can't be verified. Confirm by fetching instead, as below.
- **Mode:** the tool reports test or live. In live mode, warn the user that real money moves before any payment.
- **Expiry:** the access token lasts about 90 days. Tell the user in the final reply that deployed payments on the token stop working after that until they renew Razorpay access in Ideavo and update `RAZORPAY_ACCESS_TOKEN`; their own live keys don't expire.
- **Shell calls** (plans, token checks): load `.env` in the same command. Confirm with the user before creating anything on their account.

## One-time payments

1. The server creates a `purchases` row, then `POST /orders` with `amount` as an integer in paise (at least 100), `currency: "INR"`, and `receipt` as the purchase ID converted to a string (at most 40 characters). Store the returned order ID as `provider_ref`. Any `notes` values must be strings too.
2. The browser opens Checkout with `key`, `order_id` and a `handler`.
3. The handler sends `razorpay_payment_id` and `razorpay_order_id` to a confirm route, which checks the purchase belongs to the current buyer, fetches `GET /payments/{id}`, and grants access only if `order_id`, `amount`, `currency` and `status: "captured"` all match, storing the payment's `id`, `method` and time on the purchase. `authorized` isn't final yet.
4. The plan page rechecks the user's unpaid orders under 3 days old with `GET /orders/{id}/payments`. Three days is Razorpay's capture window.

## Subscriptions

1. **Plan:** confirm the details with the user, reuse a matching plan from `GET /plans`, otherwise `POST /plans`. Store its ID in `.env` as `RAZORPAY_PLAN_ID_<NAME>`, because test and live IDs differ.
2. `POST /subscriptions` with `plan_id`, `total_count`, `customer_notify: true` and, for a trial, `start_at`, and store the returned ID as `provider_ref` on a `purchases` row of type `subscription`. Checkout opens with `subscription_id`. Confirm by fetching `GET /subscriptions/{id}`.
3. **Access:** yes for `authenticated`, `active` and `pending` (Razorpay is retrying a charge). No for `halted`, `cancelled`, `completed` and `expired`; a cancellation at period end keeps access until `current_end`.
4. When an access check or the plan page finds a subscription past `current_end`, or in `created` or `pending`, fetch it first and update `status` and `current_end`. The plan page lists its charges live from `GET /invoices?subscription_id={id}` (paid invoices carry a `payment_id`).
5. **Cancel:** check the subscription belongs to the current buyer, then `POST /subscriptions/{id}/cancel` with `cancel_at_cycle_end` as the user chose, and update the row from the response. A cancelled subscription can't be restarted; the buyer subscribes again.

## Checkout (web)

Load `https://checkout.razorpay.com/v1/checkout.js` from Razorpay's CDN; never bundle or self-host it. Load it once, only when needed (for example `next/script` with `lazyOnload` in Next.js, or inject the tag on the first Buy click in a single-page app and wait for `window.Razorpay`), and declare `window.Razorpay` for TypeScript. Use `handler`, not `callback_url`. Show a spinner only between `handler` firing and the confirm route's answer. `modal.ondismiss` returns to the Buy button. Checkout lets the buyer retry a failed payment while it's open; once it's closed, every new attempt needs a new order, because Razorpay rejects a reused order ID.

## Webhooks

The handler (for example `/api/webhooks/razorpay`) verifies before anything else: HMAC-SHA256 of the **raw** body with `RAZORPAY_WEBHOOK_SECRET`, compared timing-safely with `X-Razorpay-Signature`, rejecting a mismatch with 400. Handle only the events for flows the app built, and only for purchases it created: an event whose `provider_ref` matches no row, or of a type the app doesn't use, gets a 2xx and changes nothing. Never create rows or write fields from the payload beyond what these rules name. Then, through the same idempotent functions, moving statuses only forward: `order.paid` finds the purchase by `provider_ref`, checks the amount and marks it paid; `subscription.*` events update `status` and `current_end`. Delivery is at least once and out of order (duplicates share `x-razorpay-event-id`), which the idempotent, forward-only functions absorb. Answer 2xx within 5 seconds, also for events you ignore.

The user registers it in the Razorpay Dashboard; our token can't use the webhooks API. In the final reply, tell the user to:

1. Open https://dashboard.razorpay.com/app/website-app-settings/webhooks?action=add-new-webhook and switch to Test Mode (test and live keep separate webhooks; the test-mode OTP is `754081`).
2. Enter a public HTTPS URL (localhost is rejected): the deployed or preview URL plus the handler path.
3. Select exactly the events the handler handles, each listed by name.
4. Choose a secret, and set the same value as `RAZORPAY_WEBHOOK_SECRET` in `.env` and in production. Until it's set, the handler rejects every event.

## Testing

Test mode: UPI `success@razorpay` succeeds and `failure@razorpay` fails. Test cards are in the docs.

## Docs

Fetch a page only if a step here doesn't cover it or an API call fails.

- OAuth tokens: https://razorpay.com/docs/partners/technology-partners/onboard-businesses/integrate-oauth/integration-steps.md
- Orders: https://razorpay.com/docs/api/orders/create.md
- Payments: https://razorpay.com/docs/api/payments/fetch-with-id.md
- Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration.md
- Subscriptions: https://razorpay.com/docs/payments/subscriptions/integration-guide.md
- Subscription states: https://razorpay.com/docs/payments/subscriptions/states.md
- Subscription invoices: https://razorpay.com/docs/api/payments/subscriptions/fetch-invoices.md
- Webhooks: https://razorpay.com/docs/webhooks.md
- Webhook best practices: https://razorpay.com/docs/webhooks/best-practices.md
- Webhook validation: https://razorpay.com/docs/webhooks/validate-test.md
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details.md
