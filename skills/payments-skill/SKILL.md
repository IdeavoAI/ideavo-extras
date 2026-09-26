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

A provider's entry file lists its questions and which of its files each flow needs.

## Workflow

Work in few, batched steps. Make independent tool calls in parallel, and don't reread files you've already read.

### 1. Scan

Read these in one parallel batch, and nothing more unless something is unclear:

- The package manifest and framework config: stack, platform, where server code runs.
- ORM config and schema files, and whether `.env` has `DATABASE_URL` (check the name only).
- The auth setup, if any.
- Existing payment code: search the source (excluding dependencies and build output) for `razorpay`, `stripe`, `checkout` and payment environment variable names.
- Pricing pages, plans or premium features.
- Hardcoded origins: search the source for `localhost:`.

### 2. Readiness

| Check | Passes when | Otherwise |
|---|---|---|
| Server-side code | Code runs on a server (API routes, server actions, a backend). Credentials can't be kept safe in the browser. | Stop and explain why payments can't be added. |
| Database | The server can write to a database through an ORM or query layer. Payment state must be durable. | Ask in step 3: set one up with `database-skill` (run it in full) or use the user's own. Continue only once it's connected and migrations run. |
| Existing payment code | None, or it's for the chosen provider and can be extended. | Ask in step 3: extend it or replace it. Never build a second integration next to it. |
| Something to charge for | There's a clear product or service. | Ask in step 3, suggesting one or two options that fit the project. |
| Identity | The purchase isn't tied to an account, or authentication exists. | Ask in step 3: set it up with `auth-skill`, or make it a guest purchase that records the buyer's email or phone. |
| Platform | The provider's row in the table covers the project's platform. | Stop and say the platform isn't supported for this provider yet. |
| URLs | No hardcoded origins, and the dev server accepts its public host. | Fix it while building. The app runs behind a public URL that changes between sandboxes. |

If every check passes, say so in one line. Otherwise list only the failing checks, with what you found.

### 3. Ask once

Make a single `question` call with everything still open:

- The provider, unless the user named one or the project already has one: **Razorpay (Recommended, India only)** or **Other**.
- What is sold and its price, suggesting what the scan found.
- One-time or recurring. For recurring: billing period, total billing cycles, a free trial, and whether cancelling ends access immediately or at the end of the paid period.
- Any question a failing readiness check needs.

Finalise the currency: it must be one the provider supports, as its entry file states. If it isn't, ask the user to change the currency or choose another provider. Never convert prices on your own.

### 4. Load

In one parallel batch:

- For Razorpay: call the `integration` tool (see [razorpay.md](./references/razorpay.md) and its `setup.md`) and read `razorpay.md`, every Razorpay file the chosen flow needs, [entitlements.md](./references/entitlements.md), and `references/payments-schema.md` in `database-skill`'s folder, next to its `SKILL.md`. Read only that schema file; don't invoke `database-skill`.
- For Other: ask the user for the credentials by the exact environment variable names the provider documents, and read `entitlements.md` and `payments-schema.md` the same way.

If the provider isn't connected, stop as `setup.md` says.

### 5. Build

Create the payment tables and run the migration, then build the provider flow, gating and the billing page. Work straight from what you've read, without narrating the structure.

### 6. Verify once

At the end, run the project's type check and build once, and fix what fails. Check the required outcomes below against the code. Leave the checks that need a real payment to the user.

### 7. Finish

Reply in at most five lines: what was built, the environment variables to set in production (names only; the user sets them, don't change production settings yourself), the webhook to register once the app is deployed (see the provider's webhook file), and what the user should test.

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
- **Buyers can see what they paid,** and subscribers can cancel, on a billing page limited to their own records (see [entitlements.md](./references/entitlements.md)). Cancelling calls the provider first, then updates the database from its response; access ends at the timing chosen in step 3.

Checks for the user to run in test mode:

- A test payment completes and grants access.
- An amount changed in the client is rejected.
- The paid resource is denied without a payment, including through its API directly.
- Replaying a confirmation or webhook doesn't grant access twice.
- The billing page shows the test purchase, and a buyer can't see anyone else's.
- After paying, the pricing page shows the product as purchased, and buying it again is rejected unless it's repeatable.
- Cancelling a test subscription cancels it with the provider and in the database, and access ends at the chosen time.
