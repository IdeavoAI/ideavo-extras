# Navigation

**Category**: Navbars, sidebars, floating docks, tabs, custom pointers, banners.
Use these as primary navigation and layout orientation components.

> **Reuse first.** Before installing or copy-pasting, check if the component already exists in the project (`components/ui/` for Magic UI, anywhere in `components/` for Aceternity). If found, import and reuse it. Only fetch docs when the component is absent or you're unsure about props/dependencies.

---

## Magic UI

Magic UI does not include dedicated navigation components — use shadcn/ui for base nav patterns, then layer Magic UI effects on top where needed.

---

## Aceternity UI

### Floating Dock
- **Library**: Aceternity UI
- **Vibe**: macOS-inspired, playful, icon-dock, minimal
- **Use-case**: macOS Dock-style floating nav with icon magnification on hover
- **Install**: Copy-paste from https://ui.aceternity.com/components/floating-dock
- **Docs**: https://ui.aceternity.com/components/floating-dock

### Floating Navbar
- **Library**: Aceternity UI
- **Vibe**: modern, clean, scroll-aware, compact
- **Use-case**: Navbar that hides on scroll-down, reveals on scroll-up — saves screen space
- **Install**: Copy-paste from https://ui.aceternity.com/components/floating-navbar
- **Docs**: https://ui.aceternity.com/components/floating-navbar

### Resizable Navbar
- **Library**: Aceternity UI
- **Vibe**: adaptive, modern, scroll-reactive, elegant
- **Use-case**: Navbar that changes width/size as user scrolls — transitions from full to compact
- **Install**: Copy-paste from https://ui.aceternity.com/components/resizable-navbar
- **Docs**: https://ui.aceternity.com/components/resizable-navbar

### Navbar Menu
- **Library**: Aceternity UI
- **Vibe**: sleek, elegant, dropdown, animated
- **Use-case**: Navbar with animated children/dropdown items on hover — polished nav menus
- **Install**: Copy-paste from https://ui.aceternity.com/components/navbar-menu
- **Docs**: https://ui.aceternity.com/components/navbar-menu

### Sidebar
- **Library**: Aceternity UI
- **Vibe**: functional, clean, expand-on-hover, responsive
- **Use-case**: Sidebar that expands on hover and collapses on mobile — dashboard layouts
- **Install**: Copy-paste from https://ui.aceternity.com/components/sidebar
- **Docs**: https://ui.aceternity.com/components/sidebar

### Animated Tabs
- **Library**: Aceternity UI
- **Vibe**: clean, smooth, minimal, switching
- **Use-case**: Tab component with smooth animated content switching — feature tabs, dashboards
- **Install**: Copy-paste from https://ui.aceternity.com/components/tabs
- **Docs**: https://ui.aceternity.com/components/tabs

### Sticky Banner
- **Library**: Aceternity UI
- **Vibe**: minimal, announcement, utility, top-bar
- **Use-case**: Banner that sticks to the top of the page, hides on scroll — announcements, promotions
- **Install**: Copy-paste from https://ui.aceternity.com/components/sticky-banner
- **Docs**: https://ui.aceternity.com/components/sticky-banner

### Following Pointer
- **Library**: Aceternity UI
- **Vibe**: interactive, immersive, custom-cursor, playful
- **Use-case**: Custom cursor element that follows the mouse — adds personality and interactivity
- **Install**: Copy-paste from https://ui.aceternity.com/components/following-pointer
- **Docs**: https://ui.aceternity.com/components/following-pointer

---

## Guardrails

- Floating Dock is best for portfolios or creative tools — may feel too playful for enterprise products.
- Use only one scroll-reactive navbar per page (Floating Navbar or Resizable Navbar — not both).
- Following Pointer is a creative enhancement — disable it on mobile where there is no cursor.
- Sidebar expand-on-hover pattern requires sufficient desktop width — collapse to a drawer on mobile.
- Ensure all nav elements are keyboard-accessible (focus states, tab order).
