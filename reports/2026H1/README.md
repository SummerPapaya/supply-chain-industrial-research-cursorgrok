# 2026H1 — Supply Chain Industry Report

**Coverage:** `2026YTD` (Jan–Sep, Q1–Q3 together) · `2025Q3 → 2026Q3` (quarterly) · `2025H2 → 2026H2 through September` (half-year; 2026 H2 is partial)

Four renderings of the same edition. Pick the one that fits the audience.

**Browser preview:** open [`report.html`](report.html) for a rendered interactive HTML page (no build step).

| File | Format | Language | What it is |
|---|---|---|---|
| [`report.html`](report.html) | Interactive HTML (browser) | 中文 / EN | Browser-rendered report with the same language, market, and period controls |
| [`report.canvas.tsx`](report.canvas.tsx) | Interactive (Cursor canvas) | 中文 / EN | The full report, with language, market-view, and period switching |
| [`report.zh.md`](report.zh.md) | Markdown | 中文 | Full written report, structured for sharing |
| [`one-pager.zh.md`](one-pager.zh.md) | Markdown | 中文 | One-page executive summary — conclusions first, five key numbers |
| [`slides.zh.html`](slides.zh.html) | HTML deck, 14 slides | 中文 | Briefing deck; opens in any browser, no build step |

`report.canvas.tsx` is the interactive source of truth. `report.html` is a browser-ready conversion with the same controls and content for local review. The Markdown exports lead with the 2026Q3 decision window and keep the 2026H1 write-up behind it. `slides.zh.html` opens on the Q3 numbers; the later slides remain the first-half briefing.

## Review in a browser

```bash
open reports/2026H1/report.html
```

No build step or network access is required.

## Running the Cursor canvas edition

Cursor only detects canvases inside its managed per-workspace directory, so the file has to be copied there rather than opened in place:

```bash
cp reports/2026H1/report.canvas.tsx \
   ~/.cursor/projects/<your-workspace>/canvases/
```

Then open it from that directory to get the live Canvas view. Use `~/.cursor/projects/` to find your workspace name.

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

Built from public sources. GSCPI is the New York Fed October 2026 vintage: history is revised at every release, and August 2026 was revised from 1.06 to 1.20. China LPI for July–September 2026 uses the public CFLP releases; June 2026 is implied by the official July month-on-month change. China 2025 has no citable monthly series in this edition, so those charts are a flat baseline-100 placeholder, not a trend. Late-May SCFI and WCI were not refreshed through September and are not in the Q3 cards.