# Razorpay one-time payments

Flow: the server creates an order, the browser pays it through Checkout (see [web.md](./web.md)), and the server confirms the payment by fetching it from Razorpay.

OAuth gives us no key secret, so the `razorpay_signature` that Checkout returns can't be verified. Confirm every payment by fetching it with the access token instead.

## Tables

Uses the product catalog, `orders` and `payments` (see the schema mapping in [razorpay.md](../razorpay.md)), with `provider` set to `razorpay`.

## Create the order

A server route that receives only the item being bought.

1. Look up the product in the catalog, reject it if it's inactive, and insert a local order with status `created`, copying its ID, name and amount.
2. `POST /v1/orders` with `amount` (paise, at least 100), `currency: "INR"`, `receipt` (the local order ID, at most 40 characters) and `notes: { orderId }`.
3. Save the returned `id` as `provider_order_id`, and return it with the amount, currency and the public key (`NEXT_PUBLIC_RAZORPAY_KEY_ID`) to the client.

## Confirm the payment

A server route that receives `razorpay_payment_id` and `razorpay_order_id` from Checkout's handler.

1. Find the local order whose `provider_order_id` is the received `razorpay_order_id`, and check it belongs to the current buyer.
2. `GET /v1/payments/{razorpay_payment_id}`.
3. Accept it only if the payment's `order_id` matches, its `amount` equals the order's amount converted to paise, `currency` is `INR` and `status` is `captured`.
4. Then call the one idempotent function that marks the order paid, records the row in `payments` and grants access.

If the status is `authorized`, the payment isn't final yet. Razorpay captures it automatically by default, so leave the order `created` and let the recheck or the `order.paid` webhook finish it.

A failed attempt doesn't fail the order; the buyer can pay the same order again. Mark an order `failed` only when it is abandoned or cancelled.

## Recheck pending orders

For an order still `created`, `GET /v1/orders/{provider_order_id}/payments` and apply the same checks to any `captured` payment. Run it when the buyer returns to the app or opens the billing page, so a closed tab never loses a payment.

## Docs

- Create an order: https://razorpay.com/docs/api/orders/create.md
- Fetch a payment: https://razorpay.com/docs/api/payments/fetch-with-id.md
- Fetch payments for an order: https://razorpay.com/docs/api/orders/fetch-payments.md
- Capture settings: https://razorpay.com/docs/payments/payments/capture-settings.md
