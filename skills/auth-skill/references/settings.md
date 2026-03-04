# Settings Reference

Settings card components from `@daveyplate/better-auth-ui`. All components read config from `AuthUIProvider` — no extra wiring needed unless noted.

---

## Composite Components

### AccountSettingsCards

Renders all account-related cards in one shot. Cards are shown conditionally based on `AuthUIProvider` config.

```tsx
// app/account/settings/page.tsx
import { AccountSettingsCards } from "@daveyplate/better-auth-ui"

export default function SettingsPage() {
  return <AccountSettingsCards className="max-w-xl" />
}
```

Included cards (conditional): avatar, username, name, email, custom fields, linked accounts.

**Custom fields via `AuthUIProvider`:**

```tsx
<AuthUIProvider
  additionalFields={{
    age: { label: "Age", type: "number", required: true },
    newsletter: { label: "Newsletter", type: "boolean" }
  }}
  account={{ fields: ["image", "name", "age", "newsletter"] }}
>
```

---

### SecuritySettingsCards

Renders all security-related cards in one shot.

```tsx
import { SecuritySettingsCards } from "@daveyplate/better-auth-ui"

<SecuritySettingsCards />
```

Included cards (conditional): change password, linked providers, 2FA, passkeys, sessions, delete account.

---

### AccountView

Full account management UI with built-in navigation. Includes `AccountSettingsCards`, security settings, API keys, and org switcher if enabled.

```tsx
// app/account/[path]/page.tsx
import { AccountView } from "@daveyplate/better-auth-ui"

export default function AccountPage() {
  return <AccountView />
}
```

---

## Individual Cards

Use these when you need a custom layout instead of the composite components.

### UpdateAvatarCard

Avatars are auto-cropped to square. Without `avatar.upload` in `AuthUIProvider`, stores as base64.

```tsx
<UpdateAvatarCard />
```

**To use custom upload:**

```tsx
// in AuthUIProvider
avatar={{
  upload: async (file: File) => {
    const formData = new FormData()
    formData.append("avatar", file)
    const res = await fetch("/api/uploadAvatar", { method: "POST", body: formData })
    const { data } = await res.json()
    return data.url
  },
  delete: async (url: string) => {
    await fetch("/api/deleteAvatar", { method: "POST", body: JSON.stringify({ url }) })
  }
}}
```

---

### UpdateNameCard

```tsx
<UpdateNameCard />
```

---

### UpdateUsernameCard

Only renders if `credentials.username` is enabled.

```tsx
<UpdateUsernameCard />
```

---

### UpdateFieldCard

For updating arbitrary custom user fields.

```tsx
import { UpdateFieldCard } from "@daveyplate/better-auth-ui"

// Text
<UpdateFieldCard name="bio" label="Bio" type="string" placeholder="About you" />

// Number with validation
<UpdateFieldCard name="age" label="Age" type="number" required validate={(v) => Number(v) >= 18} />

// Boolean (renders checkbox)
<UpdateFieldCard name="newsletter" label="Subscribe to newsletter" type="boolean" />

// Select
<UpdateFieldCard
  name="role"
  label="Role"
  type="select"
  options={[{ label: "Admin", value: "admin" }, { label: "User", value: "user" }]}
/>
```

---

### ChangeEmailCard

Only renders if `changeEmail` is enabled. Sends verification to new address if email verification is on.

```tsx
<ChangeEmailCard />
```

---

### ChangePasswordCard

Only renders if `credentials` is enabled. For social-only accounts, shows "Set Password" button that emails a setup link instead.

```tsx
<ChangePasswordCard />
```

---

### ProvidersCard

Manage linked social accounts (link/unlink). Requires `providers` to be configured in `AuthUIProvider`.

```tsx
<ProvidersCard />
```

---

### AccountsCard

View and manage all linked social accounts. Prevents unlinking if it's the only auth method.

```tsx
<AccountsCard />
```

---

### SessionsCard

View and revoke active sessions across devices.

```tsx
<SessionsCard />
```

---

### TwoFactorCard

Enable/disable 2FA. Handles QR code scanning and backup code generation. Only renders if `twoFactor` is enabled and user has a credential-linked account.

```tsx
<TwoFactorCard />
```

---

### PasskeysCard

View, add, and delete WebAuthn passkeys. Only renders if passkeys are enabled.

```tsx
<PasskeysCard />
```

---

### ApiKeysCard

Create, list, and delete API keys. Keys are shown in full only once on creation.

```tsx
<ApiKeysCard />
```

**Requires in `AuthUIProvider`:**

```tsx
apiKey={{
  prefix: "app_"   // optional
}}
```

---

### DeleteAccountCard

Confirms via password or email before deleting. Owner role only — excluded from the default composite.

```tsx
<DeleteAccountCard />
```

---

## Full Custom Settings Page Example

```tsx
import {
  UpdateAvatarCard, UpdateUsernameCard, ChangeEmailCard,
  ChangePasswordCard, ProvidersCard, SessionsCard, DeleteAccountCard
} from "@daveyplate/better-auth-ui"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <UpdateAvatarCard />
      <UpdateUsernameCard />
      <ChangeEmailCard />
      <ChangePasswordCard />
      <ProvidersCard />
      <SessionsCard />
      <DeleteAccountCard />
    </div>
  )
}
```
