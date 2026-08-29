---
name: design-skill
description: Design orchestrator. Routes to the right sub-skill based on what the user wants. Never designs directly — only navigates. Sub-skills: taste, minimalist, brutalist, neobrutalist, svg-animations, or specific ui component references.
---

# Design Orchestrator

Your only job: read the request, pick the right route below, load that file, and follow it fully. Do not design anything yourself. Do not blend routes.

---

## Step 1 — Read the Signal

Before routing, identify what the user actually wants:

| Signal type | Examples |
|---|---|
| **Explicit style name** | "neobrutalist", "minimalist", "brutalist", "clean", "premium" |
| **Vibe adjective** | "funky", "bold", "calm", "playful", "raw", "sleek", "editorial" |
| **App type** | "SaaS dashboard", "portfolio", "landing page", "e-commerce", "blog" |
| **Reference brand** | "like Gumroad", "like Notion", "like Stripe", "like Linear", "like Vercel" |
| **Component request** | "add a marquee", "animated button", "bento grid", "particles background" |
| **Vague improvement** | "make it look better", "spice it up", "make it feel alive", "more premium" |

---

## Step 2 — Pick a Style Skill

### Quick Vibe → Skill Map

Use this first. Match the user's energy to the right skill — don't over-think it.

| If the user says / wants... | Route to |
|---|---|
| Funky, playful, bold, pop-art, loud, eye-catching, Gumroad-like, indie creator | `neobrutalist-web-designer` |
| Raw, gritty, hacker, punk, CRT terminal, military, anti-design, experimental | `brutalist-skill` |
| Clean, calm, minimal, editorial, Notion-like, quiet, breathing room | `minimalist-skill` |
| Sleek, premium, polished, modern SaaS, motion-rich, Vercel/Stripe/Linear-like | `taste-skill` |
| Animated SVG, icon drawing, path animation, logo animation | `svg-animations` |
| No clear style signal, just "make it look good" | Think first — see "When There Is No Style Signal" below |

### Detailed Routing Table

| User wants | Load |
|---|---|
| SVG icons, path drawing, stroke animation, shape morphing, animated logo, visual storytelling with SVG | `design-skill/svg-animations/SKILL.md` |
| Editorial, calm, clean, Notion/Linear feel, warm monochrome, no heavy animation | `design-skill/minimalist-skill/SKILL.md` |
| Raw, industrial, mechanical, gritty, data-heavy, blueprint, CRT terminal, out-of-the-box | `design-skill/brutalist-skill/SKILL.md` |
| Neobrutalism, neubrutalism, funky, playful, hard shadows, bold borders, thick outlines, SaaS with personality, Gumroad-like, indie creator, pop-art energy | `design-skill/neobrutalist-web-designer/SKILL.md` |
| Premium SaaS, dashboard, polished modern product, motion-rich, spring physics — or no clear signal | `design-skill/taste-skill/SKILL.md` |

---

## Step 3 — Check for UI Components

> **Before building any UI component from scratch** — check the component library first.
> If a suitable component exists in Magic UI or Aceternity UI, always prefer it over writing custom code.

### Component Reference Map

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

---

## Vibe Reference — Deep Style Guide

Use this when the quick map above isn't enough. These are not rigid keywords — read the full intent.

**taste-skill** → the confident default for anything modern and polished
- Apps: SaaS products, startup landing pages, B2B tools, fintech, productivity apps, developer tools
- Vibes: premium, polished, high-end, modern, sleek, confident, motion-rich, alive, Vercel-like, Linear-like, Stripe-like, Framer-like
- Energy: controlled motion, spring physics, bento grids, asymmetric layouts, alive without being chaotic
- User says: "make it look good", "make it premium", "clean and modern", "professional"

**minimalist-skill** → when less is the whole point
- Apps: note-taking tools, writing apps, documentation sites, blogs, personal sites, calm B2B, legal/finance tools, design tools
- Vibes: minimal, clean, quiet, editorial, calm, focused, document-like, Notion, Linear, Craft, Readwise, monochrome, typographic, no noise, breathing room, understated luxury
- Energy: invisible motion, serif headings, 1px borders, warm off-white, motion that never distracts
- User says: "clean and simple", "Notion-like", "calm", "no clutter", "minimal"

**brutalist-skill** → when conventional is the enemy
- Apps: portfolios, creative agencies, art projects, music/culture sites, experimental tools, security/hacker products, zines, manifestos
- Vibes: brutalist, raw, bold, industrial, mechanical, grid-heavy, Swiss design, blueprint, declassified, military, terminal, hacker, punk, no-nonsense, confrontational, retro-tech, out-of-the-box, unconventional, anti-design
- Energy: massive uppercase type, visible structure, no border-radius, monospace data, CRT scanlines, halftone effects, aviation red accent
- User says: "hacker aesthetic", "CRT terminal", "military blueprint", "anti-design", "brutalist"

**neobrutalist-web-designer** → when brutalism meets modern SaaS — funky, bold, usable
- Apps: SaaS dashboards, e-commerce, indie creator platforms, startup landing pages, product tools, portfolios with personality
- Vibes: neobrutalism, neubrutalism, funky, playful, pop-art, bold, eye-catching, hard shadows, thick outlines, flat color, high contrast, Gumroad-like, Figma-meets-punk, structured chaos
- Energy: solid flat colors, 4px hard box-shadows, thick black borders, loud typography, no gradients, no soft corners — raw but completely usable
- User says: "funky", "playful but bold", "like Gumroad", "indie creator vibe", "pop-art", "make it stand out", "neobrutalism", "hard shadows"

**svg-animations** → when the asset itself is the design
- Use for: animated logos, icon sets, path-drawing effects, shape morphing, illustrated storytelling
- User says: "animate my logo", "draw the path", "SVG icon animation", "stroke animation"

---

## Combination Rule

One style skill max per task. But **style + ui component** is always valid — load both.

| Example request | Load |
|---|---|
| Neobrutalist landing page with a marquee | `design-skill/neobrutalist-web-designer/SKILL.md` + `design-skill/ui/references/scroll-animation.md` |
| Minimalist blog with animated text headings | `design-skill/minimalist-skill/SKILL.md` + `design-skill/ui/references/text-effects.md` |
| Brutalist portfolio with terminal component | `design-skill/brutalist-skill/SKILL.md` + `design-skill/ui/references/dev-creative.md` |
| Funky SaaS hero with particle background | `design-skill/neobrutalist-web-designer/SKILL.md` + `design-skill/ui/references/backgrounds.md` |
| Polished SaaS dashboard with bento grid cards | `design-skill/taste-skill/SKILL.md` + `design-skill/ui/references/cards.md` |

---

## When There Is No Style Signal

If the user gives only an app idea with no style, vibe, or brand reference (e.g. "build a todo app", "make a recipe tracker", "create a habit logger") — **do not immediately default to taste-skill**. Think first.

Ask yourself:
- What is the core feeling this app should create? (calm focus? bold energy? raw utility?)
- Who is likely using it? (productivity-focused? creative? developer?)
- What would make this specific app feel *designed with intent* rather than generic?

Then pick the style that best serves those answers using the vibe guide above. Commit to that choice — don't hedge or blend.

**Before building, announce your choice in one sentence.**

> *"Going minimalist for this — a todo app should feel calm and focused, not flashy."*
> *"Going neobrutalist for this recipe app — food deserves bold colors and personality."*
> *"Going taste-skill for this dashboard — data-heavy apps need polish and motion to feel alive."*

If after thinking there's still genuinely no clear direction → `design-skill/taste-skill/SKILL.md`
