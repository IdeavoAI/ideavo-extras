# Developer & Creative

**Category**: Terminal, keyboard, code display, carousel, creative containers.
Use these for developer-facing products, portfolios, or when you need strong personality and retro/hacker aesthetic.

> **Reuse first.** Before installing or copy-pasting, check if the component already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). If found, import and reuse it. Only fetch docs when the component is absent or you're unsure about props/dependencies.

---

## Aceternity UI

### Terminal
- **Library**: Aceternity UI
- **Vibe**: hacker, developer, dark, monospace
- **Use-case**: Mac-style terminal component with bash syntax highlighting — developer tools, CLI product pages
- **Install**: Copy-paste from https://ui.aceternity.com/components/terminal
- **Docs**: https://ui.aceternity.com/components/terminal

### Keyboard
- **Library**: Aceternity UI
- **Vibe**: fun, Mac-inspired, tactile, mechanical
- **Use-case**: Mac-style keyboard with mechanical sound effects on key press — interactive product features, keyboard shortcuts pages
- **Install**: Copy-paste from https://ui.aceternity.com/components/keyboard
- **Docs**: https://ui.aceternity.com/components/keyboard

### Code Block
- **Library**: Aceternity UI
- **Vibe**: developer, clean, syntax-highlighted, utility
- **Use-case**: Configurable syntax-highlighted code block — docs, tutorials, API reference pages
- **Install**: Copy-paste from https://ui.aceternity.com/components/code-block
- **Docs**: https://ui.aceternity.com/components/code-block

### Cover
- **Library**: Aceternity UI
- **Vibe**: sci-fi, dramatic, space, beam-wrap
- **Use-case**: Wraps children with animated beams and space/spotlight effect — high-impact section containers
- **Install**: Copy-paste from https://ui.aceternity.com/components/cover
- **Docs**: https://ui.aceternity.com/components/cover

### Carousel
- **Library**: Aceternity UI
- **Vibe**: modern, interactive, smooth, micro-interactions
- **Use-case**: Customizable carousel with micro-interactions — image galleries, feature sliders
- **Install**: Copy-paste from https://ui.aceternity.com/components/carousel
- **Docs**: https://ui.aceternity.com/components/carousel

### 3D Marquee
- **Library**: Aceternity UI
- **Vibe**: immersive, cinematic, 3D, rotating-grid
- **Use-case**: 3D rotating image/card grid — testimonials, product screenshots, media showcase
- **Install**: Copy-paste from https://ui.aceternity.com/components/3d-marquee
- **Docs**: https://ui.aceternity.com/components/3d-marquee

---

## Magic UI

Magic UI does not include dedicated developer-aesthetic components. Use shadcn/ui for base code and pre elements, or use Aceternity components above.

---

## Guardrails

- Terminal component is a strong personality statement — reserve for developer tools, CLIs, or hacker-aesthetic sites.
- Keyboard component requires sound assets — ensure sounds are optional and respect OS mute settings.
- Code Block must have accessible color contrast in both light and dark themes for syntax highlighting.
- Cover (beam wrap) adds heavy visual weight — do not use alongside other beam or spotlight backgrounds.
- 3D Marquee is performance-intensive — lazy load and test on low-end devices.
- Carousel must support keyboard navigation (arrow keys) and swipe on touch devices.
