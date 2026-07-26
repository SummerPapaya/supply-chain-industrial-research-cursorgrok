# Credits / 致谢

Copyright (c) 2026 SummerPapaya

This project was built with the following tools, platforms, and public references.
本项目在构建过程中使用了以下工具、平台与公开资料。

## README design / README 设计

| Tool | Role | License / link |
|---|---|---|
| **[beautify-github-readme](https://github.com/oil-oil/beautify-github-readme)** by [oil-oil](https://github.com/oil-oil) | README visual system, project-native hero direction, and GitHub-safe motion workflow used for `assets/readme/` | MIT |

Homepage visuals in this repository were designed following that skill’s SVG + Markdown layering approach. The animated hero (`assets/readme/hero.gif`) keeps an editable SVG source (`assets/readme/hero.svg`).

本仓库首页视觉参考该 Skill 的 SVG + Markdown 分层方法；动效头图保留可编辑 SVG 源文件。

## Authoring & runtime / 创作与运行时

| Tool | Role | Link |
|---|---|---|
| **[Cursor](https://cursor.com)** | IDE, Agent workflow, and interactive Canvas runtime (`cursor/canvas`) for `reports/**/report.canvas.tsx` | https://cursor.com |
| **AnySearch** skill | Web / vertical research retrieval used while drafting early report material | skill used locally during research |

## Data sources cited in the report / 报告引用的数据来源

These organizations publish the public indicators referenced in the analysis. Citation does not imply endorsement.

| Source | Indicator / material |
|---|---|
| Federal Reserve Bank of New York | Global Supply Chain Pressure Index (GSCPI) |
| World Trade Organization (WTO) | Global Trade Outlook and Statistics |
| Shanghai Shipping Exchange | Shanghai Containerized Freight Index (SCFI) |
| Drewry | World Container Index (WCI) |
| China Federation of Logistics & Purchasing (CFLP) | Logistics Prosperity Index (LPI) releases |

## Engineering utilities / 工程工具

| Tool | Role |
|---|---|
| [ripgrep](https://github.com/BurntSushi/ripgrep) | Secret-scanning patterns in `scripts/` |
| [FFmpeg](https://ffmpeg.org/) | Encoding the GitHub-safe animated hero GIF |
| [resvg](https://github.com/linebender/resvg) / `@resvg/resvg-js` | SVG rasterization for motion frames |
| [Pillow](https://python-pillow.org/) | Image handling during GIF production |

## License reminder

Project licensing is dual-licensed — see [`LICENSE.md`](LICENSE.md).

Third-party tools and data sources remain under their own terms.
