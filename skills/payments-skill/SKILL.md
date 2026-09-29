---
name: payments-skill
description: Adds payments to the user's project through a payment provider (Razorpay is supported natively). Use this skill whenever the user wants to charge money, sell a product or service, add checkout, a paywall, premium features, pay-per-use, subscriptions or donations, or mentions Razorpay, Stripe, UPI or a payment gateway, even if they only say something like "let users pay" or "monetise this".
---

# Payments

Payments move real money with credentials that control the merchant's account. Work in few steps and make independent tool calls in parallel.

| Provider | Region | Entry file |
|---|---|---|
| Razorpay | India only, INR only, web | [razorpay.md](./references/razorpay.md) |
| Other | Any | None; follow the provider's official documentation |

## 1. Scan

In one parallel batch, skipping anything already read in this task, read `ui-skill`'s `SKILL.md` (its rules shape the questions below) and scan: the package manifest and framework config, ORM config and schema files, whether `.env` has `DATABASE_URL` (the name only), the auth setup, existing payment code (search the source for `razorpay`, `stripe` and `checkout`), and pricing or premium pages.

**Provider first.** If the user didn't name a provider and none is integrated, don't use the `question` tool for it. Reply in plain text asking which payment provider they want, listing Razorpay as "Razorpay (recommended for India users)" alongside other providers, then stop and wait for their answer.

Then stop and tell the user when:

- **There's no server-side code** (API routes, server actions or a backend). Credentials can't be kept safe in the browser. Ask whether they want a server added first, and don't continue with payments until it exists.
- **There's no database or ORM.** Invoke `database-skill`; it asks how to set one up and runs the migrations. Continue once it's done.
- **There's no auth** and the user didn't ask for guest checkout. Buyers sign in, so invoke `auth-skill` and continue once it's done.

## 2. Ask once

Ask everything still open in a single `question` call, as separate questions (the tool takes a list), each with its own short options. Skip anything the scan already settled.

- What is sold and its price, suggesting what the scan found. The currency must be one the provider supports; never convert prices yourself.
- One-time or subscription. For subscriptions: billing period, number of billing cycles, free trial, and whether cancelling ends access immediately or at the end of the paid period.
- **What paid adds over free:** the features and limits of each, suggested from the app.
- **Where the plan lives:** one page showing the plans before purchase and the user's plan and history after, placed where it fits the app (an account-menu or sidebar item, a settings tab, or `/billing`), recommended from the layout.
- **Free limits,** if any: show usage as it's used and suggest upgrading as the limit nears (Recommended), or block only at the limit.
- For gated content: a **soft paywall** (a preview fades into an upgrade card, like Medium) or a **hard** one (redirect to the plan page).
- Only if the project has an admin role: an in-app payments log for admins, or **the provider's dashboard (Recommended)**.
- How money is stored: **integer micros, amount × 1,000,000 (Recommended: exact for any price calculation)** or the provider's smallest unit (paise).
- If payment code already exists: extend it or replace it. Never build a second integration next to it.

## 3. Build

In one batch, read the provider's entry file and `references/payments-schema.md` in `database-skill`'s folder (only that file), and get the credentials as the entry file says. For Other, ask the user for credentials by the exact environment variable names the provider documents.

Then build the tables, the payment flow, the access checks and the plan page, following these rules:

- **The server decides the amount.** Products are defined in server code with stable, never-reused IDs, their price, `active`, and `repeatable` for one-time products that can be bought again (unless the project already stores them in its database). The client sends only the product ID. The server rejects inactive products, a one-time product the buyer already owns (unless repeatable), and a second active subscription to the same product.
- **One idempotent function grants access.** Confirmation, rechecks and webhooks all call it, so repeats change nothing.
- **Always build the webhook,** without asking, unless the user says not to. The provider calls it server to server, so payments are confirmed even if the buyer closed the tab, and renewals without a return visit. In-app confirmation stays for the instant result.
- **Guest checkout** only if the user asked for it, and only for purchases that grant no ongoing access (donations, one-off services, physical orders). Guests enter their email before checkout. With no session, the provider fetch is the proof for their confirmation.
- **Access is checked on the server on every request** for every route, page and file that serves paid content. Never cache access in a session or token, and never statically cache paid pages.
- **Pending means the provider holds a payment that isn't final.** Closing checkout without paying returns to the Buy button, with no spinner.
- **Security:** every payment route requires the session where sign-in applies and checks that the purchase belongs to the current buyer. Validate every input with a schema, and never trust amounts, statuses or IDs from the client; confirm them with the provider. Secrets stay on the server and only the provider's public key reaches the browser. Log IDs and error codes, never tokens or full payment details.
- **Plan page, paywall and paid status:** read `ui-skill`'s `references/access.md` and `references/billing.md` and build them as the user chose. A guest's confirmation page is their only record until the production webhook is registered.
- **Checkout:** disable Buy while the order is created, prefill the buyer's name, email and phone from the session, and format prices with `Intl.NumberFormat` for the currency. Implement the three states for every async operation, as the user chose.

## 4. Finish

Go through every answer from the question call and confirm the code reflects it; fix what doesn't. Check that every async operation shows its three states. With the dev server running, `curl` the create route signed in with a real product (expect 200 and a provider order or subscription ID), then without a session (expect 401 where sign-in is required) and with an unknown product ID (expect a rejection). Reply in at most five lines: what was built, the environment variables to set in production (names only; the user sets them), the webhook to register if built, as the provider's entry file says, that going live means redoing credentials, plans and the webhook with the live connection (IDs differ between modes), and what to test: a test payment, a tampered amount being rejected, and paid content being denied without payment, including through its API.
