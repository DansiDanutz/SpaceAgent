# Rolling Notes

## 2026-04-28 — Space Agent Enhancement Session
- Space Agent v0.64.0 installed and configured with z.ai API (glm-5.1).
- Desktop shortcut created at `C:\Users\dansi\Desktop\Space Agent.lnk`.
- Daily News space created with 5 news widgets.
- Memory system initialized with behavior, tech-stack, and rolling notes files.
- Custom skills created: azure-workflow, web-dashboard, space-optimizer.

## Daily News Widgets — Full Feature Set
All 5 widgets share the same UX pattern:
- **Minimize/Maximize**: ➖ collapses to mini card (icon + name + count), click mini card to expand
- **Resize buttons**: S (6×5), M (8×7), L (12×10), XL (16×14) — working via currentSpace.renderWidget()
- **Refresh button**: clears cache, refetches, spinning animation
- **Last updated timestamp**: shows refresh time
- **Pagination**: 10 items per page, Prev/Next buttons, no scrolling
- **Bilingual summaries**: click any item → 🇬🇧 English + 🇷🇴 Română translation
- **Responsive CSS**: clamp() on all sizes, auto-fit grid for summaries

Widgets:
1. github-ai-trending — 4 topic filters (Agents, Tools, Design, Architecture), top 20 per filter
2. hackernews-top — Firebase API, cached 5 min
3. dev-to-ai — Dev.to API tag=ai, cached 5 min
4. arxiv-ai — arXiv cs.AI RSS, cached 5 min
5. producthunt-trending — PH RSS/GraphQL (fallback placeholder data if CORS blocked)

## Space Zoom Controls
- Fixed-position bar in bottom-right corner (z-index 9999)
- ➖ Zoom out (25%–90%), ➕ Zoom in (110%–200%), ⊞ Fit, ↺ Reset (100%)
- Applies CSS transform:scale() to .router-stage-inner
- Zoom preference saved in localStorage

## Layout
- Grid: 24×30 (0,0 top-left)
- github-ai-trending: (0,0) 12×10
- arxiv-ai: (0,10) 12×10
- hackernews-top: (0,20) 6×10
- dev-to-ai: (8,20) 6×10
- producthunt-trending: (16,20) 6×10

## Active Context
- Working on superpowering Space Agent with modules, skills, and widgets.
- Keep Azure cost optimization as a recurring theme.
- Keep an eye on Space Agent updates; auto-updater is enabled.
