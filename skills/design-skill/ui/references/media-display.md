# Media & Display

**Category**: Globes, maps, image viewers, sliders, comparators, canvas-based media.
Use these to display rich visual content — geographic data, product images, interactive media.

> **Reuse first.** Before installing or copy-pasting, check if the component already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). If found, import and reuse it. Only fetch docs when the component is absent or you're unsure about props/dependencies.

---

## Magic UI

### globe
- **Library**: Magic UI
- **Vibe**: global, data-viz, interactive, 3D
- **Use-case**: Interactive 3D globe with configurable markers and tooltips — global reach, data visualization
- **Install**:
  ```bash
  npx shadcn@latest add @magicui/globe
  ```
- **Docs**: https://magicui.design/docs/components/globe

---

## Aceternity UI

### 3D Globe
- **Library**: Aceternity UI
- **Vibe**: realistic, global, tooltip-rich, 3D
- **Use-case**: Realistic 3D globe with tooltips and avatar-style markers — global presence, team maps
- **Install**: Copy-paste from https://ui.aceternity.com/components/globe
- **Docs**: https://ui.aceternity.com/components/globe

### GitHub Globe
- **Library**: Aceternity UI
- **Vibe**: clean, developer, GitHub-style, data-viz
- **Use-case**: Interactive globe animation styled after GitHub's homepage — developer/open-source products
- **Install**: Copy-paste from https://ui.aceternity.com/components/github-globe
- **Docs**: https://ui.aceternity.com/components/github-globe

### World Map
- **Library**: Aceternity UI
- **Vibe**: clean, informational, animated-lines, flat
- **Use-case**: SVG world map with animated arc lines and dots — show connections, routes, global coverage
- **Install**: Copy-paste from https://ui.aceternity.com/components/world-map
- **Docs**: https://ui.aceternity.com/components/world-map

### Images Slider
- **Library**: Aceternity UI
- **Vibe**: cinematic, immersive, fullscreen, keyboard-nav
- **Use-case**: Full-page image slider with keyboard navigation — portfolio, showcase, case studies
- **Install**: Copy-paste from https://ui.aceternity.com/components/images-slider
- **Docs**: https://ui.aceternity.com/components/images-slider

### Lens
- **Library**: Aceternity UI
- **Vibe**: elegant, detail-focused, magnify, product
- **Use-case**: Zoom/magnify lens effect over images or videos — product detail views
- **Install**: Copy-paste from https://ui.aceternity.com/components/lens
- **Docs**: https://ui.aceternity.com/components/lens

### Compare
- **Library**: Aceternity UI
- **Vibe**: interactive, utility, before-after, slider
- **Use-case**: Drag/slide to compare two images side-by-side — before/after, design comparisons
- **Install**: Copy-paste from https://ui.aceternity.com/components/compare
- **Docs**: https://ui.aceternity.com/components/compare

### Images Badge
- **Library**: Aceternity UI
- **Vibe**: playful, social, stacked, hover-reveal
- **Use-case**: Hover to reveal stacked images in a badge/cluster format — team avatars, social proof
- **Install**: Copy-paste from https://ui.aceternity.com/components/images-badge
- **Docs**: https://ui.aceternity.com/components/images-badge

### ASCII Art
- **Library**: Aceternity UI
- **Vibe**: retro, techy, artistic, character-based
- **Use-case**: Convert images to ASCII art with customizable character sets — retro/hacker aesthetic
- **Install**: Copy-paste from https://ui.aceternity.com/components/ascii-art
- **Docs**: https://ui.aceternity.com/components/ascii-art

### Pixelated Canvas
- **Library**: Aceternity UI
- **Vibe**: retro, pixel, interactive, distortion
- **Use-case**: Image with mouse-driven pixel distortion effect — retro interactive art
- **Install**: Copy-paste from https://ui.aceternity.com/components/pixelated-canvas
- **Docs**: https://ui.aceternity.com/components/pixelated-canvas

### Webcam Pixel Grid
- **Library**: Aceternity UI
- **Vibe**: retro, creative, real-time, pixel-art
- **Use-case**: Real-time webcam feed rendered as a pixel grid — creative/art applications
- **Install**: Copy-paste from https://ui.aceternity.com/components/webcam-pixel-grid
- **Docs**: https://ui.aceternity.com/components/webcam-pixel-grid

---

## Guardrails

- Globes (Three.js) are heavy — lazy load and avoid placing multiple on one page.
- Images Slider should have keyboard navigation and accessible alt text on all slides.
- Compare slider must have a fallback static image on mobile if drag interaction is unreliable.
- Webcam Pixel Grid requires camera permission — always show a clear permission prompt.
- ASCII Art and Pixelated Canvas are creative accent pieces — use for personality, not primary content.
