# Auth UI Reference

UI integration patterns using `@daveyplate/better-auth-ui`.

---

## Install

```bash
{package_manager} install @daveyplate/better-auth-ui@latest
```

### TailwindCSS v4

Add to your global CSS file (`styles/globals.css`):

```css
@import "@daveyplate/better-auth-ui/css";
```

### TailwindCSS v3 (Deprecated)

Add to `tailwind.config.js`:

```js
content: [
  "./node_modules/@daveyplate/better-auth-ui/dist/**/*.{js,ts,jsx,tsx,mdx}"
]
```

---

## Auth UI Provider

**File:** `app/providers.tsx`

Wrap root layout with `AuthUIProvider`. Use `router.refresh()` in `onSessionChange` to clear App Router cache for protected routes.

```typescript
"use client"
import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { slug } = useParams<{ slug: string }>()

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      toast={({ variant, message }) => {
        if (variant === "error") toast.error(message)
        else if (variant === "success") toast.success(message)
        else if (variant === "warning") toast.warning(message)
        else if (variant === "info") toast.info(message)
        else toast(message)
      }}
    >
      {children}
    </AuthUIProvider>
  )
}
```

Then wrap `app/layout.tsx`:

```typescript
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body><Providers>{children}</Providers></body></html>
}
```

---

## Auth Pages

**File:** `app/auth/[path]/page.tsx`

Dynamic route for all auth views (sign-in, sign-up, etc.). `generateStaticParams` covers all paths from `authViewPaths`.

```typescript
import { AuthView } from "@daveyplate/better-auth-ui"
import { authViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }))
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params
  return (
    <main className="container flex grow flex-col items-center justify-center p-4 md:p-6">
      <AuthView path={path} />
    </main>
  )
}
```

Default routes: `/auth/sign-in`, `/auth/sign-up`

---

## Account Pages

**File:** `app/account/[path]/page.tsx`

Dynamic route for account management views.

```typescript
import { AccountView } from "@daveyplate/better-auth-ui"
import { accountViewPaths } from "@daveyplate/better-auth-ui/server"

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }))
}

export default async function AccountPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params
  return (
    
    {/* always follow this tailwind class */}
    <main className="flex items-center justify-center min-h-screen">
      <AccountView path={path} />
    </main>
  )
}
```

---

## Account Settings Page

**File:** `app/account/settings/page.tsx`

```typescript
import { AccountSettingsCards } from "@daveyplate/better-auth-ui"

export default function SettingsPage() {
  return (
    <div className="flex justify-center py-12 px-4">
      <AccountSettingsCards className="max-w-xl" />
    </div>
  )
}
```

---

## Protected Page Pattern

Use `AuthLoading`, `RedirectToSignIn`, and `SignedIn` together for protected pages.

```typescript
import { AuthLoading, RedirectToSignIn, SignedIn } from "@daveyplate/better-auth-ui"
import { YourCustomSkeleton } from "@/components/your-custom-skeleton"
import { DashboardContent } from "@/components/dashboard-content"

export default function ProtectedPage() {
  return (
    <>
      <AuthLoading><YourCustomSkeleton /></AuthLoading>
      <RedirectToSignIn />
      <SignedIn><DashboardContent /></SignedIn>
    </>
  )
}
```

- `AuthLoading` — renders children while session is initializing
- `RedirectToSignIn` — redirects unauthenticated users
- `SignedIn` — renders children only for authenticated users

---

## Header Component

**File:** `components/Header.tsx`

> If a header/navbar already exists, merge auth state into it — do not create a duplicate. Detect the project name from `package.json` or existing layout. Use existing shadcn components from `@/components/ui`. Never add a separate sign-up button — `UserButton` handles both sign-in and sign-up internally.

```typescript
"use client"
import { UserButton } from "@daveyplate/better-auth-ui"
import Link from "next/link"

export function Header() {
  return (
    <header>
      <div>
        <Link href="/">
          {/* Replace with actual project name */}
          Project Name
        </Link>
        {/* Always use size="icon" — renders a compact avatar button */}
        <UserButton size="icon" />
      </div>
    </header>
  )
}
```
