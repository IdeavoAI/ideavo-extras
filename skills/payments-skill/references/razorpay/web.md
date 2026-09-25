# Razorpay web checkout

Standard Checkout opens Razorpay's payment modal on the page. Payment details never touch the app.

## Load the script

Load `https://checkout.razorpay.com/v1/checkout.js` with a real script tag, or the framework's script component, before opening Checkout. A missing script is the usual cause of "Razorpay is not defined".

## Open Checkout

1. Call the server's create route (order or subscription). It returns the ID and the public key.
2. Open Checkout:
   ```js
   const rzp = new Razorpay({
     key,                          // public key returned by the server
     order_id,                     // or subscription_id for subscriptions
     name, description,
     prefill: { name, email, contact },
     handler: (response) => confirm(response),
     modal: { ondismiss: () => { /* back to idle */ } },
   })
   rzp.on("payment.failed", (response) => { /* show response.error.description, allow retry */ })
   rzp.open()
   ```
3. In `handler`, send the IDs to the server's confirm route (`razorpay_payment_id` with `razorpay_order_id`, or `razorpay_subscription_id`). Show a pending state until the server answers. Access comes from the server's answer, never from the handler alone.

Use `handler`, not `callback_url`. Razorpay's `callback_url` is for WebView and redirect flows, and it needs an allowlisted domain.

The public key reaches the browser through the server's response. If the stack instead reads it from a public environment variable, use the stack's own public prefix.

## Test payments

In test mode:

- UPI: `success@razorpay` succeeds and `failure@razorpay` fails.
- Cards: use a test card from the docs below. Any future expiry and any CVV work, and the mock bank page has Success and Failure buttons.

If Checkout doesn't open or finish inside the preview, open the app in a new tab and try again.

## Docs

- Standard Checkout: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration.md
- Test cards: https://razorpay.com/docs/payments/payments/test-card-details.md
- Test UPI IDs: https://razorpay.com/docs/payments/payments/test-upi-details.md
