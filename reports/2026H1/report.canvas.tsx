import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Grid,
  H1,
  H2,
  H3,
  LineChart,
  Link,
  Pill,
  Row,
  Select,
  Stack,
  Stat,
  Table,
  Text,
  useCanvasState,
  useHostTheme,
} from "cursor/canvas";

type Lang = "zh" | "en";
type Scope = "cn" | "global";
type WindowMode = "ytd" | "half" | "quarter";
type PeriodId = "2026YTD" | "2025H2" | "2026H1" | "2026H2" | "2025Q3" | "2025Q4" | "2026Q1" | "2026Q2" | "2026Q3";
type SpecialtyTab = "electronics" | "nev" | "pharma" | "fmcg" | "industrial";

type BiText = { zh: string; en: string };
type MetricCard = { value: string; label: BiText; tone?: "success" | "warning" | "info" | "danger" };
type Brief = { headline: BiText; judgment: BiText; tone: "info" | "success" | "warning" | "danger"; cards: MetricCard[]; moves: TripleRow[] };
type TripleRow = { a: BiText; b: BiText; c: BiText };
type ChartWindowSeries = { categories: string[]; data: number[]; kind: "official" | "archive_proxy" };
type SpecialtyConfig = {
  title: BiText;
  stats: MetricCard[];
  rows: TripleRow[];
  radar: { cn: number[]; global: number[] };
  note: BiText;
};

const PERIOD_META: Record<PeriodId, { label: BiText; range: BiText; partial?: boolean }> = {
  "2026YTD": {
    label: { zh: "2026年年初至今", en: "2026 year to date" },
    range: { zh: "2026-01 至 2026-09，含一至三季度", en: "2026-01 to 2026-09, Q1 through Q3" },
  },
  "2025H2": {
    label: { zh: "2025年下半年", en: "2025 H2" },
    range: { zh: "2025-07 至 2025-12", en: "2025-07 to 2025-12" },
  },
  "2026H1": {
    label: { zh: "2026年上半年", en: "2026 H1" },
    range: { zh: "2026-01 至 2026-06", en: "2026-01 to 2026-06" },
  },
  "2026H2": {
    label: { zh: "2026年下半年（至9月）", en: "2026 H2 (through Sep)" },
    range: { zh: "2026-07 至 2026-09，四季度尚未纳入", en: "2026-07 to 2026-09; Q4 is not in yet" },
    partial: true,
  },
  "2025Q3": {
    label: { zh: "2025年三季度", en: "2025 Q3" },
    range: { zh: "2025-07 至 2025-09", en: "2025-07 to 2025-09" },
  },
  "2025Q4": {
    label: { zh: "2025年四季度", en: "2025 Q4" },
    range: { zh: "2025-10 至 2025-12", en: "2025-10 to 2025-12" },
  },
  "2026Q1": {
    label: { zh: "2026年一季度", en: "2026 Q1" },
    range: { zh: "2026-01 至 2026-03", en: "2026-01 to 2026-03" },
  },
  "2026Q2": {
    label: { zh: "2026年二季度", en: "2026 Q2" },
    range: { zh: "2026-04 至 2026-06", en: "2026-04 to 2026-06" },
  },
  "2026Q3": {
    label: { zh: "2026年三季度", en: "2026 Q3" },
    range: { zh: "2026-07 至 2026-09", en: "2026-07 to 2026-09" },
  },
};

const PERIODS_BY_MODE: Record<WindowMode, PeriodId[]> = {
  ytd: ["2026YTD"],
  half: ["2025H2", "2026H1", "2026H2"],
  quarter: ["2025Q3", "2025Q4", "2026Q1", "2026Q2", "2026Q3"],
};

const CN_LPI_SERIES: Record<PeriodId, ChartWindowSeries> = {
  "2025H2": { categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: [100, 100, 100, 100, 100, 100], kind: "archive_proxy" },
  "2025Q3": { categories: ["Jul", "Aug", "Sep"], data: [100, 100, 100], kind: "archive_proxy" },
  "2025Q4": { categories: ["Oct", "Nov", "Dec"], data: [100, 100, 100], kind: "archive_proxy" },
  "2026Q1": { categories: ["Jan", "Feb", "Mar"], data: [51.2, 47.5, 50.2], kind: "official" },
  "2026Q2": { categories: ["Apr", "May", "Jun"], data: [49.7, 50.3, 50.6], kind: "official" },
  "2026H1": { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], data: [51.2, 47.5, 50.2, 49.7, 50.3, 50.6], kind: "official" },
  "2026Q3": { categories: ["Jul", "Aug", "Sep"], data: [50.4, 50.9, 51.5], kind: "official" },
  "2026H2": { categories: ["Jul", "Aug", "Sep"], data: [50.4, 50.9, 51.5], kind: "official" },
  "2026YTD": { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], data: [51.2, 47.5, 50.2, 49.7, 50.3, 50.6, 50.4, 50.9, 51.5], kind: "official" },
};

