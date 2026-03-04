# UI Integration Reference

UI patterns for connecting database operations to the frontend — API routes, custom hooks, toasts, loading states, and form handling.

---

## Step 1 — Enable Toasts (Sonner)

Add `<Toaster />` once in `app/layout.tsx`. Never add it per-page or per-component.

```typescript
import { Toaster } from "sonner"
// inside the root layout body:
<Toaster />
```

Call these inside mutation functions — after success or in the catch block:

```typescript
import { toast } from "sonner"

toast.success("User created")
toast.error("Failed to create user")
```

---

## Step 2 — CRUD API Routes

Every database table gets its own API routes. Every route handler **must** wrap the db call in try/catch — no exceptions.

**File:** `app/api/{resource}/route.ts`

### GET all

```typescript
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { tableName } from "@/lib/schema"

export async function GET() {
  try {
    const items = await db.select().from(tableName)
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
```

### POST

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const [item] = await db.insert(tableName).values(body).returning()
    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 })
  }
}
```

**File:** `app/api/{resource}/[id]/route.ts`

### GET by ID

```typescript
import { NextRequest, NextResponse } from "next/server"
import { eq } from "drizzle-orm"

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const [item] = await db.select().from(tableName).where(eq(tableName.id, params.id))
    if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
```

### PUT

```typescript
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const [item] = await db
      .update(tableName)
      .set(body)
      .where(eq(tableName.id, params.id))
      .returning()
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 })
  }
}
```

### DELETE

```typescript
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await db.delete(tableName).where(eq(tableName.id, params.id))
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
```

---

## Step 3 — Custom Hook (Mandatory for New Projects)

> **This step is not optional. Every resource must have a dedicated hook. Do not skip it.**

For every database resource, create `hooks/use-{resource}.ts`. This is the only place where:
- `fetch` calls are made
- loading/submitting state lives
- `toast` is called

**Components must contain zero fetch calls, zero toast calls, and zero server state.** If you find yourself writing `fetch(...)` or `toast(...)` inside a component, stop — it belongs in the hook.

### Hook structure

The hook exposes the state and functions its UI actually needs. Design it for the project — not from a generic template. A typical hook looks like this:

```typescript
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import type { Resource } from "@/lib/schema"

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then(setResources)
      .catch(() => toast.error("Failed to load resources"))
      .finally(() => setLoading(false))
  }, [])

  async function create(data: Omit<Resource, "id" | "createdAt">) {
    setSubmitting(true)
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      const item: Resource = await res.json()
      setResources((prev) => [item, ...prev])
      toast.success("Resource created")
      return item
    } catch {
      toast.error("Failed to create resource")
    } finally {
      setSubmitting(false)
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/resources/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setResources((prev) => prev.filter((r) => r.id !== id))
      toast.success("Resource deleted")
    } catch {
      toast.error("Failed to delete resource")
    }
  }

  return { resources, loading, submitting, create, remove }
}
```

**Existing projects**: if there is already an established data-fetching convention, follow it. Do not introduce hooks unless the user explicitly asks.

---

## Rules

- **New projects**: the custom hook pattern is mandatory. Zero fetch calls, zero toast calls, zero server state in components. No exceptions.
- **Every db call** — in both API routes and hooks — must be wrapped in try/catch. A db call without try/catch is always a bug.
- **Existing projects**: adopt the existing convention — do not change it unless explicitly asked.
- `<Toaster />` goes in root layout once — never per-page or per-component.
- Every mutation (create, update, delete) must have both a success toast and an error toast.
- Never show raw server error messages in toasts — always use friendly, user-facing copy.
- Loading/submitting state resets in `finally` — never rely on the happy path to reset it.
- Forms reset after a successful create.
- Local state is updated after every mutation — never refetch the full list to reflect a single change.
