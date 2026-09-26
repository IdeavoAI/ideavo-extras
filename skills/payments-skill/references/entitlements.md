# Entitlements, access and billing

What a user owns decides what they can use and what they see. Build it with the project's existing components and styling.

## Entitlements

One server function, for example `getEntitlements(user)`, returns the one-time products the user owns, their subscription (product, status, `current_end`, cancelling at period end) and any pending payment. Pending means the provider holds a payment for the order that isn't final yet (Razorpay: `authorized`); an order without a payment attempt is not pending. Everything below uses it, so access and UI never disagree.

When buying, the server rejects a one-time product the user already owns (unless `repeatable`), and a second active subscription to the same product.

## Gating

Before building, list every place that serves paid content: API routes, server actions, server-rendered pages, file downloads and background jobs. Guard each one with a single helper built on `getEntitlements`, such as `requireAccess(user, productId)`.

- Check on every request. Never cache access in the session, a JWT or a cookie; a cancelled subscription must lose access right away.
- Render paid pages per request. Static rendering or CDN caching would serve them to everyone.
- Keep paid files out of `public/`. Serve them through a guarded route or a short-lived signed URL.
- Deny with 403 from APIs and a redirect to pricing from pages.
- Middleware and client checks are convenience only, never the sole check.

## Purchase state in the UI

| Where | Owns it | Pending | Doesn't own it |
|---|---|---|---|
| Pricing or product page | "Purchased" or "Current plan", button disabled, link to billing | "Payment processing…" | Buy or Subscribe |
| Paid feature | Works | "Confirming your payment…" | Prompt to buy |

## Billing page

In the existing profile or settings area, or a `/billing` page linked from the user menu. It shows only the signed-in user's data. On load, recheck their unpaid orders from the last 3 days and sync their subscription with the provider first. Abandoned orders with no payment don't appear; failed attempts appear as failed.

1. **Subscription:** product, amount and period, and a status line: "Next charge on <date>", "Cancels on <date>", "Payment failed. Retrying automatically." or "Ended on <date>" with a link to subscribe again. Cancel asks for confirmation and says when access ends.
2. **Purchases:** owned one-time products with their purchase date.
3. **Payment history:** every payment, newest first: date, product, amount, method, status.

Empty state: "No purchases yet", with a link to pricing. Format amounts from micros with the currency (`Intl.NumberFormat` or equivalent).

Guests have no billing page. Their confirmation page shows the product, amount, date and payment ID.
