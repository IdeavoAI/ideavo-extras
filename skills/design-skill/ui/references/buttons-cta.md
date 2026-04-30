# Buttons & CTAs

**Category**: Buttons, call-to-action elements, interactive triggers.
Use these as primary interaction points — keep CTA style consistent within one page section.

> **Reuse first.** Before installing or copy-pasting, check if the component already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). If found, import and reuse it. Only fetch docs when the component is absent or you're unsure about props/dependencies.

---

## Magic UI

### shiny-button
- **Library**: Magic UI
- **Vibe**: premium, shiny, dark, polished
- **Use-case**: Primary CTA with a shiny shimmer effect — high-conversion buttons
- **Install**:
  ```bash
  npx shadcn@latest add @magicui/shiny-button
  ```
- **Docs**: https://magicui.design/docs/components/shiny-button

### shimmer-button
- **Library**: Magic UI
- **Vibe**: modern, shimmer, sleek, dark
- **Use-case**: Button with a moving shimmer highlight — clean and attention-grabbing
- **Install**:
  ```bash
  npx shadcn@latest add @magicui/shimmer-button
  ```
- **Docs**: https://magicui.design/docs/components/shimmer-button

### rainbow-button
- **Library**: Magic UI
- **Vibe**: colorful, playful, vibrant, gradient
- **Use-case**: Animated rainbow gradient border button — fun and eye-catching
- **Install**:
  ```bash
  npx shadcn@latest add @magicui/rainbow-button
  ```
- **Docs**: https://magicui.design/docs/components/rainbow-button

### ripple-button
- **Library**: Magic UI
- **Vibe**: tactile, material, clean, satisfying
- **Use-case**: Button with ripple click effect — satisfying physical feedback
- **Install**:
  ```bash
  npx shadcn@latest add @magicui/ripple-button
  ```
- **Docs**: https://magicui.design/docs/components/ripple-button

---

## Aceternity UI

### Moving Border
- **Library**: Aceternity UI
- **Vibe**: eye-catching, animated, border, neon
- **Use-case**: Animated border that moves around a button or container
- **Install**: Copy-paste from https://ui.aceternity.com/components/moving-border
- **Docs**: https://ui.aceternity.com/components/moving-border

### Hover Border Gradient
- **Library**: Aceternity UI
- **Vibe**: elegant, premium, gradient, reveal
- **Use-case**: Gradient border that expands/reveals on hover — subtle premium feel
- **Install**: Copy-paste from https://ui.aceternity.com/components/hover-border-gradient
- **Docs**: https://ui.aceternity.com/components/hover-border-gradient

### Tailwind CSS Buttons
- **Library**: Aceternity UI
- **Vibe**: varied — from brutal to premium (see styles below)
- **Use-case**: Curated button style collection — pick by vibe:
  - **Sketch**: hand-drawn/rough aesthetic
  - **Shimmer**: light shimmer sweep
  - **Border Magic**: animated gradient border
  - **Brutal**: thick black border, no-nonsense
  - **Figma**: minimal, tool-like
  - **Spotify**: pill-shaped, music-app feel
  - **Gradient**: smooth gradient fill
- **Install**: Copy-paste from https://ui.aceternity.com/components/tailwindcss-buttons
- **Docs**: https://ui.aceternity.com/components/tailwindcss-buttons

### Stateful Button
- **Library**: Aceternity UI
- **Vibe**: functional, polished, feedback, UX-complete
- **Use-case**: Button that shows loading and success states — for async actions (form submit, API calls)
- **Install**: Copy-paste from https://ui.aceternity.com/components/stateful-button
- **Docs**: https://ui.aceternity.com/components/stateful-button

---

## Guardrails

- Use at most 1 primary CTA style per section — mixing too many button variants creates visual noise.
- Stateful Button is the right choice whenever a button triggers an async operation.
- Animated border buttons (Moving Border, Hover Border Gradient) work best on dark backgrounds.
- Rainbow Button works on both light/dark but avoid pairing with other colorful elements.
