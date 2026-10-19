<div align="center">

<img src="assets/readme/hero.gif" alt="Supply Chain Industry Report / 供应链行业报告 — 2026 year to date, China lens, September LPI 51.5 percent, September GSCPI 1.28, and the capability radar" width="100%">

# Supply Chain Industry Report
# 供应链行业报告

**EN:** A bilingual interactive supply-chain report. The default reading is 2026 year to date (January–September); quarter and half-year are other cuts of the same series.

**中文：**双语交互式供应链行业报告。默认阅读 2026 年年初至今（1–9 月）；季度和半年是同一序列的其他切法。

<p>
  <a href="#english">English</a> · <a href="#中文">中文</a>
  ·
  <a href="assets/readme/preview.html">Open animated preview / 打开动效预览</a>
</p>

<p>
  <img alt="Coverage 2025Q3–2026Q3" src="https://img.shields.io/badge/coverage-2025Q3%E2%80%932026Q3-2563eb?style=flat-square">
  <img alt="Periods: year to date, quarter, and half-year" src="https://img.shields.io/badge/periods-YTD%20%7C%20quarter%20%7C%20half--year-0f766e?style=flat-square">
  <img alt="Languages: Chinese and English" src="https://img.shields.io/badge/languages-%E4%B8%AD%E6%96%87%20%7C%20EN-334155?style=flat-square">
  <img alt="Views: China and Global" src="https://img.shields.io/badge/views-China%20%7C%20Global-ea580c?style=flat-square">
  <img alt="License: MIT and CC BY 4.0" src="https://img.shields.io/badge/license-MIT%20%2B%20CC--BY--4.0-0f172a?style=flat-square">
</p>

</div>

---

<a id="english"></a>

# English

## Features at a Glance

The interactive edition is the main deliverable. Three controls change the reading; the page is six plates.

<img src="assets/readme/controls.svg" alt="Three interactive controls: language ZH/EN, market China/Global, and period" width="100%">

<img src="assets/readme/narrative.svg" alt="Six plates in the interactive report: readings, judgment, monthly path, moves, capability structure, sources" width="100%">

<img src="assets/readme/formats.svg" alt="Four edition formats: Interactive, Full written, One-pager, Briefing deck" width="100%">

<img src="assets/readme/segments.svg" alt="Five industry segments with China vs Global radar comparison" width="100%">

<img src="assets/readme/dual-lens.svg" alt="China solid blue and Global dashed amber radar legend" width="100%">

## Read the Report

Current edition: **2026 year to date** (January–September). 2026Q3 is one segment of that year, not the whole story. 2026 H2 in the half-year control is July–September only.

| Edition | File | Best for |
|---|---|---|
| **Interactive** (中文 / EN) | [`reports/2026H1/report.html`](reports/2026H1/report.html) | The report itself. Open in a browser; language, lens, and period switch live. Source: [`report.canvas.tsx`](reports/2026H1/report.canvas.tsx) |
| **Full written** (中文) | [`reports/2026H1/report.zh.md`](reports/2026H1/report.zh.md) | Reading end to end, quoting, reviewing |
| **One-pager** (中文) | [`reports/2026H1/one-pager.zh.md`](reports/2026H1/one-pager.zh.md) | Forwarding the conclusion to an executive |
| **Briefing deck** (中文) | [`reports/2026H1/slides.zh.html`](reports/2026H1/slides.zh.html) | Presenting — self-contained HTML, no build step |

```bash
open reports/2026H1/report.html
```

Edition index: [`reports/2026H1/`](reports/2026H1/)

## What This Is

A recurring **decision-support** industry report, not a one-off write-up.

The interactive page answers, in order: what the readings are, what they mean, how the months moved, what to do, how China and Global capability differ, and where the figures come from.

| | |
|---|---|
| **Scope** | Global supply chain conditions with a dedicated China lens |
| **Periods** | 2026 year to date (Jan–Sep), quarterly (`2025Q3` → `2026Q3`), and half-year (`2025H2`, `2026H1`, `2026H2` through September) |
| **Modes** | Chinese / English · China market / Global market |
| **Indicators in this edition** | China LPI and NY Fed GSCPI (October 2026 vintage). Late-May SCFI and WCI were not refreshed through September, so they are not in the current cards |
| **Audience** | Strategy, operations leadership, procurement, market intelligence |

## Getting Started

```bash
# interactive report — open in any browser
open reports/2026H1/report.html

# same edition inside Cursor
cp reports/2026H1/report.canvas.tsx ~/.cursor/projects/<your-workspace>/canvases/
```

Cursor supplies the `cursor/canvas` types at runtime, so there is no dependency install.

## Data & Method Notes

