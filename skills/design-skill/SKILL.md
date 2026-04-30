---
name: design-skill
description: Design orchestrator. Routes to the right sub-skill based on what the user wants. Never designs directly — only navigates.
---

# Design Orchestrator

Your only job: read the request, pick the right route below, load that file, and follow it fully. Do not design anything yourself. Do not blend routes.

## Routing Table

> **Before building any UI component from scratch** — check the UI component library first.
> Load `design-skill/ui/SKILL.md` to browse categories, then load the specific reference file.
> If a suitable component exists in Magic UI or Aceternity UI, always prefer it over writing custom code.

### UI Components (Magic UI + Aceternity)
Load the specific reference file — not the whole ui skill.

| User wants | Load |
|---|---|
| Not sure which component category, want to browse what's available | `design-skill/ui/SKILL.md` |
| Text animation, word effects, typewriter, flip words, encrypted text, blur-fade | `design-skill/ui/references/text-effects.md` |
| Buttons, CTAs, shimmer, rainbow, moving border, stateful button | `design-skill/ui/references/buttons-cta.md` |
| Cards, bento grid, 3D card, hover effects, card spotlight, wobble, evervault | `design-skill/ui/references/cards.md` |
| Backgrounds, beams, aurora, particles, spotlight, grid pattern, stars, meteor | `design-skill/ui/references/backgrounds.md` |
| Scroll effects, parallax, marquee, tracing beam, timeline, macbook scroll | `design-skill/ui/references/scroll-animation.md` |
| Navbar, sidebar, floating dock, tabs, custom cursor, sticky banner | `design-skill/ui/references/navigation.md` |
| Globe, world map, image slider, lens, compare, ASCII art, webcam pixel | `design-skill/ui/references/media-display.md` |
| Loaders, forms, modals, tooltips, file upload, gooey input | `design-skill/ui/references/loaders-utility.md` |
| Terminal, keyboard, code block, pixel, retro, dev aesthetic | `design-skill/ui/references/dev-creative.md` |
| Full section combining multiple components, need a recipe | `design-skill/ui/references/recipes.md` |

### Design Style Skills
Load the full SKILL.md for the matched style.

| User wants | Load |
|---|---|
| SVG icons, path drawing, stroke animation, shape morphing, animated logo, visual storytelling with SVG | `design-skill/svg-animations/SKILL.md` |
| Editorial, calm, clean, Notion/Linear feel, warm monochrome, no heavy animation | `design-skill/minimalist-skill/SKILL.md` |
| Raw, industrial, mechanical, gritty, data-heavy, blueprint, CRT terminal, out-of-the-box | `design-skill/brutalist-skill/SKILL.md` |
| Premium SaaS, dashboard, polished modern product, motion-rich, spring physics — or no clear signal | `design-skill/taste-skill/SKILL.md` |

### Vibe Reference — Style Matching Guide

Use this to match the user's vibe, app type, or adjectives to the right style skill. These are not rigid keywords — read the full intent.

**taste-skill** → the confident default for anything modern and polished
- Apps: SaaS products, startup landing pages, B2B tools, fintech, productivity apps, developer tools
- Vibes: premium, polished, high-end, modern, sleek, confident, motion-rich, alive, Vercel-like, Linear-like, Stripe-like, Framer-like
- Energy: controlled motion, spring physics, bento grids, asymmetric layouts, alive without being chaotic

**minimalist-skill** → when less is the whole point
- Apps: note-taking tools, writing apps, documentation sites, blogs, personal sites, calm B2B, legal/finance tools, design tools
- Vibes: minimal, clean, quiet, editorial, calm, focused, document-like, Notion, Linear, Craft, Readwise, monochrome, typographic, no noise, breathing room, understated luxury
- Energy: invisible motion, serif headings, 1px borders, warm off-white, motion that never distracts

**brutalist-skill** → when conventional is the enemy
- Apps: portfolios, creative agencies, art projects, music/culture sites, experimental tools, security/hacker products, zines, manifestos
- Vibes: brutalist, raw, bold, industrial, mechanical, grid-heavy, Swiss design, blueprint, declassified, military, terminal, hacker, punk, no-nonsense, confrontational, retro-tech, out-of-the-box, unconventional, anti-design
- Energy: massive uppercase type, visible structure, no border-radius, monospace data, CRT scanlines, halftone effects, aviation red accent

## Combination Rule

One style skill max per task. But style + ui component reference is always valid:

> Example: User wants a brutalist page with a keyboard component → load `brutalist-skill/SKILL.md` AND `ui/references/dev-creative.md`

> Example: User wants an editorial landing page with a marquee → load `minimalist-skill/SKILL.md` AND `ui/references/scroll-animation.md`

## Default

No clear signal → `design-skill/taste-skill/SKILL.md`
