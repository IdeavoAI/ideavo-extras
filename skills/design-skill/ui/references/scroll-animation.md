# Scroll & Animation

**Category**: Scroll-driven motion, parallax, marquees, timelines, social proof rails.
Use these to create narrative flow and reveal content as the user scrolls.

> **Reuse first.** Before installing or copy-pasting, check if the component already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). If found, import and reuse it. Only fetch docs when the component is absent or you're unsure about props/dependencies.

---

## Magic UI

### marquee
- **Library**: Magic UI
- **Vibe**: social-proof, infinite, smooth, logo-rail
- **Use-case**: Infinite horizontal scroll marquee — logo rails, testimonial strips, partner badges
- **Install**:
  ```bash
  npx shadcn@latest add @magicui/marquee
  ```
- **Docs**: https://magicui.design/docs/components/marquee

---

## Aceternity UI

### Animated Testimonials
- **Library**: Aceternity UI
- **Vibe**: elegant, minimal, social-proof, clean
- **Use-case**: Minimal testimonial component with avatar, quote, and smooth transitions
- **Install**: Copy-paste from https://ui.aceternity.com/components/animated-testimonials
- **Docs**: https://ui.aceternity.com/components/animated-testimonials

### Container Scroll Animation
- **Library**: Aceternity UI
- **Vibe**: dramatic, cinematic, 3D, scroll-reveal
- **Use-case**: 3D rotation effect triggered on scroll — reveal product/app screenshots dramatically
- **Install**: Copy-paste from https://ui.aceternity.com/components/container-scroll-animation
- **Docs**: https://ui.aceternity.com/components/container-scroll-animation

### Hero Parallax
- **Library**: Aceternity UI
- **Vibe**: rich, immersive, layered, scroll-driven
- **Use-case**: Multiple image layers with rotation, translation, and opacity on scroll — immersive hero
- **Install**: Copy-paste from https://ui.aceternity.com/components/hero-parallax
- **Docs**: https://ui.aceternity.com/components/hero-parallax

### Infinite Moving Cards
- **Library**: Aceternity UI
- **Vibe**: energy, looping, testimonial, social-proof
- **Use-case**: Cards moving infinitely in a loop — testimonials, feature highlights
- **Install**: Copy-paste from https://ui.aceternity.com/components/infinite-moving-cards
- **Docs**: https://ui.aceternity.com/components/infinite-moving-cards

### Macbook Scroll
- **Library**: Aceternity UI
- **Vibe**: premium, cinematic, product-reveal, Apple-like
- **Use-case**: Image/screenshot emerges from a Macbook screen on scroll (Fey.com style) — product showcase
- **Install**: Copy-paste from https://ui.aceternity.com/components/macbook-scroll
- **Docs**: https://ui.aceternity.com/components/macbook-scroll

### Parallax Grid Scroll
- **Library**: Aceternity UI
- **Vibe**: dynamic, editorial, two-column, motion
- **Use-case**: Two columns of images scrolling in opposite directions — editorial/portfolio sections
- **Install**: Copy-paste from https://ui.aceternity.com/components/parallax-grid-scroll
- **Docs**: https://ui.aceternity.com/components/parallax-grid-scroll

### Parallax Hero Images
- **Library**: Aceternity UI
- **Vibe**: depth, immersive, mouse-driven, layered
- **Use-case**: Mouse-driven parallax with depth blur (Sentry-style) — adds 3D depth to hero images
- **Install**: Copy-paste from https://ui.aceternity.com/components/parallax-hero-images
- **Docs**: https://ui.aceternity.com/components/parallax-hero-images

### Sticky Scroll Reveal
- **Library**: Aceternity UI
- **Vibe**: editorial, narrative, clean, step-by-step
- **Use-case**: Text/content reveals as user scrolls — sticky heading with scrolling content pane
- **Install**: Copy-paste from https://ui.aceternity.com/components/sticky-scroll-reveal
- **Docs**: https://ui.aceternity.com/components/sticky-scroll-reveal

### Timeline
- **Library**: Aceternity UI
- **Vibe**: editorial, narrative, structured, scroll-beam
- **Use-case**: Vertical timeline with sticky headers and animated scroll beam — roadmaps, history
- **Install**: Copy-paste from https://ui.aceternity.com/components/timeline
- **Docs**: https://ui.aceternity.com/components/timeline

### Tracing Beam
- **Library**: Aceternity UI
- **Vibe**: narrative, guided, scroll-follow, editorial
- **Use-case**: A beam/line that follows the SVG path as the user scrolls — guides reading flow
- **Install**: Copy-paste from https://ui.aceternity.com/components/tracing-beam
- **Docs**: https://ui.aceternity.com/components/tracing-beam

---

## Guardrails

- Auto-scrolling content (marquee, Infinite Moving Cards) must pause on hover and focus for usability.
- Avoid stacking more than 2 scroll-driven effects on the same page — they compete for attention.
- Macbook Scroll and Container Scroll Animation are heavy — test performance on mobile.
- Parallax effects should degrade gracefully at reduced-motion preference.
- Tracing Beam works best with long-form content pages (docs, about, case studies).
