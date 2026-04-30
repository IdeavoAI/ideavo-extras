# Recipes

**Category**: Full section-level component combos using Magic UI + Aceternity UI.
Use these when building complete page sections rather than a single component.

> **Reuse first.** Before installing or copy-pasting any component in a recipe, check if it already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). Only install/fetch what is actually missing. Only open docs when a component is absent or you're unsure about props/dependencies.

Each recipe lists:
- The goal/vibe of the section
- Which components to combine (with their reference file)
- Install order
- Guardrails specific to the combo

---

## Recipe 1: Dark Sci-Fi Hero

**Goal**: High-impact dark hero with cinematic depth and strong CTA.

**Stack**:
- Background: `backgrounds.md` → Background Beams or Lamp Effect (Aceternity)
- Heading: `text-effects.md` → blur-fade (Magic UI)
- CTA: `buttons-cta.md` → shiny-button (Magic UI)
- Accent: `backgrounds.md` → Spotlight (Aceternity)

**Install**:
```bash
npx shadcn@latest add @magicui/blur-fade @magicui/shiny-button
# + copy-paste Background Beams + Spotlight from ui.aceternity.com
```

**Guardrails**:
- Spotlight and Background Beams can coexist but keep Spotlight subtle (low opacity) so beams remain the hero.
- Use blur-fade with a stagger delay on headline + subheadline only — not the entire section.

---

## Recipe 2: Cosmic / Space Landing

**Goal**: Immersive space aesthetic with motion and premium CTA.

**Stack**:
- Background: `backgrounds.md` → Shooting Stars + Meteor Effect (Aceternity)
- Text: `text-effects.md` → sparkles-text (Magic UI) on headline keyword
- CTA: `buttons-cta.md` → shimmer-button (Magic UI)
- Supporting: `backgrounds.md` → Sparkles (Aceternity) around CTA

**Install**:
```bash
npx shadcn@latest add @magicui/sparkles-text @magicui/shimmer-button
# + copy-paste Shooting Stars + Meteor Effect + Sparkles from ui.aceternity.com
```

**Guardrails**:
- Shooting Stars + Meteor = 2 background animations — cap it here, do not add more.
- sparkles-text should only wrap 1-2 words in the headline, not the full string.

---

## Recipe 3: Hacker / Cyberpunk Section

**Goal**: Dark, technical, encrypted aesthetic — for developer tools or security products.

**Stack**:
- Card: `cards.md` → Evervault Card (Aceternity)
- Text: `text-effects.md` → Encrypted Text (Aceternity)
- Component: `dev-creative.md` → Terminal (Aceternity)
- Background: `backgrounds.md` → Grid and Dot Backgrounds (Aceternity)

**Install**: Copy-paste all from ui.aceternity.com — no Magic UI CLI needed.

**Guardrails**:
- Evervault Card + Encrypted Text are both scramble-reveal effects — use one per visible area, not both in the same viewport.
- Terminal should show real or realistic-looking commands, not lorem ipsum.

---

## Recipe 4: Premium Product Showcase

**Goal**: Premium, cinematic product reveal with depth and polish.

**Stack**:
- Scroll: `scroll-animation.md` → Macbook Scroll (Aceternity)
- Card: `cards.md` → Glare Card (Aceternity)
- Text: `text-effects.md` → blur-fade (Magic UI)
- CTA: `buttons-cta.md` → rainbow-button (Magic UI)

**Install**:
```bash
npx shadcn@latest add @magicui/blur-fade @magicui/rainbow-button
# + copy-paste Macbook Scroll + Glare Card from ui.aceternity.com
```

**Guardrails**:
- Macbook Scroll is the hero — place it first, above the Glare Cards.
- Glare Card works best on a neutral/dark background — avoid busy backgrounds behind it.

---

## Recipe 5: Editorial Feature Grid

**Goal**: Clean, readable feature section with selective animation emphasis.

**Stack**:
- Grid: `cards.md` → bento-grid (Magic UI) or Bento Grid (Aceternity)
- Text: `text-effects.md` → Hero Highlight (Aceternity) on section heading
- Scroll: `scroll-animation.md` → Sticky Scroll Reveal (Aceternity) for feature details

**Install**:
```bash
npx shadcn@latest add @magicui/bento-grid
# + copy-paste Hero Highlight + Sticky Scroll Reveal from ui.aceternity.com
```

**Guardrails**:
- Animate only 1-2 bento cards — avoid every cell having simultaneous motion.
- Sticky Scroll Reveal needs enough content depth to justify the sticky behavior (min 3 items).

---

## Recipe 6: Social Proof Rail

**Goal**: Show testimonials and logos in motion without static blocks.

**Stack**:
- Marquee: `scroll-animation.md` → marquee (Magic UI) — for logos
- Testimonials: `scroll-animation.md` → Infinite Moving Cards or Animated Testimonials (Aceternity)
- Avatars: `cards.md` → avatar-circles (Magic UI) — for reviewer cluster

**Install**:
```bash
npx shadcn@latest add @magicui/marquee @magicui/avatar-circles
# + copy-paste Infinite Moving Cards or Animated Testimonials from ui.aceternity.com
```

**Guardrails**:
- marquee (logos) and Infinite Moving Cards (testimonials) should be in separate rows — not stacked.
- All auto-scrolling must pause on hover and focus.
- Keep testimonial text short — moving rails are not suitable for long paragraphs.

---

## Recipe 7: Developer Portfolio

**Goal**: Technical, narrative, developer-aesthetic single-page portfolio.

**Stack**:
- Nav: `navigation.md` → Floating Dock (Aceternity)
- Scroll: `scroll-animation.md` → Tracing Beam (Aceternity)
- Code: `dev-creative.md` → Code Block (Aceternity)
- Background: `backgrounds.md` → retro-grid (Magic UI) on hero
- Text: `text-effects.md` → typing-animation (Magic UI) on intro headline

**Install**:
```bash
npx shadcn@latest add @magicui/retro-grid @magicui/typing-animation
# + copy-paste Floating Dock + Tracing Beam + Code Block from ui.aceternity.com
```

**Guardrails**:
- Tracing Beam requires sufficient scroll depth — works best on long single-page layouts.
- typing-animation is the hero text effect — don't combine with other text animations on the same heading.

---

## Recipe 8: Ambient Minimal

**Goal**: Clean, breathing, minimal landing page — no heavy motion, tasteful ambient texture.

**Stack**:
- Background: `backgrounds.md` → dot-pattern (Magic UI)
- Text: `text-effects.md` → blur-fade (Magic UI)
- CTA: `buttons-cta.md` → shimmer-button (Magic UI)
- Supporting: `backgrounds.md` → Background Gradient (Aceternity) as subtle section divider

**Install**:
```bash
npx shadcn@latest add @magicui/dot-pattern @magicui/blur-fade @magicui/shimmer-button
# + copy-paste Background Gradient from ui.aceternity.com
```

**Guardrails**:
- This recipe should feel calm — if you find yourself adding more effects, stop.
- dot-pattern at low opacity only — it is a texture, not a statement.
- blur-fade stagger should be slow (0.3-0.5s delay between elements).

---

## Final Validation Checklist (All Recipes)

- [ ] Mobile layout works — no horizontal overflow, no broken animations
- [ ] Keyboard navigation reaches all interactive elements
- [ ] Auto-scrolling content pauses on hover/focus
- [ ] Text remains readable over animated backgrounds (WCAG AA contrast)
- [ ] `prefers-reduced-motion` is respected by all animation components
- [ ] No more than 2 high-motion effects active in the same viewport
- [ ] All components compile with the project's path alias setup
