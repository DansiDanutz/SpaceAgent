---
name: Web Dashboard
description: Building high-performance, dark-mode dashboards with Tailwind CSS and modern web tech
metadata:
  when:
    tags:
      - dashboard
      - html
      - css
      - tailwind
      - ui
      - frontend
      - widget
  loaded: true
  placement: system
---

## Purpose

This skill guides the agent when building or editing web dashboards, Space Agent widgets, and UI components for Dansi's projects.

## Design Principles

1. **Dark Mode First**: All new UI should default to dark themes with deep slate/zinc backgrounds (`#0f172a`, `#1e293b`) and high-contrast text (`#f8fafc`). Light mode is optional.
2. **Responsive**: Use `clamp()`, `min()`, `max()`, and CSS Grid/Flexbox. Avoid fixed pixel widths for layout containers.
3. **Performance**: Minimize DOM nodes, prefer CSS transforms over layout properties for animations, and lazy-load heavy content.
4. **Accessibility**: Maintain WCAG 2.1 AA contrast ratios. Use semantic HTML. Add `aria-label` where icons act as buttons.

## Tech Stack

- **CSS**: Tailwind CSS v3+ or vanilla CSS with custom properties
- **Components**: shadcn/ui patterns when React is available
- **Charts**: Chart.js or ApexCharts for simplicity; D3 only for custom visualizations
- **Fonts**: Inter or system-ui stack
- **Icons**: Lucide or inline SVG; avoid heavy icon font libraries

## Widget Guidelines (Space Agent)

- Widgets are YAML files with a `renderer` field containing an `async (parent) => { ... }` function.
- Keep widget HTML self-contained: inline `<style>` scoped to a unique class prefix (e.g., `.hn-root`).
- Use `fetch()` for external APIs. Do not use third-party CORS proxies; use Space Agent's runtime-managed fetch or server-side proxy.
- Persist widget state in `localStorage` if needed, using a prefixed key like `widget-<widget-id>-<setting>`.
- Handle errors gracefully: show a fallback message instead of breaking the whole widget.

## Common Patterns

### Card Grid
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: 1rem;
}
```

### Glassmorphism Header
```css
.header {
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
```

### Scrollable List
```css
.list {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #334155 transparent;
}
```

## Anti-Patterns
- Do not use inline `style="..."` attributes in widget HTML; use scoped CSS classes.
- Do not load external CSS files in widgets; keep styles self-contained.
- Do not assume a specific screen size; test from 320px to 4K.