const GLOBAL_GSCPI_SERIES: Record<PeriodId, ChartWindowSeries> = {
  "2025Q3": { categories: ["Jul", "Aug", "Sep"], data: [0.03, -0.08, -0.04], kind: "official" },
  "2025Q4": { categories: ["Oct", "Nov", "Dec"], data: [-0.15, -0.21, 0.47], kind: "official" },
  "2025H2": { categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: [0.03, -0.08, -0.04, -0.15, -0.21, 0.47], kind: "official" },
  "2026Q1": { categories: ["Jan", "Feb", "Mar"], data: [0.36, 0.49, 0.63], kind: "official" },
  "2026Q2": { categories: ["Apr", "May", "Jun"], data: [1.78, 1.81, 1.21], kind: "official" },
  "2026H1": { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"], data: [0.36, 0.49, 0.63, 1.78, 1.81, 1.21], kind: "official" },
  "2026Q3": { categories: ["Jul", "Aug", "Sep"], data: [0.93, 1.2, 1.28], kind: "official" },
  "2026H2": { categories: ["Jul", "Aug", "Sep"], data: [0.93, 1.2, 1.28], kind: "official" },
  "2026YTD": { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"], data: [0.36, 0.49, 0.63, 1.78, 1.81, 1.21, 0.93, 1.2, 1.28], kind: "official" },
};

const RADAR_AXES: BiText[] = [
  { zh: "预测与补货", en: "Forecast & Replenishment" },
  { zh: "关键料保障", en: "Critical Parts Assurance" },
  { zh: "仓配协同", en: "Warehouse-Distribution Coordination" },
  { zh: "跨境履约", en: "Cross-border Fulfillment" },
  { zh: "逆向物流", en: "Reverse Logistics" },
];

const SPECIALTY_CONFIG: Record<SpecialtyTab, SpecialtyConfig> = {
  electronics: {
    title: { zh: "电子消费品", en: "Consumer Electronics" },
    stats: [
      { value: "+75%", label: { zh: "Q2部分存储价格涨幅", en: "Q2 memory price increase (selected)" }, tone: "warning" },
      { value: ">52周", label: { zh: "部分器件交期", en: "Lead time for selected components" }, tone: "danger" },
      { value: "$791.7B", label: { zh: "2025全球半导体销售", en: "2025 global semiconductor revenue" }, tone: "info" },
      { value: "紧平衡", label: { zh: "2026上半年供给状态", en: "Supply condition in 2026 H1" }, tone: "warning" },
    ],
    rows: [
      {
        a: { zh: "需求与补货", en: "Demand & Replenishment" },
        b: { zh: "促销与渠道波动导致预测频次提高", en: "Promotion/channel volatility raised forecast frequency" },
        c: { zh: "构建活动分层预测与安全库存策略", en: "Adopt campaign-tiered forecasting and safety stock" },
      },
      {
        a: { zh: "关键料管理", en: "Critical Material Management" },
        b: { zh: "芯片与显示等关键料交期波动延续", en: "Lead-time volatility persisted for chips/displays" },
        c: { zh: "推进双供覆盖与替代BOM管理", en: "Expand dual sourcing and substitute BOM management" },
      },
      {
        a: { zh: "履约网络", en: "Fulfillment Network" },
        b: { zh: "跨境与本地仓配协同要求提升", en: "Cross-border and domestic orchestration demands increased" },
        c: { zh: "优化前置仓与海外仓联动补货", en: "Optimize forward + overseas warehouse replenishment" },
      },
    ],
    radar: { cn: [88, 86, 82, 79, 68], global: [84, 90, 78, 85, 72] },
    note: {
      zh: "中国在预测与仓配执行更快，全球在关键料保障与跨境履约更均衡。",
      en: "China executes faster in forecasting/warehousing; global networks are more balanced in critical parts and cross-border fulfillment.",
    },
  },
  nev: {
    title: { zh: "新能源汽车", en: "New Energy Vehicles" },
    stats: [
      { value: "60-85%", label: { zh: "中国在多环节产能份额", en: "China capacity share across key links" }, tone: "warning" },
      { value: "<25%", label: { zh: "N-1情景部分环节可满足比例", en: "Satisfaction ratio in selected N-1 scenarios" }, tone: "danger" },
      { value: "$17B/月", label: { zh: "关键电池出口停摆月冲击测算", en: "Estimated monthly impact if battery exports stall" }, tone: "warning" },
      { value: "N-1", label: { zh: "重点韧性分析方法", en: "Core resilience method" }, tone: "info" },
    ],
    rows: [
      {
        a: { zh: "电池供应保障", en: "Battery Supply Assurance" },
        b: { zh: "供给集中度仍高，单点风险客观存在", en: "Supply concentration remains high with single-point risk" },
        c: { zh: "建立关键原料与电芯脆弱点清单", en: "Maintain vulnerability mapping for materials/cells" },
      },
      {
        a: { zh: "区域化布局", en: "Regionalized Footprint" },
        b: { zh: "本地配套和区域化建厂加速", en: "Local ecosystem build-out accelerated" },
        c: { zh: "按区域建立主备供应与库存池", en: "Build regional primary-backup sourcing and inventory pools" },
      },
      {
        a: { zh: "追溯与合规", en: "Traceability & Compliance" },
        b: { zh: "全生命周期追溯要求提升", en: "Lifecycle traceability requirements increased" },
        c: { zh: "打通制造-仓配-售后追溯链路", en: "Unify traceability across manufacturing, logistics, and aftersales" },
      },
    ],
    radar: { cn: [76, 89, 74, 71, 66], global: [72, 92, 70, 84, 68] },
    note: {
      zh: "全球在跨境履约和关键料协调略强，中国在本地执行速度与协同响应更快。",
      en: "Global players are stronger in cross-border and critical-part coordination; China moves faster in local execution and response.",
    },
  },
  pharma: {
    title: { zh: "医药与冷链", en: "Pharma & Cold Chain" },
    stats: [
      { value: "2-8°C / -70°C", label: { zh: "典型温控区间", en: "Typical temperature bands" }, tone: "info" },
      { value: "60%", label: { zh: "海关被列为主要延误因素（跨行业）", en: "Customs as major delay source (cross-industry)" }, tone: "warning" },
      { value: "39%", label: { zh: "仓储与物流枢纽优先投资占比", en: "Warehouse/logistics hub investment priority" }, tone: "success" },
      { value: "53%", label: { zh: "高政策不确定性预期", en: "High policy uncertainty expectation" }, tone: "warning" },
    ],
    rows: [
      {
        a: { zh: "温控运输", en: "Temperature-controlled Transport" },
        b: { zh: "温湿度监控覆盖率持续提升", en: "Coverage of temperature/humidity monitoring increased" },
        c: { zh: "统一告警规则与应急SOP", en: "Standardize alerts and emergency SOPs" },
      },
      {
        a: { zh: "仓配网络", en: "Warehouse-Distribution Network" },
        b: { zh: "区域冷链仓网和院端配送协同增强", en: "Regional cold chain + healthcare endpoint coordination improved" },
        c: { zh: "优化干支线衔接与末端时效", en: "Optimize trunk-branch handoff and last-mile SLA" },
      },
      {
        a: { zh: "质量合规", en: "Quality Compliance" },
        b: { zh: "批次追溯与电子单证要求强化", en: "Batch traceability and e-document requirements tightened" },
        c: { zh: "建设合规中台与审计留痕", en: "Build compliance control tower and audit trails" },
      },
    ],
    radar: { cn: [68, 75, 82, 64, 79], global: [70, 78, 84, 69, 83] },
    note: {
      zh: "医药冷链中外差距不大，全球在逆向质量闭环略领先。",
      en: "Capability gaps are moderate; global systems are slightly stronger in reverse quality loops.",
    },
  },
  fmcg: {
    title: { zh: "快消与零售", en: "FMCG & Retail" },
    stats: [
      { value: "46%", label: { zh: "新市场/客群驱动占比", en: "New market/customer growth driver" }, tone: "info" },
      { value: "43%", label: { zh: "AI列为前三增长驱动", en: "AI ranked top-3 growth driver" }, tone: "success" },
      { value: "42%", label: { zh: "运力与基础设施驱动占比", en: "Capacity/infrastructure growth driver" }, tone: "info" },
      { value: "94%", label: { zh: "预期贸易持平或更快", en: "Expect trade flat or faster" }, tone: "warning" },
    ],
    rows: [
      {
        a: { zh: "全渠道预测", en: "Omnichannel Forecasting" },
        b: { zh: "促销节点导致波动频率提升", en: "Promotion cycles increased demand volatility frequency" },
        c: { zh: "建设活动前中后分段预测", en: "Use pre/during/post-campaign segmented forecasting" },
      },
      {
        a: { zh: "库存配置", en: "Inventory Allocation" },
        b: { zh: "前置仓+中心仓协同加深", en: "Forward + central warehouse collaboration deepened" },
        c: { zh: "优化下沉库存与周转平衡", en: "Optimize stock placement vs. turnover balance" },
      },
      {
        a: { zh: "逆向与损耗", en: "Returns & Shrinkage" },
        b: { zh: "逆向链路数字化程度提升", en: "Reverse-logistics digitization improved" },
        c: { zh: "将退货和损耗纳入利润治理", en: "Integrate returns and shrinkage into margin governance" },
      },
    ],
    radar: { cn: [86, 63, 88, 72, 77], global: [82, 66, 80, 79, 74] },
    note: {
      zh: "中国在仓配协同更突出，全球在跨境履约标准化更成熟。",
      en: "China stands out in warehouse-distribution coordination; global systems are more mature in cross-border standardization.",
    },
  },
  industrial: {
    title: { zh: "工业装备/高科技制造", en: "Industrial Equipment / High-tech Manufacturing" },
    stats: [
      { value: "95%", label: { zh: "认为AI是成功必要能力", en: "See AI as a must-have capability" }, tone: "info" },
      { value: "97%", label: { zh: "AI已进入核心流程", en: "AI already embedded in core flows" }, tone: "success" },
      { value: "62%", label: { zh: "将制造计划视为主要挑战", en: "Identify production planning as top challenge" }, tone: "warning" },
      { value: "81%", label: { zh: "供应商管理成本高", en: "Supplier management seen as costly" }, tone: "warning" },
    ],
    rows: [
      {
        a: { zh: "关键件保供", en: "Critical Parts Assurance" },
        b: { zh: "长交期与单点依赖问题显著", en: "Long lead times and concentration risks remain significant" },
        c: { zh: "实施关键件分级保供策略", en: "Apply tiered assurance strategy for critical parts" },
      },
      {
        a: { zh: "项目制协同", en: "Project-based Coordination" },
        b: { zh: "制造计划与齐套率仍是短板", en: "Production planning and material readiness remain bottlenecks" },
        c: { zh: "建设里程碑+齐套率联动看板", en: "Build milestone-readiness linked control board" },
      },
      {
        a: { zh: "售后备件网络", en: "Aftersales Spare-parts Network" },
        b: { zh: "全球备件可视化需求提升", en: "Need for global spare-parts visibility increased" },
        c: { zh: "优化区域备件仓与应急调拨", en: "Optimize regional spare-part depots and emergency transfers" },
      },
    ],
    radar: { cn: [71, 84, 73, 67, 70], global: [69, 88, 75, 76, 72] },
    note: {
      zh: "全球在关键件协同与跨境链路更强，中国在项目执行速度更具优势。",
      en: "Global firms are stronger in critical-part and cross-border coordination; China is faster in project execution.",
    },
  },
};

const t = (lang: Lang, text: BiText) => (lang === "zh" ? text.zh : text.en);


function card(value: string, zh: string, en: string, tone?: MetricCard["tone"]): MetricCard {
  return { value, label: { zh, en }, tone };
}

function move(themeZh: string, themeEn: string, signalZh: string, signalEn: string, actionZh: string, actionEn: string): TripleRow {
  return {
    a: { zh: themeZh, en: themeEn },
    b: { zh: signalZh, en: signalEn },
    c: { zh: actionZh, en: actionEn },
  };
}

const CHINA_ARCHIVE: Brief = {
  headline: {
    zh: "2025 年中国月度 LPI 还不能当读数用",
    en: "The 2025 China LPI months are not usable as readings",
  },
  judgment: {
    zh: "本版没有核到可逐月引用的 2025 年中国物流业景气指数官方序列。图上的分值是档案代理（基准=100），只为把时间轴留住，不能解释成景气回升。做决策请改看 2026 年。",
    en: "This edition does not have a citable monthly official China LPI series for 2025. The chart is an archive proxy (baseline=100) that only holds the time axis. It is not a recovery. Switch to a 2026 window for a decision.",
  },
  tone: "warning",
  cards: [
    card("代理", "不是官方 LPI", "Not an official LPI", "warning"),
    card("100", "代理基准", "Proxy baseline"),
    card("2026", "可引用的读数从这里开始", "Citable readings start here", "info"),
    card("未引用", "不把代理分写成结论", "Proxy scores are not findings"),
  ],
  moves: [
    move("口径", "Scope", "2025 年中国曲线是占位，不是统计", "The 2025 China line is a placeholder, not a statistic", "对外引用时删掉这张图，只留 2026", "Drop this chart from any external citation; keep 2026"),
    move("对比", "Comparison", "全球 2025 年已经换成纽约联储修订值，中国没有同等序列", "Global 2025 now uses the revised New York Fed series; China does not have an equivalent", "不要把两边的 2025 年曲线放在同一张结论页", "Do not put the two 2025 lines on the same findings page"),
    move("下一步", "Next", "2026 年 1 月以后的中国读数可以引用", "China readings from January 2026 onward are citable", "从 2026Q1 开始读修复路径", "Start the recovery path at 2026Q1"),
  ],
};

function getBrief(scope: Scope, period: PeriodId): Brief {
  if (scope === "cn" && (period === "2025Q3" || period === "2025Q4" || period === "2025H2")) return CHINA_ARCHIVE;

  if (scope === "cn" && period === "2026Q1") {
    return {
      headline: { zh: "春节把景气打到收缩，3 月才收回扩张", en: "The holiday pushed sentiment into contraction; March got it back" },
      judgment: {
        zh: "LPI 1 月 51.2%，2 月 47.5%，3 月 50.2%。2 月的低点主要是春节错位，不能写成需求塌陷。3 月只是回到荣枯线上方，还没有形成斜率。",
        en: "LPI was 51.2% in January, 47.5% in February, and 50.2% in March. The February low is mostly the Lunar New Year shift, not a demand collapse. March only crossed back above 50.",
      },
      tone: "warning",
      cards: [
        card("47.5%", "2 月低点", "February low", "warning"),
        card("50.2%", "3 月回到扩张", "March back in expansion", "info"),
        card("51.2%", "1 月起点", "January start"),
        card("春节", "先拆季节，再谈趋势", "Separate the holiday from the trend", "warning"),
      ],
      moves: [
        move("读数", "Reading", "季内振幅大于期末位置", "The intra-quarter swing is larger than the ending level", "复盘用 1 月和 3 月，不要用季度均值", "Review January and March, not the quarterly average"),
        move("库存", "Inventory", "2 月收缩会让补货日历整体后移", "The February contraction pushes the replenishment calendar back", "把节后回补和真实需求分开下单", "Separate post-holiday restock from real demand"),
        move("计划", "Planning", "3 月只是站回 50 上方", "March is only just back above 50", "承诺量维持，等二季度确认再加", "Hold commitments until Q2 confirms"),
      ],
    };
  }

  if (scope === "cn" && period === "2026Q2") {
    return {
      headline: { zh: "刚回到扩张，三个月只抬了 0.9 个点", en: "Back in expansion, and only 0.9 point higher in three months" },
      judgment: {
        zh: "4 月 LPI 49.7%，5 月 50.3%，6 月 50.6%。6 月不是单独引用的标题，而是 7 月官方表述“较上月回落 0.2 个百分点”回推出来的。二季度完成了从收缩边缘回到扩张，斜率仍然很浅。",
        en: "LPI was 49.7% in April, 50.3% in May, and 50.6% in June. June is not a standalone headline; it is implied by the official July line that the index fell 0.2 point from the prior month. Q2 crossed back into expansion on a shallow slope.",
      },
      tone: "info",
      cards: [
        card("49.7%", "4 月仍在收缩", "April still contracting", "warning"),
        card("50.3%", "5 月回到扩张", "May back in expansion", "success"),
        card("50.6%", "6 月，由 7 月回推", "June, implied by July", "info"),
        card("+0.9", "4 月到 6 月，百分点", "April to June, points"),
      ],
      moves: [
        move("确认", "Confirmation", "5 月和 6 月连续站在 50 上方，7 月官方也说业务总量已连续 3 个月扩张", "May and June both held above 50, and the July release said business volume had expanded for three straight months", "把 6 月当成修复确认，不当成加速", "Treat June as confirmation, not acceleration"),
        move("库存", "Inventory", "斜率只有 0.9 个点，加库存的理由还不充分", "A 0.9-point slope is not enough to justify more stock", "安全库存维持，不加到旺季假设", "Hold safety stock; do not build a peak-season case"),
        move("观察", "Watch", "真正的连续抬升出现在三季度", "The sustained climb shows up in Q3", "用 7 月以后的读数决定是否加产", "Use the readings after July to decide on more output"),
      ],
    };
  }

  if (scope === "cn" && period === "2026H1") {
    return {
      headline: { zh: "上半年是 V 型，不是单边上行", en: "The first half was a V, not a straight climb" },
      judgment: {
        zh: "LPI 从 1 月 51.2% 落到 2 月 47.5%，4 月再次落到 49.7%，6 月收在 50.6%。两次跌破 50 之后都收回来了，但年底的位置几乎回到了 1 月，斜率很浅。6 月由 7 月“回落 0.2 个百分点”回推。",
        en: "LPI fell from 51.2% in January to 47.5% in February, slipped again to 49.7% in April, and finished June at 50.6%. Both breaks below 50 were recovered, but June is close to January and the slope is shallow. June is implied by July's 0.2-point decline.",
      },
      tone: "info",
      cards: [
        card("47.5%", "2 月低点", "February low", "warning"),
        card("49.7%", "4 月第二次跌破", "Second break, April", "warning"),
        card("50.6%", "6 月收官", "June close", "success"),
        card("两次", "跌破 50 后又收回", "Recovered after two breaks below 50"),
      ],
      moves: [
        move("叙事", "Narrative", "用“修复”而不是“景气上行”描述上半年", "Describe H1 as a repair, not a boom", "对外材料不要画成单边箭头", "Do not draw H1 as a one-way arrow"),
        move("节奏", "Cadence", "2 月和 4 月是两个不同的坑", "February and April are two different holes", "节假日坑和 4 月再收缩要分开复盘", "Review the holiday hole and the April relapse separately"),
        move("衔接", "Handoff", "6 月只是站稳，加速在 7 月以后", "June only stabilized; the climb is after July", "下半年预算从三季度的连续扩张起算", "Start the second-half case from Q3's run of expansion"),
      ],
    };
  }

  if (scope === "cn" && (period === "2026Q3" || period === "2026H2")) {
    return {
      headline: {
        zh: period === "2026H2" ? "下半年至今连续扩张，但这还不是完整的下半年" : "扩张在继续，成本没有松开",
        en: period === "2026H2" ? "Expansion has continued so far this half, and the half is not finished" : "Expansion continues, and costs have not eased",
      },
      judgment: {
        zh: "LPI 7 月 50.4%，8 月 50.9%，9 月 51.5%，自 5 月起连续 5 个月扩张。9 月新订单 51.2%，业务活动预期 56.2%，设备利用率 50.1%，今年首次回到扩张。前九个月主营业务成本指数都在 52% 以上，9 月利润指数与 8 月持平。东部业务总量回升 1 个百分点，是总量抬升的主因；西部新订单回落 0.5 个百分点。10 月以后尚未纳入。",
        en: "LPI was 50.4% in July, 50.9% in August, and 51.5% in September, a fifth straight month of expansion since May. September new orders were 51.2%, expectations 56.2%, and equipment utilization 50.1%, its first expansion month of 2026. The main-business cost index stayed above 52% for the first nine months, and the September profit index was flat on August. Eastern business volume rose 1 point and drove the national lift; western new orders fell 0.5 point. Nothing after September is included.",
      },
      tone: "warning",
      cards: [
        card("51.5%", "9 月 LPI，连续 5 个月扩张", "September LPI, fifth expansion month", "success"),
        card("51.2%", "9 月新订单", "September new orders", "info"),
        card("56.2%", "9 月业务活动预期", "September expectations", "success"),
        card(">52%", "前九个月成本指数", "Cost index, first nine months", "warning"),
      ],
      moves: [
        move(
          "需求",
          "Demand",
          "新订单 51.2%，设备利用率年内首次扩张；东/中/西业务总量 51.3% / 51.2% / 51.7%",
          "New orders 51.2%; equipment utilization expanded for the first time this year; east / central / west volumes 51.3% / 51.2% / 51.7%",
          "排产跟着东部放量，不要把全国均值套到西部新订单",
          "Schedule to the eastern lift; do not apply the national average to western orders",
        ),
        move(
          "利润",
          "Margin",
          "成本指数仍高于 52%，9 月利润指数与 8 月持平，三季度利润均值与二季度持平",
          "The cost index is still above 52%; September profit was flat on August, and the Q3 profit average matched Q2",
          "扩产配额和价格条款分开批。扩张不是毛利许可",
          "Approve volume and price terms separately. Expansion is not a margin permit",
        ),
        move(
          "预期",
          "Expectations",
          "预期指数 56.2%，比 8 月高 1.8 个百分点，明显高于新订单",
          "Expectations are 56.2%, up 1.8 points from August, and well above new orders",
          "用预期做情景上限，用新订单做承诺上限",
          "Use expectations as the scenario ceiling and new orders as the commitment ceiling",
        ),
      ],
    };
  }

  if (scope === "cn" && period === "2026YTD") {
    return {
      headline: { zh: "年初至今是两头扩张，中间两次跌破", en: "The year so far expanded at both ends, with two breaks in the middle" },
      judgment: {
        zh: "这是 1–9 月的整段，不是把三季度单独拿出来。LPI 1 月 51.2%，2 月 47.5%，3 月 50.2%，4 月 49.7%，5 月 50.3%，6 月 50.6%（由 7 月回推），7 月 50.4%，8 月 50.9%，9 月 51.5%。上半年是 V 型，5 月以后才连着站在扩张区。9 月是年内高点，但只比 1 月高 0.3 个点。前九个月成本指数都高于 52%。",
        en: "This is January–September as one path, not Q3 on its own. LPI was 51.2% in January, 47.5% in February, 50.2% in March, 49.7% in April, 50.3% in May, 50.6% in June (implied by July), 50.4% in July, 50.9% in August, and 51.5% in September. The first half was a V; expansion only held from May. September is the high of the year so far, and it is only 0.3 point above January. The cost index stayed above 52% for all nine months.",
      },
      tone: "warning",
      cards: [
        card("51.5%", "9 月，年内高点", "September, high so far", "success"),
        card("47.5%", "2 月，年内低点", "February, low so far", "warning"),
        card("两次", "跌破 50：2 月、4 月", "Breaks below 50: Feb, Apr", "warning"),
        card(">52%", "前九个月成本指数", "Cost index, all nine months", "danger"),
      ],
      moves: [
        move("分段", "Three parts", "春节坑、4 月再收缩、5–9 月连续扩张，不是一条均值", "A holiday hole, an April relapse, then expansion from May through September. Not one average", "年初至今按这三段写，三季度只是第三段", "Write the year as these three parts. Q3 is only the third"),
        move("位置", "Level", "9 月 51.5% 只比 1 月高 0.3 个点，斜率在三季度，位置仍靠近年初", "September's 51.5% is only 0.3 point above January. The slope is in Q3; the level is still near January", "不要用 9 月一个点代表这一年", "Do not let the September print stand for the year"),
        move("利润", "Margin", "成本闸门九个月都没有松开", "The cost gate has not opened in any of the nine months", "用 9 月排产，用成本指数批价格", "Schedule off September, and approve price off the cost index"),
      ],
    };
  }

  if (scope === "global" && period === "2025Q3") {
    return {
      headline: { zh: "压力贴着长期均值，供给不是当时的主矛盾", en: "Pressure sat on the long-run average; supply was not the binding constraint" },
      judgment: {
        zh: "GSCPI 7 月 0.03，8 月 -0.08，9 月 -0.04。三个月都在零附近。0 是长期均值，负数表示压力低于平均。这是 2026 年冲击之前的松弛期。",
        en: "GSCPI was 0.03 in July, -0.08 in August, and -0.04 in September. All three months sat on zero. Zero is the long-run average; a negative reading is below-average pressure. This is the loose period before the 2026 shock.",
      },
      tone: "info",
      cards: [
        card("0.03", "7 月", "July"),
        card("-0.08", "8 月，低于均值", "August, below average", "success"),
        card("-0.04", "9 月", "September", "success"),
        card("0", "长期均值", "Long-run average"),
      ],
      moves: [
        move("判断", "Call", "供给约束不是 2025 年三季度的预算前提", "Supply stress is not the budgeting premise for 2025 Q3", "这段时期的问题在需求和政策，不在交期", "The issues in this window are demand and policy, not lead time"),
        move("库存", "Inventory", "低于均值时加安全库存会变成多余现金", "Extra safety stock in a below-average window becomes idle cash", "维持周转，不要预支 2026 年的冲击", "Keep turns; do not pre-build the 2026 shock"),
        move("口径", "Vintage", "序列取纽约联储 2026 年 10 月发布后的修订值", "The series is the New York Fed vintage after the October 2026 release", "引用时写明 vintage，历史值还会再修订", "Name the vintage; history will be revised again"),
      ],
    };
  }

  if (scope === "global" && period === "2025Q4") {
    return {
      headline: { zh: "11 月最松，12 月一个月转正", en: "November was the loosest month; December flipped positive" },
      judgment: {
        zh: "GSCPI 10 月 -0.15，11 月 -0.21，12 月 0.47。年末一个月从明显低于均值转到高于均值。2026 年的抬升不是从零突然开始的。",
        en: "GSCPI was -0.15 in October, -0.21 in November, and 0.47 in December. One month took the index from clearly below average to above it. The 2026 rise did not start from zero.",
      },
      tone: "warning",
      cards: [
        card("-0.21", "11 月低点", "November low", "success"),
        card("0.47", "12 月转正", "December turns positive", "warning"),
        card("+0.68", "11 月到 12 月", "November to December", "warning"),
        card("0", "长期均值", "Long-run average"),
      ],
      moves: [
        move("转折", "Turn", "变化集中在 12 月，不是整个季度均匀抬升", "The change is concentrated in December, not spread evenly across the quarter", "复盘锚在 12 月，不要用季度均值", "Anchor the review on December, not the quarterly average"),
        move("衔接", "Handoff", "12 月 0.47 已经高于随后的 1 月 0.36", "December's 0.47 is already above January's 0.36", "2026 年开年是接住这个转正，不是新的起点", "Early 2026 inherits this turn; it is not a fresh start"),
        move("动作", "Action", "转正幅度仍小于 0.5 个标准差", "The positive reading is still under half a standard deviation", "只做交期预警，不加峰值库存", "Set a lead-time watch, not peak inventory"),
      ],
    };
  }

  if (scope === "global" && period === "2025H2") {
    return {
      headline: { zh: "下半年大部分月份低于均值，转折在 12 月", en: "Most of the half sat below average; the turn was December" },
      judgment: {
        zh: "7 月到 11 月在 -0.21 到 0.03 之间，12 月 0.47。2025 年下半年不是压力年。把它画成持续紧张，会把 2026 年 4 月的跳升解释错。",
        en: "July through November ranged from -0.21 to 0.03, then December printed 0.47. The second half of 2025 was not a stress year. Drawing it as persistent tightness misreads the April 2026 jump.",
      },
      tone: "info",
      cards: [
        card("-0.21", "11 月低点", "November low", "success"),
        card("0.47", "12 月", "December", "warning"),
        card("5", "低于或贴近均值的月份", "Months at or below average"),
        card("1", "明显转正的月份", "Month clearly above average", "warning"),
      ],
      moves: [
        move("叙事", "Narrative", "2025 年下半年是松、然后在最后一个月转正", "H2 2025 was loose, then turned positive in the last month", "年度总结把 12 月单独写出", "Call December out in the annual write-up"),
        move("对比", "Contrast", "这半年的高点 0.47，远低于 2026 年 5 月的 1.81", "The half's high of 0.47 is far below May 2026 at 1.81", "不要用 2025 年的库存政策去对标 2026 年二季度", "Do not benchmark 2025 inventory policy against 2026 Q2"),
        move("口径", "Vintage", "全部使用 2026 年 10 月修订序列", "All points use the October 2026 revised vintage", "替换掉旧版里基准=100 的全球代理分", "Replace the old baseline-100 global proxy"),
      ],
    };
  }

  if (scope === "global" && period === "2026Q1") {
    return {
      headline: { zh: "压力在抬，但还远不是二季度的冲击", en: "Pressure was rising, and it was not yet the second-quarter shock" },
      judgment: {
        zh: "GSCPI 1 月 0.36，2 月 0.49，3 月 0.63。三个月连续上行，3 月仍低于 1 个标准差。事后看，这是 4 月跳到 1.78 之前的积累，当时还不是冲击本身。",
        en: "GSCPI was 0.36 in January, 0.49 in February, and 0.63 in March. Three rising months, and March was still below one standard deviation. In hindsight this is the buildup before April's jump to 1.78, not the shock itself.",
      },
      tone: "info",
      cards: [
        card("0.36", "1 月", "January"),
        card("0.49", "2 月", "February", "info"),
        card("0.63", "3 月", "March", "warning"),
        card("1.78", "下一月，4 月", "Next month, April", "danger"),
      ],
      moves: [
        move("判断", "Call", "一季度的正确动作是盯斜率，不是宣布冲击", "The right Q1 move was to watch the slope, not declare a shock", "复盘时把 3 月和 4 月切开", "Keep March and April in different chapters"),
        move("预警", "Watch", "连续三个月抬升，已经不是噪音", "Three rising months are no longer noise", "4 周交期预警在 3 月就该打开", "A four-week lead-time watch should already have been on in March"),
        move("库存", "Inventory", "0.63 还不到后来峰值的一半", "0.63 is not yet half the later peak", "不要用二季度的库存政策回写一季度", "Do not rewrite Q1 with the Q2 inventory policy"),
      ],
    };
  }

  if (scope === "global" && period === "2026Q2") {
    return {
      headline: { zh: "冲击在 4 月和 5 月，6 月已经从峰值下来", en: "The shock was April and May; June was already off the peak" },
      judgment: {
        zh: "GSCPI 4 月 1.78，5 月 1.81，6 月 1.21，取 2026 年 10 月修订口径。旧版把 4 月和 5 月都写成 1.82，那个重复值作废。冲击集中在 4–5 月，6 月已从峰值回落 0.60。只记峰值会把二季度读成一条平线。",
        en: "GSCPI was 1.78 in April, 1.81 in May, and 1.21 in June on the October 2026 vintage. The previous edition's repeated 1.82 for April and May is retired. The shock sat in April and May; June was already 0.60 off the peak. Remembering only the peak flattens the quarter.",
      },
      tone: "danger",
      cards: [
        card("1.78", "4 月跳升", "April jump", "danger"),
        card("1.81", "5 月本轮峰值", "May peak of this cycle", "danger"),
        card("1.21", "6 月", "June", "warning"),
        card("-0.60", "5 月到 6 月", "May to June", "info"),
      ],
      moves: [
        move("叙事", "Narrative", "二季度有冲击，也有 6 月的回落", "Q2 contains both the shock and the June retreat", "对外只写 1.81 会漏掉已经开始的回落", "Quoting only 1.81 drops the retreat that had already started"),
        move("预算", "Budget", "峰值不适合做下半年的运行假设", "The peak is a poor operating assumption for the second half", "下半年用 6 月以后的路径，不用 5 月", "Run the second half off the post-June path, not May"),
        move("运价", "Freight", "上半年报告里的 5 月末 SCFI / WCI 快照本轮没有刷新到 9 月", "The late-May SCFI / WCI snapshots in the H1 edition were not refreshed through September", "三季度卡片不再挂这组运价", "Q3 cards no longer carry those freight prints"),
      ],
    };
  }

  if (scope === "global" && period === "2026H1") {
    return {
      headline: { zh: "前三个月是慢爬，4 月才是这半年的事件", en: "The first three months were a grind; April is the event of the half" },
      judgment: {
        zh: "1 月到 3 月从 0.36 升到 0.63，4 月跳到 1.78，5 月 1.81，6 月回到 1.21。上半年的定义是 4 月的跳升，不是一季度的慢爬，也不是一条停在峰值上的平线。",
        en: "January to March rose from 0.36 to 0.63, April jumped to 1.78, May printed 1.81, and June fell back to 1.21. The half is defined by the April jump, not by the first-quarter grind and not by a line that stayed at the peak.",
      },
      tone: "danger",
      cards: [
        card("0.63", "3 月，跳升前", "March, before the jump", "info"),
        card("1.81", "5 月峰值", "May peak", "danger"),
        card("1.21", "6 月收官", "June close", "warning"),
        card("4 月", "定义事件", "The defining month", "danger"),
      ],
      moves: [
        move("分段", "Split", "1–3 月和 4–6 月不是同一种运行状态", "January–March and April–June are not the same operating state", "半年复盘按季度写，不要合成一个均值", "Write the half as two quarters, not one average"),
        move("峰值", "Peak", "1.81 是高点，不是半年的典型水平", "1.81 is the high, not the typical level of the half", "典型水平看 6 月的 1.21，压力情景才用 1.81", "Use June's 1.21 as typical and 1.81 only as the stress case"),
        move("衔接", "Handoff", "6 月已经在回落，7 月还会再下一台阶", "June was already falling, and July steps down again", "下半年计划从 7 月的 0.93 接，而不是从 5 月接", "Hand the second half off July's 0.93, not off May"),
      ],
    };
  }

  if (scope === "global" && period === "2026YTD") {
    return {
      headline: { zh: "4 月是这一年的事件，9 月还没有回到跳升之前", en: "April is the event of the year, and September is not back to where the jump started" },
      judgment: {
        zh: "这是 1–9 月的整段。GSCPI 从 1 月 0.36、2 月 0.49、3 月 0.63，跳到 4 月 1.78、5 月 1.81，再落到 6 月 1.21、7 月 0.93，然后 8 月修订后 1.20、9 月 1.28。低点在 7 月，终点在 9 月，终点仍高于一季度的每一个月。年初至今不是“冲击已经过去”。",
        en: "This is January–September as one path. GSCPI went from 0.36, 0.49, and 0.63 in the first quarter to 1.78 in April and 1.81 in May, then 1.21 in June and 0.93 in July, and a revised 1.20 in August and 1.28 in September. The low is July and the end is September, and the end is still above every first-quarter month. Year to date is not “the shock is over.”",
      },
      tone: "warning",
      cards: [
        card("0.36", "1 月起点", "January start"),
        card("1.81", "5 月峰值", "May peak", "danger"),
        card("0.93", "7 月，离开峰值后的低点", "July, low after the peak", "info"),
        card("1.28", "9 月终点", "September close", "warning"),
      ],
      moves: [
        move("三段", "Three parts", "1–3 月慢爬，4–5 月冲击，6–9 月离开峰值但没有回到跳升前", "January–March ground higher, April–May was the shock, June–September left the peak without returning to the pre-jump level", "要看其中一段，改选季度。年初至今才是这一年", "To read one part, switch to a quarter. Year to date is the year"),
        move("预算", "Budget", "9 月 1.28 是当前运行点，5 月 1.81 是压力情景，0.36–0.63 只是跳升前的底", "September's 1.28 is the operating point, May's 1.81 is the stress case, and 0.36–0.63 is only the floor before the jump", "不要用任何一个季度均值代替 1–9 月", "Do not replace January–September with any one quarterly average"),
        move("修订", "Revision", "8 月从 1.06 上修到 1.20，整条年初至今的线都是 10 月口径", "August was revised from 1.06 to 1.20, and the whole year-to-date line is the October vintage", "下次发布先对修订，再判断 9 月以后的方向", "On the next release, check the revision before judging the direction after September"),
      ],
    };
  }

  return {
    headline: {
      zh: period === "2026H2" ? "7 月下了台阶，8 月和 9 月又抬头" : "离开了峰值，然后重新抬头",
      en: period === "2026H2" ? "July stepped down; August and September turned back up" : "Off the peak, then turning back up",
    },
    judgment: {
      zh: "GSCPI 7 月 0.93，8 月修订后 1.20，9 月 1.28。8 月初值是 1.06，10 月发布时上修到 1.20。9 月约高于长期均值 1.3 个标准差，仍低于 5 月峰值 1.81，也远低于 2021 年 12 月的 4.43。故事不是冲击结束。下半年目前只收到 9 月，10 月指数尚未发布。",
      en: "GSCPI was 0.93 in July, a revised 1.20 in August, and 1.28 in September. August's first print was 1.06 and was revised up to 1.20 in the October release. September is about 1.3 standard deviations above the long-run average, still below the May peak of 1.81 and far below 4.43 in December 2021. The shock is not over. This half only runs through September; October is not out.",
    },
    tone: "warning",
    cards: [
      card("0.93", "7 月低点", "July low", "info"),
      card("1.20", "8 月，由 1.06 上修", "August, revised from 1.06", "warning"),
      card("1.28", "9 月", "September", "warning"),
      card("1.81", "5 月峰值，用来对照", "May peak, for scale", "danger"),
    ],
    moves: [
      move(
        "预算",
        "Budget",
        "7 月 0.93 和 5 月 1.81 都不适合当四季度的运行点",
        "Neither July's 0.93 nor May's 1.81 is a good operating point for the fourth quarter",
        "运行假设用 9 月的 1.28，压力情景另列 1.81",
        "Use September's 1.28 as the operating case and keep 1.81 as a separate stress case",
      ),
      move(
        "修订",
        "Revision",
        "8 月在一个月内上修了 0.14",
        "August was revised up by 0.14 within a month",
        "S&OP 锁定纽约联储 2026 年 10 月 vintage，下次发布先对修订再对方向",
        "Lock S&OP to the October 2026 New York Fed vintage, and check revisions before direction",
      ),
      move(
        "动作",
        "Action",
        "压力离开峰值后又连升两个月，距离 2021 年的极端值仍然很远",
        "Pressure has risen for two months off the peak and is still far from the 2021 extreme",
        "优先锁交期和在途，不要把安全库存加回 5 月的水平",
        "Lock lead times and in-transit visibility; do not rebuild safety stock to the May level",
      ),
    ],
  };
}

function rowsOf(lang: Lang, rows: TripleRow[]) {
  return rows.map((r) => [t(lang, r.a), t(lang, r.b), t(lang, r.c)]);
}

function colHead(label: string) {
  return (
    <Text as="span" size="small" weight="semibold" style={{ letterSpacing: "0.08em" }}>
      {label}
    </Text>
  );
}

function SectionMark({ index, label }: { index: string; label: string }) {
  return (
    <Row gap={10} align="center">
      <Text size="small" weight="semibold" tone="tertiary" style={{ letterSpacing: "0.14em" }}>
        {index}
      </Text>
      <Text weight="semibold">{label}</Text>
    </Row>
  );
}

export default function SupplyChainReport2026H1() {
  const [lang, setLang] = useCanvasState<Lang>("report-lang-q3", "zh");
  const [scope, setScope] = useCanvasState<Scope>("report-scope-q3", "cn");
  const [windowMode, setWindowMode] = useCanvasState<WindowMode>("report-window-ytd", "ytd");
  const [period, setPeriod] = useCanvasState<PeriodId>("report-period-ytd", "2026YTD");
  const [specialtyTab, setSpecialtyTab] = useCanvasState<SpecialtyTab>("report-specialty-q3", "electronics");
  const theme = useHostTheme();

  const periodOptions = PERIODS_BY_MODE[windowMode].map((id) => ({
    value: id,
    label: t(lang, PERIOD_META[id].label),
  }));
  const activePeriod = PERIODS_BY_MODE[windowMode].includes(period) ? period : PERIODS_BY_MODE[windowMode][PERIODS_BY_MODE[windowMode].length - 1];
  const brief = getBrief(scope, activePeriod);
  const chart = scope === "cn" ? CN_LPI_SERIES[activePeriod] : GLOBAL_GSCPI_SERIES[activePeriod];
  const isArchiveWindow = chart.kind === "archive_proxy";
  const isPartial = PERIOD_META[activePeriod].partial === true;
  const specialty = SPECIALTY_CONFIG[specialtyTab];
  const chinaColor = theme.category.blue;
  const globalColor = theme.category.orange;
  const cx = 250;
  const cy = 168;
  const maxR = 108;
  const rings = [20, 40, 60, 80, 100];
  const toPoint = (idx: number, value: number) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / RADAR_AXES.length;
    const r = (value / 100) * maxR;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };
  const poly = (values: number[]) => values.map((v, i) => `${toPoint(i, v).x},${toPoint(i, v).y}`).join(" ");
  const axis = isArchiveWindow
    ? { yMin: 96, yMax: 106, suffix: "", ref: undefined as { value: number; label: string } | undefined }
    : scope === "cn"
      ? { yMin: 46, yMax: 54, suffix: "%", ref: { value: 50, label: lang === "zh" ? "荣枯线 50" : "50" } }
      : { yMin: -0.4, yMax: 2.1, suffix: "", ref: { value: 0, label: lang === "zh" ? "长期均值 0" : "Average 0" } };

  return (
    <Stack gap={32} style={{ padding: 24 }}>
      <Stack gap={8}>
        <Text size="small" weight="semibold" tone="tertiary" style={{ letterSpacing: "0.2em" }}>
          {t(lang, PERIOD_META[activePeriod].label)}
        </Text>
        <H1 style={{ letterSpacing: lang === "zh" ? "0.06em" : "-0.02em" }}>
          {lang === "zh" ? "供应链行业报告" : "Supply Chain Industry Report"}
        </H1>
        <Row gap={10} align="center">
          <div style={{ width: 36, height: 2, background: theme.text.primary, flexShrink: 0 }} />
          <Text size="small" tone="secondary">
            {t(lang, PERIOD_META[activePeriod].range)}
            {scope === "cn"
              ? lang === "zh"
                ? " · 中国物流业景气指数"
                : " · China Logistics Prosperity Index"
              : lang === "zh"
                ? " · 纽约联储 GSCPI，2026 年 10 月修订口径"
                : " · NY Fed GSCPI, October 2026 vintage"}
          </Text>
        </Row>
      </Stack>

      <Stack gap={10} style={{ background: theme.fill.tertiary, borderRadius: 12, padding: 14 }}>
        <Row gap={20} wrap align="center">
          <Row gap={8} align="center">
            <Text size="small" tone="tertiary">{lang === "zh" ? "语言" : "Language"}</Text>
            <Pill active={lang === "zh"} onClick={() => setLang("zh")}>中文</Pill>
            <Pill active={lang === "en"} onClick={() => setLang("en")}>English</Pill>
          </Row>
          <Row gap={8} align="center">
            <Text size="small" tone="tertiary">{lang === "zh" ? "视角" : "Lens"}</Text>
            <Pill active={scope === "cn"} onClick={() => setScope("cn")}>{lang === "zh" ? "中国" : "China"}</Pill>
            <Pill active={scope === "global"} onClick={() => setScope("global")}>{lang === "zh" ? "全球" : "Global"}</Pill>
          </Row>
        </Row>
        <Row gap={8} wrap align="center">
          <Text size="small" tone="tertiary">{lang === "zh" ? "时间" : "Period"}</Text>
          <Pill active={windowMode === "ytd"} onClick={() => { setWindowMode("ytd"); setPeriod("2026YTD"); }}>
            {lang === "zh" ? "年初至今" : "Year to date"}
          </Pill>
          <Pill
            active={windowMode === "quarter"}
            onClick={() => {
              setWindowMode("quarter");
              setPeriod("2026Q3");
            }}
          >
            {lang === "zh" ? "季度" : "Quarter"}
          </Pill>
          <Pill
            active={windowMode === "half"}
            onClick={() => {
              setWindowMode("half");
              setPeriod("2026H2");
            }}
          >
            {lang === "zh" ? "半年" : "Half-year"}
          </Pill>
          {periodOptions.length > 1 ? (
            <Select value={activePeriod} onChange={(value) => setPeriod(value as PeriodId)} options={periodOptions} style={{ width: 220 }} />
          ) : (
            <Text size="small" tone="secondary">{t(lang, PERIOD_META[activePeriod].range)}</Text>
          )}
        </Row>
      </Stack>

      <Stack gap={12} style={{ borderTop: `1px solid ${theme.stroke.tertiary}`, paddingTop: 18 }}>
        <SectionMark index="01" label={lang === "zh" ? "读数" : "Readings"} />
        <Grid columns={4} gap={16}>
          {brief.cards.map((c) => (
            <Stack key={c.value + t(lang, c.label)} gap={0} style={{ borderTop: `2px solid ${theme.text.primary}`, paddingTop: 10 }}>
              <Stat value={c.value} label={t(lang, c.label)} tone={c.tone} />
            </Stack>
          ))}
        </Grid>
      </Stack>

      <Stack gap={10} style={{ borderTop: `1px solid ${theme.stroke.tertiary}`, paddingTop: 18 }}>
        <SectionMark index="02" label={lang === "zh" ? "判断" : "Judgment"} />
      <Callout tone={brief.tone} title={t(lang, brief.headline)}>
        {t(lang, brief.judgment)}
      </Callout>
      {isPartial ? (
        <Callout tone="info" title={lang === "zh" ? "这不是完整的下半年" : "This is not a full second half"}>
          {lang === "zh"
            ? "2026 年下半年目前只收到 7–9 月。10 月以后的官方读数出来之前，不要把它写成全年下半场结论。"
            : "2026 H2 so far only contains July–September. Do not write it up as the full second half until later official readings exist."}
        </Callout>
      ) : null}
      {isArchiveWindow ? (
        <Callout tone="warning" title={lang === "zh" ? "中国 2025 年是代理分" : "China 2025 is a proxy"}>
          {lang === "zh"
            ? "纵轴是档案分，基准=100，不是 LPI 百分数。全球 2025 年已经改用官方 GSCPI，两边单位不同，不能叠在一张图上比较。"
            : "The vertical axis is an archive score, baseline=100, not an LPI percent. Global 2025 now uses official GSCPI. The units differ, so the two series cannot share a chart."}
        </Callout>
      ) : null}
      </Stack>

      <Stack gap={8} style={{ background: theme.fill.tertiary, border: `1px solid ${theme.stroke.tertiary}`, borderRadius: 12, padding: 16 }}>
        <SectionMark index="03" label={lang === "zh" ? "月度路径" : "Monthly path"} />
        <H2>
          {scope === "cn"
            ? lang === "zh"
              ? "中国物流业景气指数"
              : "China Logistics Prosperity Index"
            : lang === "zh"
              ? "全球供应链压力指数"
              : "Global Supply Chain Pressure Index"}
          {" · "}
          {t(lang, PERIOD_META[activePeriod].range)}
        </H2>
        <LineChart
          categories={chart.categories}
          series={[
            {
              name: scope === "cn" ? (isArchiveWindow ? (lang === "zh" ? "档案分" : "Archive score") : "LPI") : "GSCPI",
              data: chart.data,
              tone: scope === "cn" ? "info" : "warning",
            },
          ]}
          beginAtZero={false}
          yMin={axis.yMin}
          yMax={axis.yMax}
          valueSuffix={axis.suffix}
          referenceLines={axis.ref ? [{ value: axis.ref.value, label: axis.ref.label, tone: "neutral" }] : undefined}
          showValues
          height={260}
        />
        <Text size="small" tone="secondary">
          {isArchiveWindow
            ? lang === "zh"
              ? "横轴：月份。纵轴：档案分（基准=100）。来源：本版占位，不是中物联月度值。"
              : "Horizontal axis: month. Vertical axis: archive score (baseline=100). Source: placeholder in this edition, not a CFLP monthly print."
            : scope === "cn"
              ? lang === "zh"
                ? "横轴：月份。纵轴：LPI（%）。50 为荣枯线。1–5 月沿用本报告上半年已引用的中物联读数；6 月由 7 月官方环比回推；7 月 50.4%、8 月 50.9%、9 月 51.5% 来自 2026 年 8–10 月公开月报。"
                : "Horizontal axis: month. Vertical axis: LPI (%). 50 is the expansion line. January–May keep the CFLP prints already cited in the H1 edition; June is implied by the official July change; July 50.4%, August 50.9%, and September 51.5% are the August–October 2026 public releases."
              : lang === "zh"
                ? "横轴：月份。纵轴：标准差，0 为长期均值。来源：纽约联储 GSCPI，2026 年 10 月发布口径。历史值每次发布都会修订。"
                : "Horizontal axis: month. Vertical axis: standard deviations, 0 = long-run average. Source: NY Fed GSCPI, October 2026 vintage. History is revised at every release."}
        </Text>
      </Stack>

      <Stack gap={8} style={{ borderTop: `1px solid ${theme.stroke.tertiary}`, paddingTop: 18 }}>
        <SectionMark index="04" label={lang === "zh" ? "要做的事" : "Moves"} />
        <H3>{lang === "zh" ? `${t(lang, PERIOD_META[activePeriod].label)}，三件要做的事` : `Three moves for ${t(lang, PERIOD_META[activePeriod].label)}`}</H3>
        <Text size="small" tone="secondary">
          {lang === "zh"
            ? "读完上面这条月度路径之后的动作。换时间，判断、图和这张表一起换。"
            : "Actions after reading the monthly path above. The judgment, the chart, and this table change together."}
        </Text>
        <Table
          headers={
            lang === "zh"
              ? [colHead("问题"), colHead("这段时间的事实"), colHead("动作")]
              : [colHead("Question"), colHead("What happened"), colHead("Action")]
          }
          rows={rowsOf(lang, brief.moves)}
          rowTone={["info", "warning", "success"]}
          striped
        />
      </Stack>

      <Stack gap={8} style={{ borderTop: `1px solid ${theme.stroke.tertiary}`, paddingTop: 18 }}>
        <SectionMark index="05" label={lang === "zh" ? "能力结构" : "Capability"} />
      <Card>
        <CardHeader>{lang === "zh" ? "中外能力结构对照" : "China–Global capability structure"}</CardHeader>
        <CardBody>
          <Stack gap={12}>
            <Text size="small" tone="secondary">
              {lang === "zh"
                ? "五个品类的相对成熟度。不是上面那段时间的新数字，换时间分数不变。雷达 0–100，越高越成熟。中国为蓝色实线，全球为橙色虚线。"
                : "Relative maturity across five segments. Not a new figure for the period above; the scores stay put when the period changes. Radar 0–100, higher means more mature. China is the blue solid line, Global the orange dashed line."}
            </Text>
            <Row gap={8} wrap>
              {(Object.keys(SPECIALTY_CONFIG) as SpecialtyTab[]).map((key) => (
                <Pill key={key} active={specialtyTab === key} onClick={() => setSpecialtyTab(key)}>
                  {t(lang, SPECIALTY_CONFIG[key].title)}
                </Pill>
              ))}
            </Row>
            <Grid columns={2} gap={16}>
              <Stack gap={6}>
                <svg viewBox="0 0 500 340" role="img" aria-label={lang === "zh" ? "能力雷达，0到100" : "Capability radar, 0 to 100"} style={{ width: "100%" }}>
                  {rings.map((ring) => {
                    const pts = RADAR_AXES.map((_, i) => {
                      const p = toPoint(i, ring);
                      return `${p.x},${p.y}`;
                    }).join(" ");
                    return <polygon key={ring} points={pts} fill="none" stroke={theme.stroke.tertiary} strokeWidth="1" />;
                  })}
                  {RADAR_AXES.map((axisLabel, i) => {
                    const pEnd = toPoint(i, 100);
                    const pLabel = toPoint(i, 118);
                    return (
                      <g key={axisLabel.en}>
                        <line x1={cx} y1={cy} x2={pEnd.x} y2={pEnd.y} stroke={theme.stroke.tertiary} strokeWidth="1" />
                        <text x={pLabel.x} y={pLabel.y} fill={theme.text.secondary} fontSize="11" textAnchor="middle">
                          {t(lang, axisLabel)}
                        </text>
                      </g>
                    );
                  })}
                  <polygon points={poly(specialty.radar.cn)} fill="none" stroke={chinaColor} strokeWidth="2.4" />
                  <polygon points={poly(specialty.radar.global)} fill="none" stroke={globalColor} strokeWidth="2.4" strokeDasharray="5 4" />
                </svg>
                <Row gap={12}>
                  <Text size="small" style={{ color: chinaColor }}>{lang === "zh" ? "中国 · 实线" : "China · solid"}</Text>
                  <Text size="small" style={{ color: globalColor }}>{lang === "zh" ? "全球 · 虚线" : "Global · dashed"}</Text>
                </Row>
              </Stack>
              <Stack gap={8}>
                <H3>{t(lang, specialty.title)}</H3>
                <Text>{t(lang, specialty.note)}</Text>
                <Row gap={12} wrap>
                  {specialty.stats.map((c) => (
                    <Text key={c.value + t(lang, c.label)} size="small" tone="secondary">
                      {c.value} · {t(lang, c.label)}
                    </Text>
                  ))}
                </Row>
                <Table
                  headers={
                    lang === "zh"
                      ? [colHead("模块"), colHead("结构观察"), colHead("长期做法")]
                      : [colHead("Module"), colHead("Pattern"), colHead("Standing practice")]
                  }
                  rows={rowsOf(lang, specialty.rows)}
                  striped
                />
              </Stack>
            </Grid>
          </Stack>
        </CardBody>
      </Card>
      </Stack>

      <Stack gap={6} style={{ borderTop: `1px solid ${theme.stroke.tertiary}`, paddingTop: 18 }}>
        <SectionMark index="06" label={lang === "zh" ? "来源" : "Sources"} />
        <H3>{lang === "zh" ? "来源与口径" : "Sources and vintage"}</H3>
        <Text>
          1. <Link href="https://www.newyorkfed.org/research/policy/gscpi">New York Fed GSCPI</Link>
          {lang === "zh"
            ? "。9 月 1.28 于 2026-10-06 公布，8 月初值 1.06 同步修订为 1.20。序列对照 2026-10-10 可见的官方修订值。"
            : ". September's 1.28 was released on 2026-10-06, when August was revised from 1.06 to 1.20. The series matches the official revised values visible on 2026-10-10."}
        </Text>
        <Text>
          2. <Link href="https://www.gov.cn/yaowen/liebiao/202610/content_7082976.htm">2026-10-11 中国政府网</Link>
          {lang === "zh" ? "，9 月 LPI 51.5%。" : ", September LPI 51.5%."}{" "}
          <Link href="http://sh.people.com.cn/n2/2026/1013/c134768-41720304.html">人民日报 2026-10-13</Link>
          {lang === "zh" ? "，新订单、预期、设备利用率与东中西部业务总量。" : ", new orders, expectations, utilization, and regional volumes."}
        </Text>
        <Text>
          3. <Link href="https://finance.jrj.com.cn/2026/10/13094058690629.shtml">中物联 9 月解读（金融界转引）</Link>
          {lang === "zh" ? "，成本指数前九个月高于 52%，西部新订单回落 0.5 个百分点，利润指数与 8 月持平。" : ", cost index above 52% for nine months, western new orders down 0.5 point, profit index flat on August."}
        </Text>
        <Text>
          4. <Link href="https://www.gov.cn/yaowen/liebiao/202608/content_7077587.htm">7 月 LPI 50.4%</Link>
          {" · "}
          <Link href="https://www.chinanews.com.cn/cj/2026/09-05/10690932.shtml">8 月 LPI 50.9%</Link>
        </Text>
        <Text tone="secondary">
          {lang === "zh"
            ? "1–5 月中国 LPI 沿用本报告上半年已引用的中物联读数，本轮未逐月重核。6 月 50.6% 由 7 月“较上月回落 0.2 个百分点”回推。2025 年中国月度官方序列本版未核到。上半年报告中的 5 月末 SCFI 与 WCI 没有刷新到 9 月，因此不再放进三季度卡片。"
            : "January–May China LPI keeps the CFLP prints already cited in the H1 edition and was not re-audited month by month. June's 50.6% is implied by July's 0.2-point decline. A citable official China monthly series for 2025 was not found. Late-May SCFI and WCI from the H1 edition were not refreshed through September, so they are no longer in the Q3 cards."}
        </Text>
      </Stack>
    </Stack>
  );
}
