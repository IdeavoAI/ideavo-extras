---
name: ui-skill
description: UI conventions for clean, minimal app screens that match the project, covering loading, empty and error states, forms, protected pages, paywalls and plan pages. Use this skill whenever you build or change UI for data, sign-in or payments, or the user asks for loading states, form handling, protected pages, a paywall, pricing or a billing page.
---

# UI conventions

## Styling

1. **Match what exists.** Before building UI, look at the project's component library, theme tokens (CSS variables, Tailwind config), fonts, dark mode, and the nearest existing page of the same kind. Reuse those components and tokens; never hardcode colours or add a second component library.
2. **Default to shadcn/ui** when the project uses it or has no component library yet (add missing components with `npx shadcn@latest add <name>`). New pages copy the nearest existing page's layout, spacing and typography.
3. **Ask only when there's nothing to match,** such as a blank project: include a style direction, or shadcn/ui defaults (Recommended), in the task's question call.
4. **Result visibility:** always include it in the task's question call, recommending the project's existing pattern if it has one: toasts (Recommended), an inline message next to the form or item, or both (inline for form errors, toasts for the rest). The in-progress state always stays on the control that started the action.

## Quality bar

Check every screen against this before finishing:

- **Every async operation shows three states:** in progress, success and error. This is non-negotiable unless the user says otherwise. Keep them minimal and informative, never blocking: a spinner inside the control that started it, or a skeleton for loading content; for success and error, the result visibility the user chose; errors say what to do next. Before building, add a todo for each async operation's three states.
- **Minimal:** one focal point and one primary action per view. Show hierarchy with size, weight and position rather than extra badges or labels. Remove any decoration whose job you can't name.
- **Aligned:** content sits in a centred container of consistent width, on the spacing scale. Group with space before cards (gaps between groups at least twice those within), and nest radii concentrically (outer = inner + padding).
- **Every state designed:** loading, empty and error views, plus a next step on every screen (no dead ends). Views whose data changes (lists, statuses, history) have a small refresh control that reloads in place with its in-progress state. After a change, update the screen from the response instead of reloading it. Destructive actions ask for confirmation in a dialog that names what will happen.
- **Responsive:** re-prioritise for mobile rather than stacking the desktop layout; the primary action stays reachable. About 16px side margins, touch targets of at least 44px, inputs at 16px, and safe areas respected by sticky bars. Nothing overlaps, clips or scrolls sideways; text wraps, with no fixed widths.
- **Accessible:** every control has a label, icon-only buttons have an `aria-label`, focus rings are visible, and status never relies on colour alone.
- **Themed:** uses the theme tokens so light and dark mode both look right.
- **Copy:** short, specific, second person; errors say how to fix the problem; loading text ends with an ellipsis ("Saving…"). Never invent testimonials, metrics or logos, or use placeholder names and filler words.

## Forms

- Every field has a visible label and the right `type`, `autocomplete` and `inputMode`. Validate on the client for quick feedback and on the server as the real check.
- Show errors under their fields and focus the first one. Keep submit enabled until the user submits; reset the form after a successful create and keep the input after a failure.

## References

Read only the files the task needs:

| File | Read when |
|---|---|
| [design-taste.md](./references/design-taste.md) | Building a new screen or page |
| [access.md](./references/access.md) | Building sign-in pages, the account menu, or pages gated by sign-in or payment |
| [billing.md](./references/billing.md) | Building the plan page, paid status or usage limits |
