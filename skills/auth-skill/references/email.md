# Email Reference

This file covers all email-related configuration for Better Auth using Resend and the `<EmailTemplate />` component from `@daveyplate/better-auth-ui/server`.

**Package:** `@daveyplate/better-auth-ui/server` — install alongside `better-auth-ui` if not already present.

---

## Shared: sendEmail Helper

Before implementing any email feature, define a shared `sendEmail` utility to keep auth config clean:

**`lib/email.tsx`**

```tsx
import { Resend } from "resend"
import { EmailTemplate } from "@daveyplate/better-auth-ui/server"

const resend = new Resend(process.env.RESEND_API_KEY)
const fromEmail = process.env.EMAIL_FROM ?? "no-reply@yoursite.com"

export async function sendEmail({
    to,
    subject,
    heading,
    action,
    content,
    url,
}: {
    to: string
    subject: string
    heading: string
    action: string
    content: React.ReactNode
    url: string
}) {
    await resend.emails.send({
        from: fromEmail,
        to,
        subject,
        react: EmailTemplate({
            heading,
            action,
            content,
            siteName: process.env.NEXT_PUBLIC_SITE_NAME,
            baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
            url,
        }),
    })
}
```

---

## Section: Email Verification

Use this when `requireEmailVerification: true` is set on `emailAndPassword`.

**`lib/auth.ts`**

```ts
emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
},
emailVerification: {
    sendVerificationEmail: async ({ user, url }, request) => {
        const name = user.name || user.email.split("@")[0]

        await sendEmail({
            to: user.email,
            subject: "Verify your email address",
            heading: "Verify Email",
            action: "Verify Email",
            content: (
                <>
                    <p>{`Hello ${name},`}</p>
                    <p>Click the button below to verify your email address.</p>
                </>
            ),
            url,
        })
    },
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
},
```

---

## Section: Password Reset

Use this when the user requires a forgot-password / reset-password flow. Add these handlers inside `emailAndPassword` in `lib/auth.ts`:

**`lib/auth.ts`**

```ts
emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url, token }, request) => {
        await sendEmail({
            to: user.email,
            subject: "Reset your password",
            heading: "Reset Password",
            action: "Reset Password",
            content: (
                <>
                    <p>{`Hello ${user.name || user.email.split("@")[0]},`}</p>
                    <p>Click the button below to reset your password. This link expires shortly.</p>
                </>
            ),
            url,
        })
    },
    onPasswordReset: async ({ user }, request) => {
        // Optional: notify user that their password was changed
        console.log(`Password for user ${user.email} has been reset.`)
    },
},
```

> `onPasswordReset` is a lifecycle hook — use it to send a confirmation email or audit log the event. It is optional and safe to leave as a no-op initially.

---

## EmailTemplate Props Reference

| Prop | Type | Default |
|------|------|---------|
| `variant?` | `"vercel"` | `"vercel"` |
| `url?` | `string` | — |
| `siteName?` | `string` | `process.env.SITE_NAME \|\| process.env.NEXT_PUBLIC_SITE_NAME` |
| `preview?` | `string` | — |
| `imageUrl?` | `string` | `` `${baseUrl}/apple-touch-icon.png` `` |
| `heading` | `ReactNode` | — |
| `content` | `ReactNode` | — |
| `baseUrl?` | `string` | `process.env.BASE_URL \|\| process.env.NEXT_PUBLIC_BASE_URL` |
| `action?` | `string` | — |
| `classNames?` | `EmailTemplateClassNames` | — |

---

## Environment Variables

```
RESEND_API_KEY=re_...
EMAIL_FROM=no-reply@yoursite.com
NEXT_PUBLIC_SITE_NAME=Your App
NEXT_PUBLIC_BASE_URL=https://yoursite.com
```
