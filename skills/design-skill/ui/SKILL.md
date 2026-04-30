---
name: ui
description: Use this skill when users want to add, customize, or select UI components from Magic UI or Aceternity UI in React/Next.js projects. Covers component discovery, install commands, integration patterns, and section-level recipes across both libraries.
metadata:
  short-description: Find and use Magic UI + Aceternity UI components by category
---

# UI Component Library (Magic UI + Aceternity UI)

> **Check here before writing any UI component from scratch.** If a matching or close-enough component exists in Magic UI or Aceternity UI, always use it instead of building custom. Only write custom code when no library component fits the need.

Use this skill when the task involves picking or implementing animated/interactive UI components from Magic UI or Aceternity UI.

## When To Apply

Apply this skill when users ask to:

- Add an animated or interactive component (button, card, background, text effect, etc.)
- Build a UI section using library components (hero, feature grid, testimonials, nav, etc.)
- Find the right component for a specific visual effect or behavior
- Troubleshoot install or integration issues for `@magicui/*` or Aceternity components

## Install Contracts

**Magic UI** — registry-based via shadcn:
```bash
npx shadcn@latest init        # once per project
npx shadcn@latest add @magicui/<component-slug>
```
Import from: `@/components/ui/<component-slug>`

**Aceternity UI** — copy-paste install:
Visit `https://ui.aceternity.com/components/<component-name>` and copy the component source directly into your project.
Some components require extra deps (Framer Motion, Three.js) — check the docs page.

## Category Router — Load On Demand

Load only the file relevant to the task. Each file is a complete list of every component in that category from both libraries.

| What you need | Load file |
|---|---|
| Background, canvas, texture, stars, beams, aurora, grid, particles | `references/backgrounds.md` |
| Button, CTA, call-to-action, interactive trigger | `references/buttons-cta.md` |
| Card, panel, bento, tile, container, interactive frame | `references/cards.md` |
| Text animation, word effect, typography motion, typewriter | `references/text-effects.md` |
| Scroll effect, parallax, marquee, timeline, reveal-on-scroll | `references/scroll-animation.md` |
| Navbar, sidebar, floating dock, tabs, navigation, pointer | `references/navigation.md` |
| Globe, world map, image slider, video, compare, media | `references/media-display.md` |
| Loader, form, file upload, modal, tooltip, input, utility | `references/loaders-utility.md` |
| Terminal, keyboard, code block, ASCII, pixel, retro, developer | `references/dev-creative.md` |
| Full section recipe, combining multiple components | `references/recipes.md` |

## Core Workflow

1. Identify what the user needs (category → load the right reference file).
2. Pick the component(s) that fit the vibe and use-case.
3. **Check if already installed first** — scan `components/ui/` (Magic UI) or the project source for existing component files before installing anything. If it's there, reuse it directly.
4. If not installed: use the correct install method (see Install Contracts above). Only fetch/read docs when you are uncertain about props, required dependencies, or peer packages.
5. Integrate — import from generated path or paste into project.
6. Validate: accessibility, responsiveness, no animation stacking, text contrast over backgrounds.

## Reuse First Rule

> **Default assumption: if a component was used before in this project, the file already exists. Reuse it.**
>
> - Magic UI: after `npx shadcn add`, the component file lives at `@/components/ui/<slug>`. Import from there — do not re-run install.
> - Aceternity UI: after copy-paste, the component file is somewhere in `components/`. Search for it before pasting again.
> - **Only open docs when**: the component is not in the project yet, you are unsure which props exist, or you need to check peer dependency requirements.

## Guardrails

- Stack at most 2 high-motion effects per viewport section.
- Animated backgrounds must not reduce text contrast below WCAG AA.
- Auto-scrolling content (marquees, carousels) must pause on hover/focus.
- Prefer prop/className customization over editing component internals.
- Check for required global CSS keyframes or extra dependencies before integrating.

## Reference Links

- Magic UI docs: `https://magicui.design/docs`
- Magic UI components: `https://magicui.design/docs/components`
- Aceternity UI components: `https://ui.aceternity.com/components`
