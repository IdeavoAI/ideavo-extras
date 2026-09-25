---
name: payments-skill
description: Adds payments to the user's project through a payment provider (Razorpay is supported natively). Use this skill whenever the user wants to charge money, sell a product or service, add checkout, a paywall, premium features, pay-per-use, subscriptions or donations, or mentions Razorpay, Stripe, UPI or a payment gateway, even if they only say something like "let users pay" or "monetise this".
---

# Payments

Payments move real money and rely on credentials that control the merchant's account. A half-built integration can take money without granting access, or grant access without taking money. Finish each step before starting the next, and stop where a step says to.

## Providers

| Provider | Region | Platforms | Entry |
|---|---|---|---|
| Razorpay | India only | Web | [razorpay.md](./references/razorpay.md) |
| Other | Any | Any | No reference. Follow the provider's official documentation. |

Load the provider's entry file at step 4. It lists that provider's questions and which of its files to load for each part of the build.

## Public URL

In the sandbox, the app is reachable from the internet at `$IDEAVO_HOST_URL` (read it from the shell). It points at port 4000. For a server on another port, replace the leading `4000`. Use it only when registering the app with something outside it, such as a provider webhook. Never write it into the app's code; the URL changes when the sandbox is replaced.

## Workflow

### 1. Scan

Read the project without changing anything or asking questions yet. Note:

- Stack and platform (web, mobile, both), and where server code runs.
- Database and schema, and whether authentication exists.
- Existing payment code or payment environment variables.
- Products, plans, pricing pages or features that could be paid.
- Hardcoded origins such as `localhost:<port>`, and whether the dev server accepts requests from its public host.

### 2. Choose the provider

- If the user named a provider, or the project already has one integrated, use it.
- Otherwise use the `question` tool with two options: **Razorpay (Recommended, India only)** and **Other**.

### 3. Readiness report

Show the user a short table with each check, what you found (with file paths) and the result. Then act on the result.

| Check | Passes when | Otherwise |
|---|---|---|
| Server-side code | Code runs on a server (API routes, server actions, a backend). Credentials can't be kept safe in the browser. | Stop and explain why payments can't be added. |
| Existing payment code | None, or it's for the chosen provider and can be extended. | Use the `question` tool: extend it, or replace it. Never build a second integration next to it. |
| Database | The server can write to a database through an ORM or query layer. Payment state must be durable. | Stop. Use the `question` tool: set one up with `database-skill` (run it in full), or the user provides their own. Continue only once the database is connected and migrations run. |
| Something to charge for | There's a clear product or service. | Use the `question` tool: summarise what you found and suggest one or two options that fit the project. |
| Identity | The purchase isn't tied to an account, or authentication exists. | Use the `question` tool: set it up with `auth-skill`, or make it a guest purchase that records the buyer's email or phone. |
| Platform | The provider's row in the table covers the project's platform. | Stop and tell the user the platform isn't supported for this provider yet. |
| URLs | No hardcoded origins, and the dev server accepts its public host. | Fix it before building. The app runs behind a public URL that changes between sandboxes. |

### 4. Requirements

Use the `question` tool to confirm what is sold, the price, the currency, and one-time or recurring. For recurring, also ask whether cancelling ends access immediately or at the end of the paid period. Ask the provider-specific questions its entry file lists, in the same call where possible.

Finalise the currency before building. It must be one the provider supports, as its entry file states. If it isn't, stop and let the user choose: change the currency or choose another provider. Never convert prices on your own.

### 5. Build with the provider

First add the payment tables. Read `references/payments-schema.md` in `database-skill`'s folder, next to its `SKILL.md`, and create the tables it describes with the project's ORM and migration setup. Read only that file; don't invoke `database-skill` again.

- **Razorpay:** follow [razorpay.md](./references/razorpay.md): credentials, orders, verification, subscriptions, webhooks, testing and handoff.
- **Other:** ask the user for the credentials by the exact environment variable names the provider documents, then write them to `.env`. Build from the provider's official documentation.

Either way, read [entitlements.md](./references/entitlements.md) before building paid features, access checks or the billing page, and meet every outcome below.

## Product catalog

Products are defined in server code, such as a constant or config module, not in a database table. Create a table only if the user asks for one. Each product has:

- `id`: unique and stable. Never reuse or change it; past orders refer to it.
- `name`, `amount` (in micros), `currency`.
- `type` (`one_time` or `recurring`), and for recurring products `period` and `interval`.
- `active`: set it to `false` to retire a product instead of deleting it.
- `repeatable`: `true` for one-time products that can be bought again, such as credit packs or donations.

The client receives a read-only view (ID, name, displayed price) from the server and sends only the ID when buying. Changes to products go through the server code.

If the project already stores what it sells in the database (for example a store's product table), that table is the catalog; read prices from it and don't add a second one.

## Required outcomes

These hold for every provider and stack. Check each one before telling the user the work is done.

- **The server decides the amount.** The client only says which item is being bought.
- **One idempotent function grants access.** Both in-app confirmation and the webhook call it, and calling it again for a paid order changes nothing.
- **Orders only move forward:** `created` to `paid` or `failed`, through conditional updates. Webhooks can arrive late, twice, or out of order.
- **Access is checked on the server** against the database. Hiding UI is cosmetic.
- **Webhooks are verified before anything is trusted:** the signature is checked on the raw request body, the handler answers quickly with a 2xx (also for events it ignores), and handling is idempotent.
- **Pending orders can be rechecked** with the provider, so a user who closed the tab after paying still gets access.
- **Secrets stay on the server.** `.env` is gitignored before any secret is written, secrets are referred to by name only, and their values are never printed.
- **No hardcoded origins.** Use relative paths in the client, and the request's forwarded host on the server.
- **Async work is awaited** before responding, because serverless platforms stop the function once the response is sent.
- **Buyers can see what they paid,** and subscribers can cancel, on a billing page limited to their own records (see [entitlements.md](./references/entitlements.md)). Cancelling calls the provider first, then updates the database from its response; access ends at the timing chosen in step 4.

Run these checks in test mode:

- A test payment completes and grants access.
- An amount changed in the client is rejected.
- The paid resource is denied without a payment, including through its API directly.
- Replaying a confirmation or webhook doesn't grant access twice.
- The billing page shows the test purchase, and a buyer can't see anyone else's.
- After paying, the pricing page shows the product as purchased, and buying it again is rejected unless it's repeatable.
- Cancelling a test subscription cancels it with the provider and in the database, and access ends at the chosen time.

## Handoff

Tell the user which environment variables they must set in production, by name only. The user sets them; don't change production settings yourself.
