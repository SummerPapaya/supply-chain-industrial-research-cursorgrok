# 2026H1 — Supply Chain Industry Report

**Coverage:** `2025Q3 → 2026Q2` (quarterly windows) · `2025H2 → 2026H1` (half-year windows)

Four renderings of the same edition. Pick the one that fits the audience.

| File | Format | Language | What it is |
|---|---|---|---|
| [`report.canvas.tsx`](report.canvas.tsx) | Interactive (Cursor canvas) | 中文 / EN | The full report, with language, market-view, and period switching |
| [`report.zh.md`](report.zh.md) | Markdown | 中文 | Full written report, structured for sharing |
| [`one-pager.zh.md`](one-pager.zh.md) | Markdown | 中文 | One-page executive summary — conclusions first, five key numbers |
| [`slides.zh.html`](slides.zh.html) | HTML deck, 14 slides | 中文 | Briefing deck; opens in any browser, no build step |

The interactive edition is the source of truth — it carries both languages, both market views (China / Global), and every archived period. The static exports are snapshots of the 2026H1 Chinese view.

## Running the interactive edition

Cursor only detects canvases inside its managed per-workspace directory, so the file has to be copied there rather than opened in place:

```bash
cp reports/2026H1/report.canvas.tsx \
   ~/.cursor/projects/<your-workspace>/canvases/
```

Then open it from that directory to get the live view with the control panel. Use `~/.cursor/projects/` to find your workspace name.

`tsconfig.json` sits alongside the canvas so editors can type-check it while editing. The `cursor/canvas` import resolves inside Cursor and will show as unresolved anywhere else — that is expected.

## Structure of the report

1. Key metrics overview
2. Industry dynamics
3. Market performance
4. Hot topics
5. Trends and next-stage actions
6. Segment deep-dive and China-vs-Global radar comparison
7. Sources and method notes

Segments covered: consumer electronics, new energy vehicles, pharma and cold chain, FMCG and retail, industrial / high-tech manufacturing.

## Method notes

Built from public sources — WTO trade outlooks, the New York Fed GSCPI, Shanghai Shipping Exchange SCFI, Drewry WCI, and China Federation of Logistics & Purchasing LPI releases. Where a continuous monthly series is unavailable for an archived window, the report shows a clearly labelled trend-score proxy view (baseline = 100) rather than presenting a gap as data. Figures should be re-verified before external publication.