- Built from public references: WTO trade outlooks, New York Fed **GSCPI**, Shanghai Shipping Exchange **SCFI**, Drewry **WCI**, and China Federation of Logistics & Purchasing **LPI** releases.
- China 2025 has no citable monthly LPI series in this edition. Those charts are a flat archive proxy (baseline = 100), not a recovery. Global 2025 uses official GSCPI.
- Positioning: a decision-support analysis product, not a statutory disclosure dataset. Re-verify figures before external publication.

## Repository Layout

```text
.
├── README.md
├── reports/2026H1/
├── assets/readme/
│   ├── hero.gif             # animated hero (GitHub playback)
│   ├── hero.svg             # editable static source / fallback
│   ├── hero-motion.json
│   ├── preview.html         # local animated preview page
│   ├── controls.svg         # language / lens / period
│   ├── narrative.svg        # six plates of the interactive report
│   ├── formats.svg          # four edition formats
│   ├── segments.svg         # five industry segments
│   ├── dual-lens.svg        # China / Global radar legend
│   └── made-with.svg        # README design credit badge
├── scripts/
├── CREDITS.md
├── LICENSE.md                 # dual-license overview
├── LICENSE-CODE-MIT
└── LICENSE-CONTENT-CC-BY-4.0
```

## Security

```bash
./scripts/security-scan.sh
./scripts/install-hooks.sh
./scripts/security-scan.sh --self-test
```

If a key is ever exposed, rotate it immediately — deleting it from a later commit does not remove it from history.

## Roadmap

- [ ] Per-period snapshots under `reports/2026Q1`, `reports/2026Q2`, …
- [ ] Standalone Semiconductor segment tab
- [ ] Period-over-period delta panels
- [ ] Chart exports sized for slide decks
- [ ] CI secret scanning on pull requests

## Credits

Tools and references used to build this project — full list in [`CREDITS.md`](CREDITS.md).

