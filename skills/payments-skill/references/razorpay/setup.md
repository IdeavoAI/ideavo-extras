# Razorpay setup

The merchant connects their Razorpay account to the workspace through OAuth. The project gets tokens from that connection instead of API keys; there is no key secret.

## Credentials

1. Make sure `.env` is gitignored before writing anything to it (`git check-ignore -q .env`). If it isn't, add it to `.gitignore` first.
2. If `.env` already has `RAZORPAY_ACCESS_TOKEN`, check it still works (see [Calling the API from the shell](#calling-the-api-from-the-shell)). Keep it on a 200. On a 401, continue to step 3.
3. Call the `integration` tool with `type: "payments"` and `provider: "razorpay"`.
   - Connected: it returns `KEY=value` lines. Write them into `.env`, replacing any existing lines with the same keys.
   - Not connected: the user is shown a Connect button. Tell them in one sentence that the workspace owner can connect Razorpay, then stop. Continue only after they confirm it's connected.

| Variable | What it is | Where it's used |
|---|---|---|
| `RAZORPAY_ACCESS_TOKEN` | Private token for the merchant's account | Server only |
| `RAZORPAY_ACCOUNT_ID` | The merchant's account ID | Server only |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Public token, used as Checkout's `key` | Browser |

## Test and live mode

The tool reports the connection's mode.

- **Test:** no real money moves. Use it for the whole build and every check.
- **Live:** payments charge real money. Tell the user before building, and get their confirmation before any payment is attempted.

## Calling the API from app code

- Base URL `https://api.razorpay.com/v1`, JSON bodies.
- Authenticate with `Authorization: Bearer ${process.env.RAZORPAY_ACCESS_TOKEN}` (or the stack's equivalent), from server code only.
- Use the platform's HTTP client (`fetch` or similar).
- A 401 means the token is invalid, expired or revoked. Log it and fail the request; don't retry it.
- Errors come back as `{ "error": { "code", "description", "field", ... } }`. Show the user a generic message, and log `description`.

## Calling the API from the shell

Some steps (checking the token, creating plans, registering webhooks) call the API from the sandbox. Load `.env` in the same command, and print only what you need, never the token:

```bash
set -a; . ./.env; set +a
curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $RAZORPAY_ACCESS_TOKEN" "https://api.razorpay.com/v1/orders?count=1"
```

Any call that creates or changes something on the merchant's account (a plan, a webhook) needs the user's confirmation first.

## Docs

- Using OAuth tokens for API calls and Checkout: https://razorpay.com/docs/partners/technology-partners/onboard-businesses/integrate-oauth/integration-steps.md
- API reference: https://razorpay.com/docs/api.md
