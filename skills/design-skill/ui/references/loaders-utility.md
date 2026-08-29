# Loaders & Utility

**Category**: Loaders, forms, file inputs, modals, tooltips, utility UI.
Use these for functional UX — feedback states, user inputs, overlays, and informational overlays.

> **Reuse first.** Before installing or copy-pasting, check if the component already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). If found, import and reuse it. Only fetch docs when the component is absent or you're unsure about props/dependencies.

---

## Magic UI

Magic UI delegates forms and utility components to shadcn/ui. Use shadcn for base form, dialog, and tooltip primitives, then layer Magic UI effects (blur-fade, shimmer-button, etc.) on top.

---

## Aceternity UI

### Animated Modal
- **Library**: Aceternity UI
- **Vibe**: clean, smooth, modern, overlay
- **Use-case**: Customizable modal with smooth entrance/exit transitions — confirmations, detail views
- **Install**: Copy-paste from https://ui.aceternity.com/components/animated-modal
- **Docs**: https://ui.aceternity.com/components/animated-modal

### Animated Tooltip
- **Library**: Aceternity UI
- **Vibe**: polished, delightful, hover-info, spring
- **Use-case**: Tooltip that reveals on hover with a spring animation and follows the pointer
- **Install**: Copy-paste from https://ui.aceternity.com/components/animated-tooltip
- **Docs**: https://ui.aceternity.com/components/animated-tooltip

### File Upload
- **Library**: Aceternity UI
- **Vibe**: minimal, clean, drag-and-drop, utility
- **Use-case**: Minimal drag-and-drop file upload area — clean and functional
- **Install**: Copy-paste from https://ui.aceternity.com/components/file-upload
- **Docs**: https://ui.aceternity.com/components/file-upload

### Gooey Input
- **Library**: Aceternity UI
- **Vibe**: playful, fluid, gooey, search
- **Use-case**: Search input with SVG filter gooey animation — adds fluid, organic feel to inputs
- **Install**: Copy-paste from https://ui.aceternity.com/components/gooey-input
- **Docs**: https://ui.aceternity.com/components/gooey-input

### Loaders
- **Library**: Aceternity UI
- **Vibe**: simple, minimal, utility, clean
- **Use-case**: Simple minimal loading spinners for inline or full-screen loading states
- **Install**: Copy-paste from https://ui.aceternity.com/components/loaders
- **Docs**: https://ui.aceternity.com/components/loaders

### Multi Step Loader
- **Library**: Aceternity UI
- **Vibe**: functional, polished, step-feedback, onboarding
- **Use-case**: Loading screen that shows multiple steps with progress — file processing, onboarding flows
- **Install**: Copy-paste from https://ui.aceternity.com/components/multi-step-loader
- **Docs**: https://ui.aceternity.com/components/multi-step-loader

### Signup Form
- **Library**: Aceternity UI
- **Vibe**: modern, polished, shadcn-based, clean
- **Use-case**: Pre-built signup form with social login and Framer Motion animations — auth flows
- **Install**: Copy-paste from https://ui.aceternity.com/components/signup-form
- **Docs**: https://ui.aceternity.com/components/signup-form

### Stateful Button
- **Library**: Aceternity UI
- **Vibe**: functional, UX-complete, polished, feedback
- **Use-case**: Button that transitions through loading → success → reset states — form submit, API triggers
- **Install**: Copy-paste from https://ui.aceternity.com/components/stateful-button
- **Docs**: https://ui.aceternity.com/components/stateful-button

### Tooltip Card
- **Library**: Aceternity UI
- **Vibe**: elegant, interactive, hover-detail, card
- **Use-case**: Tooltip container that follows the mouse on hover and shows a rich card — profile previews, link previews
- **Install**: Copy-paste from https://ui.aceternity.com/components/tooltip-card
- **Docs**: https://ui.aceternity.com/components/tooltip-card

### Placeholders And Vanish Input
- **Library**: Aceternity UI
- **Vibe**: polished, modern, search, animated-placeholder
- **Use-case**: Input with cycling animated placeholder text that vanishes on submit
- **Install**: Copy-paste from https://ui.aceternity.com/components/placeholders-and-vanish-input
- **Docs**: https://ui.aceternity.com/components/placeholders-and-vanish-input

---

## Guardrails

- Stateful Button is the correct choice whenever a button triggers any async operation — never use a plain disabled state for loading.
- Multi Step Loader should list real steps, not fake progress — keep copy honest.
- Animated Modal must trap focus and support `Escape` key dismissal for accessibility.
- Animated Tooltip must be triggered by hover AND focus for keyboard accessibility.
- Gooey Input is a creative enhancement — ensure the underlying input is still functional without the effect.