| | |
|---|---|
| **README design** | [beautify-github-readme](https://github.com/oil-oil/beautify-github-readme) by oil-oil (MIT) — visual system, hero direction, and motion workflow for `assets/readme/` |
| **Authoring runtime** | [Cursor](https://cursor.com) — Agent workflow and interactive Canvas (`cursor/canvas`) |
| **Research tooling** | AnySearch skill — used while gathering source material for early drafts |
| **Public indicators** | New York Fed GSCPI · WTO trade outlook · Shanghai Shipping Exchange SCFI · Drewry WCI · CFLP LPI |
| **Engineering** | ripgrep · FFmpeg · resvg · Pillow |

<p>
  <a href="https://github.com/oil-oil/beautify-github-readme">
    <img src="assets/readme/made-with.svg" alt="README visuals made with beautify-github-readme" />
  </a>
</p>

## License

This repository is **dual-licensed**. See [`LICENSE.md`](LICENSE.md) for the overview.

| Content | License | File |
|---|---|---|
| Code and scripts | **MIT** | [`LICENSE-CODE-MIT`](LICENSE-CODE-MIT) |
| Report content, documentation, and visuals | **CC BY 4.0** | [`LICENSE-CONTENT-CC-BY-4.0`](LICENSE-CONTENT-CC-BY-4.0) |

Copyright (c) 2026 SummerPapaya

When reusing the report content or visuals, attribute SummerPapaya and link to CC BY 4.0.

---

<a id="中文"></a>

# 中文

## 功能一览

交互版是这份报告的主体。三项控件改变阅读内容，页面分成六块。

<img src="assets/readme/controls.svg" alt="三项交互控件：语言、视角、时间" width="100%">

<img src="assets/readme/narrative.svg" alt="交互版六块：读数、判断、月度路径、要做的事、能力结构、来源" width="100%">

<img src="assets/readme/formats.svg" alt="四种呈现形式：交互版、完整文稿、一页摘要、简报幻灯片" width="100%">

<img src="assets/readme/segments.svg" alt="五个细分行业与中国 vs 全球雷达对比" width="100%">

<img src="assets/readme/dual-lens.svg" alt="中国蓝色实线与全球橙色虚线雷达图例" width="100%">

## 阅读报告

当前版本：**2026 年年初至今**（1–9 月）。三季度是这一年中的一段，不是整段故事。半年里的 2026 年下半年只收到 7–9 月。

| 版本 | 文件 | 适用场景 |
|---|---|---|
| **交互版**（中文 / EN） | [`reports/2026H1/report.html`](reports/2026H1/report.html) | 报告本身。浏览器直接打开，语言、视角和时间会一起切换。源文件：[`report.canvas.tsx`](reports/2026H1/report.canvas.tsx) |
| **完整文稿**（中文） | [`reports/2026H1/report.zh.md`](reports/2026H1/report.zh.md) | 通读、引用、审阅 |
| **一页摘要**（中文） | [`reports/2026H1/one-pager.zh.md`](reports/2026H1/one-pager.zh.md) | 向管理层快速传递结论 |
| **简报幻灯片**（中文） | [`reports/2026H1/slides.zh.html`](reports/2026H1/slides.zh.html) | 汇报演示 — 纯 HTML，无需构建 |

```bash
open reports/2026H1/report.html
```

版本目录：[`reports/2026H1/`](reports/2026H1/)

## 这是什么

这是一份可复用的**决策支持型**行业报告，而不是一次性文稿。

交互页按顺序回答：读数是什么、意味着什么、月份怎么走、要做什么、中外能力差在哪里、数字从哪来。

| | |
|---|---|
| **覆盖范围** | 全球供应链格局，并设中国市场专章视角 |
| **时间** | 2026 年年初至今（1–9 月）、季度（`2025Q3` → `2026Q3`）、半年度（`2025H2`、`2026H1`、`2026H2` 至 9 月） |
| **阅读模式** | 中文 / 英文 · 中国市场 / 全球市场 |
| **本版指标** | 中国 LPI，以及纽约联储 GSCPI（2026 年 10 月发布口径）。5 月末的 SCFI 与 WCI 没有刷新到 9 月，因此不在当前卡片里 |
| **主要读者** | 战略、运营管理、采购、市场情报团队 |

## 快速开始

```bash
# 交互报告 — 任意浏览器打开
open reports/2026H1/report.html

# 同一版放进 Cursor
cp reports/2026H1/report.canvas.tsx ~/.cursor/projects/<your-workspace>/canvases/
```

Cursor 运行时提供 `cursor/canvas` 类型，无需安装依赖。

## 数据与方法说明

- 基于公开资料：WTO 贸易展望、纽约联储 **GSCPI**、上海航运交易所 **SCFI**、Drewry **WCI**、中国物流与采购联合会 **LPI** 发布。
- 本版没有可引用的 2025 年中国月度 LPI。那些图是一条平的档案代理（基准 = 100），不是景气回升。全球 2025 年使用官方 GSCPI。
- 定位：决策支持分析产品，而非法定披露数据。对外发布前请复核数字。

## 仓库结构

```text
.
├── README.md
├── reports/2026H1/
├── assets/readme/
│   ├── hero.gif             # 动效头图（GitHub 可播放）
│   ├── hero.svg             # 可编辑静态源 / 回退
│   ├── hero-motion.json
│   ├── preview.html         # 本地动效预览页
│   ├── controls.svg         # 语言 / 视角 / 时间
│   ├── narrative.svg        # 交互版六块
│   ├── formats.svg          # 四种呈现形式
│   ├── segments.svg         # 五个细分行业
│   ├── dual-lens.svg        # 中国 / 全球雷达图例
│   └── made-with.svg        # README 设计致谢徽章
├── scripts/
├── CREDITS.md
├── LICENSE.md                 # 双重许可总览
├── LICENSE-CODE-MIT
└── LICENSE-CONTENT-CC-BY-4.0
```

## 安全

```bash
./scripts/security-scan.sh
./scripts/install-hooks.sh
./scripts/security-scan.sh --self-test
```

若密钥曾暴露，请立即轮换 — 从后续提交中删除并不能清除历史记录。

## 路线图

- [ ] 按期快照：`reports/2026Q1`、`reports/2026Q2` …
- [ ] 独立的半导体细分页签
- [ ] 期与期之间的变化面板
- [ ] 适配幻灯片尺寸的图表导出
- [ ] PR 上的 CI 密钥扫描

## 致谢

构建本项目所使用的工具与资料 — 完整列表见 [`CREDITS.md`](CREDITS.md)。

| | |
|---|---|
| **README 设计** | [beautify-github-readme](https://github.com/oil-oil/beautify-github-readme)（oil-oil，MIT）— 用于 `assets/readme/` 的视觉体系、头图方向与动效流程 |
| **创作运行时** | [Cursor](https://cursor.com) — Agent 工作流与交互 Canvas（`cursor/canvas`） |
| **检索工具** | AnySearch skill — 用于早期文稿的资料检索 |
| **公开指标** | 纽约联储 GSCPI · WTO 贸易展望 · 上海航运交易所 SCFI · Drewry WCI · 中物联 LPI |
| **工程工具** | ripgrep · FFmpeg · resvg · Pillow |

<p>
  <a href="https://github.com/oil-oil/beautify-github-readme">
    <img src="assets/readme/made-with.svg" alt="README 视觉由 beautify-github-readme 辅助完成" />
  </a>
</p>

## 许可

本仓库采用**双重许可**。总览见 [`LICENSE.md`](LICENSE.md)。

| 内容 | 许可 | 文件 |
|---|---|---|
| 代码与脚本 | **MIT** | [`LICENSE-CODE-MIT`](LICENSE-CODE-MIT) |
| 报告内容、文档与视觉资产 | **CC BY 4.0** | [`LICENSE-CONTENT-CC-BY-4.0`](LICENSE-CONTENT-CC-BY-4.0) |

Copyright (c) 2026 SummerPapaya

转载或改编报告内容与视觉资产时，请署名 SummerPapaya，并附上 CC BY 4.0 链接。
