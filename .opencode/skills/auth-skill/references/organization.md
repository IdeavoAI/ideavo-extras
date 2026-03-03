# Organization Reference

UI components for organization management using `@daveyplate/better-auth-ui`.

---

## AuthUIProvider Setup

Enable organization support in `app/providers.tsx`:

```tsx
<AuthUIProvider
  authClient={authClient}
  organization={{
    logo: {
      upload: async (file) => {
        // upload to your storage, return URL
        return uploadedUrl
      },
      delete: async (url) => {
        // optional: clean up storage on delete
      }
    },
    customRoles: [
      { role: "developer", label: "Developer" },
      { role: "viewer", label: "Viewer" }
    ]
  }}
>
  {children}
</AuthUIProvider>
```

> `logo` object is only needed if you want logo upload support. `customRoles` is optional — omit if using default roles only.

---

## OrganizationSwitcher

Displays active org/personal account and lets users switch, create orgs, or access org settings.

```tsx
import { OrganizationSwitcher } from '@daveyplate/better-auth-ui'

// Basic
<OrganizationSwitcher />

// Force org-only (hide personal account)
<OrganizationSwitcher hidePersonal />

// Custom trigger
<OrganizationSwitcher trigger={<Button variant="outline">Switch Org</Button>} />

// Callback on switch
<OrganizationSwitcher onSetActive={(org) => console.log('Switched to:', org)} />
```

**Key props:** `hidePersonal`, `hideCreate`, `onSetActive`, `trigger`, `align`, `side`

---

## OrganizationSettingsCards

Renders cards for updating org name, slug, logo, and deleting the org.

```tsx
import { OrganizationSettingsCards } from '@daveyplate/better-auth-ui'

<OrganizationSettingsCards />
```

**Permissions:**
- View: all members
- Update name/slug/logo: admin + owner
- Delete org: owner only

---

## OrganizationMembersCard

Manages members — invite, change roles, remove.

```tsx
import { OrganizationMembersCard } from '@daveyplate/better-auth-ui'

<OrganizationMembersCard />
```

**Role hierarchy:** Owner > Admin > Member > custom roles

**Permissions:**
- Invite: `invitation:create`
- Update roles: `member:update`
- Remove: `member:delete`

---

## AcceptInvitationCard

Handles the invitation acceptance flow. Place on a dedicated page.

```tsx
// app/auth/accept-invitation/page.tsx
import { AcceptInvitationCard } from '@daveyplate/better-auth-ui'

export default function AcceptInvitationPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <AcceptInvitationCard />
    </main>
  )
}
```

Expects `?invitationId=<id>` in the URL. Redirects to sign-in if unauthenticated. Handles expired, invalid, and already-processed invitations automatically.
