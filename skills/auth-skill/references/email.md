# Auth emails

Only for features that send email. With Resend, ask for `RESEND_API_KEY` with the `question` tool if `.env` doesn't have it, and set `EMAIL_FROM` to a sender on a domain verified in Resend. If the user chose to log emails for now, `sendEmail` logs the recipient, subject and link to the console instead.

## Sending

`<lib>/email.ts`, server only: a `sendEmail({ to, subject, html })` helper that calls `new Resend(process.env.RESEND_API_KEY).emails.send({ from: process.env.EMAIL_FROM, to, subject, html })`. Keep the HTML simple: a heading, one sentence and a button linking to the URL Better Auth provides.

## In `auth.ts`

- **Verification:** set `emailAndPassword.requireEmailVerification: true` and `emailVerification: { sendOnSignUp: true, autoSignInAfterVerification: true, sendVerificationEmail: ({ user, url }) => sendEmail(...) }`.
- **Password reset:** set `emailAndPassword.sendResetPassword: ({ user, url }) => sendEmail(...)`, and add forgot-password and reset-password pages.

Links in these emails come from Better Auth's base URL, so in the sandbox they point at the preview host; in production, at `BETTER_AUTH_URL`.

## Docs

Fetch only if needed: https://better-auth.com/docs/concepts/email.md and https://better-auth.com/docs/authentication/email-password.md
