---
name: payments-skill
description: Adds payments to the user's project through a payment provider (Razorpay is supported natively). Use this skill whenever the user wants to charge money, sell a product or service, add checkout, a paywall, premium features, pay-per-use, subscriptions or donations, or mentions Razorpay, Stripe, UPI or a payment gateway, even if they only say something like "let users pay" or "monetise this".
---

# Payments

Payments move real money with credentials that control the merchant's account. Work in few steps, make independent tool calls in parallel, and don't reread files.

| Provider | Region | Entry file |
|---|---|---|
| Razorpay | India only, INR only, web | [razorpay.md](./references/razorpay.md) |
| Other | Any | None; follow the provider's official documentation |

## 1. Scan

In one parallel batch, and nothing more unless something is unclear: the package manifest and framework config, ORM config and schema files, whether `.env` has `DATABASE_URL` (the name only), the auth setup, existing payment code (search the source for `razorpay`, `stripe` and `checkout`), pricing or premium pages, and hardcoded `localhost:` origins.

Stop and tell the user when:

- **There's no server-side code** (API routes, server actions or a backend). Credentials can't be kept safe in the browser. Ask whether they want a server added first, and don't continue with payments until it exists.
- **There's no database or ORM.** Ask: set one up, or use their own connection string. Either way, invoke `database-skill` and follow it in full; it sets up the ORM and migrations. Continue only once migrations run.

## 2. Ask once

One `question` call with everything the scan didn't settle:

- Provider, unless named or already integrated: **Razorpay (Recommended, India only)** or **Other**.
- What is sold and its price, suggesting what the scan found. The currency must be one the provider supports; never convert prices yourself.
- One-time or subscription. For subscriptions: billing period, number of billing cycles, free trial, and whether cancelling ends access immediately or at the end of the paid period.
- Who can buy: signed-in users only, or guests too. Without auth, signed-in purchases need `auth-skill` first.
- Where the billing page goes: the existing settings or profile area, or a new `/billing` page.
- How money is stored: **integer micros, amount × 1,000,000 (Recommended: exact for any price calculation)** or the provider's smallest unit (paise).
- If payment code already exists: extend it or replace it. Never build a second integration next to it.

## 3. Build

In one batch, read the provider's entry file and `references/payments-schema.md` in `database-skill`'s folder, next to its `SKILL.md` (read only that file; `database-skill` has already run or the project has its own ORM), and get the credentials as the entry file says. For Other, ask the user for credentials by the exact environment variable names the provider documents.

Then build the tables, the payment flow, the access checks and the billing page, following these rules:

- **The server decides the amount.** Products are defined in server code with stable, never-reused IDs (unless the project already stores them in its database). The client sends only the product ID.
- **One idempotent function grants access.** Confirmation, rechecks and webhooks all call it, so repeats change nothing.
- **Access is checked on the server on every request** for every route, page and file that serves paid content. Never cache access in a session or token, and never statically cache paid pages.
- **Pending means the provider holds a payment that isn't final.** Closing checkout without paying returns to the Buy button, with no spinner.
- **Secrets stay on the server.** Make sure `.env` is gitignored before writing to it, refer to secrets by name only, and never print their values. No hardcoded origins.
- **The billing page** shows only the user's own purchases, their subscription with a cancel action, and their payment history. Pricing pages show what the user already owns.

## 4. Finish

Run the type check and build once and fix what fails. Reply in at most five lines: what was built, the environment variables to set in production (names only; the user sets them), the webhook to register after deploying, and what to test: a test payment, a tampered amount being rejected, and paid content being denied without payment, including through its API.
