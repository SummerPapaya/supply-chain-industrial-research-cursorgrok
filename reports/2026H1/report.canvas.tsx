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
type WindowMode = "half" | "quarter";
type PeriodId = "2025H2" | "2026H1" | "2025Q3" | "2025Q4" | "2026Q1" | "2026Q2";
type SpecialtyTab = "electronics" | "nev" | "pharma" | "fmcg" | "industrial";

type BiText = { zh: string; en: string };
type MetricCard = { value: string; label: BiText; tone?: "success" | "warning" | "info" | "danger" | "neutral" };
type TripleRow = { a: BiText; b: BiText; c: BiText };
type ChartWindowSeries = { categories: string[]; data: number[]; kind: "official" | "archive_proxy" };
type SpecialtyConfig = {
  title: BiText;
  stats: MetricCard[];
  rows: TripleRow[];
  radar: { cn: number[]; global: number[] };
  note: BiText;
};

const PERIOD_META: Record<PeriodId, { label: BiText; range: BiText }> = {
  "2025H2": {
    label: { zh: "2025年下半年", en: "2025 H2" },
    range: { zh: "时间范围：2025-07 至 2025-12（档案窗口）", en: "Range: 2025-07 to 2025-12 (archive window)" },
  },
  "2026H1": {
    label: { zh: "2026年上半年", en: "2026 H1" },
    range: { zh: "时间范围：2026-01 至 2026-06（已披露口径）", en: "Range: 2026-01 to 2026-06 (published data scope)" },
  },
  "2025Q3": {
    label: { zh: "2025年三季度", en: "2025 Q3" },
    range: { zh: "时间范围：2025-07 至 2025-09（档案窗口）", en: "Range: 2025-07 to 2025-09 (archive window)" },
  },
  "2025Q4": {
    label: { zh: "2025年四季度", en: "2025 Q4" },
    range: { zh: "时间范围：2025-10 至 2025-12（档案窗口）", en: "Range: 2025-10 to 2025-12 (archive window)" },
  },
  "2026Q1": {
    label: { zh: "2026年一季度", en: "2026 Q1" },
    range: { zh: "时间范围：2026-01 至 2026-03", en: "Range: 2026-01 to 2026-03" },
  },
  "2026Q2": {
    label: { zh: "2026年二季度", en: "2026 Q2" },
    range: { zh: "时间范围：2026-04 至 2026-06（6月部分数据滚动中）", en: "Range: 2026-04 to 2026-06 (June data still updating)" },
  },
};

const PERIODS_BY_MODE: Record<WindowMode, PeriodId[]> = {
  half: ["2025H2", "2026H1"],
  quarter: ["2025Q3", "2025Q4", "2026Q1", "2026Q2"],
};

const CN_LPI_SERIES: Record<PeriodId, ChartWindowSeries> = {
  "2025H2": { categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: [99, 100, 101, 101, 102, 103], kind: "archive_proxy" },
  "2026H1": { categories: ["Jan", "Feb", "Mar", "Apr", "May"], data: [51.2, 47.5, 50.2, 49.7, 50.3], kind: "official" },
  "2025Q3": { categories: ["Jul", "Aug", "Sep"], data: [99, 100, 101], kind: "archive_proxy" },
  "2025Q4": { categories: ["Oct", "Nov", "Dec"], data: [101, 102, 103], kind: "archive_proxy" },
  "2026Q1": { categories: ["Jan", "Feb", "Mar"], data: [51.2, 47.5, 50.2], kind: "official" },
  "2026Q2": { categories: ["Apr", "May"], data: [49.7, 50.3], kind: "official" },
};

const GLOBAL_GSCPI_SERIES: Record<PeriodId, ChartWindowSeries> = {
  "2025H2": { categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], data: [96, 95, 94, 95, 96, 97], kind: "archive_proxy" },
  "2026H1": { categories: ["Feb", "Mar", "Apr", "May"], data: [0.54, 0.68, 1.82, 1.82], kind: "official" },
  "2025Q3": { categories: ["Jul", "Aug", "Sep"], data: [96, 95, 94], kind: "archive_proxy" },
  "2025Q4": { categories: ["Oct", "Nov", "Dec"], data: [95, 96, 97], kind: "archive_proxy" },
  "2026Q1": { categories: ["Feb", "Mar"], data: [0.54, 0.68], kind: "official" },
  "2026Q2": { categories: ["Apr", "May"], data: [1.82, 1.82], kind: "official" },
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

function getMetricCards(scope: Scope, period: PeriodId): MetricCard[] {
  if (scope === "cn") {
    if (period === "2025Q3") {
      return [
        { value: "100.0", label: { zh: "档案趋势分值均值", en: "Archive trend score avg." }, tone: "info" },
        { value: "99→101", label: { zh: "季内变化", en: "In-quarter movement" }, tone: "info" },
        { value: "温和回升", label: { zh: "运行特征", en: "Operating condition" }, tone: "success" },
        { value: "基准=100", label: { zh: "档案口径", en: "Archive baseline" }, tone: "neutral" },
      ];
    }
    if (period === "2025Q4") {
      return [
        { value: "102.0", label: { zh: "档案趋势分值均值", en: "Archive trend score avg." }, tone: "success" },
        { value: "101→103", label: { zh: "季内变化", en: "In-quarter movement" }, tone: "success" },
        { value: "持续改善", label: { zh: "运行特征", en: "Operating condition" }, tone: "success" },
        { value: "基准=100", label: { zh: "档案口径", en: "Archive baseline" }, tone: "neutral" },
      ];
    }
    if (period === "2025H2") {
      return [
        { value: "101.0", label: { zh: "档案趋势分值均值", en: "Archive trend score avg." }, tone: "info" },
        { value: "99→103", label: { zh: "半年度趋势", en: "Half-year trend" }, tone: "success" },
        { value: "稳中向好", label: { zh: "运行特征", en: "Operating condition" }, tone: "success" },
        { value: "基准=100", label: { zh: "档案口径", en: "Archive baseline" }, tone: "neutral" },
      ];
    }
    if (period === "2026Q1") {
      return [
        { value: "49.6%", label: { zh: "LPI季度均值", en: "LPI quarterly average" }, tone: "info" },
        { value: "51.2→47.5→50.2", label: { zh: "季内波动路径", en: "In-quarter path" }, tone: "warning" },
        { value: "修复中", label: { zh: "供应链运行状态", en: "Supply chain state" }, tone: "info" },
        { value: "54.2%", label: { zh: "业务活动预期（3月）", en: "Business expectation (Mar)" }, tone: "success" },
      ];
    }
    if (period === "2026Q2") {
      return [
        { value: "50.3%", label: { zh: "LPI（5月）", en: "LPI (May)" }, tone: "success" },
        { value: "49.7→50.3", label: { zh: "二季度修复轨迹", en: "Q2 recovery path" }, tone: "info" },
        { value: "56.3%", label: { zh: "业务活动预期（4月）", en: "Business expectation (Apr)" }, tone: "success" },
        { value: "53.7%", label: { zh: "固定资产投资指数（4月）", en: "Fixed-asset investment index (Apr)" }, tone: "info" },
      ];
    }
    return [
      { value: "50.3%", label: { zh: "LPI（5月）", en: "LPI (May)" }, tone: "success" },
      { value: "47.5→50.3", label: { zh: "2-5月修复", en: "Recovery from Feb to May" }, tone: "info" },
      { value: "扩张区间", label: { zh: "景气状态", en: "Expansion zone" }, tone: "success" },
      { value: "韧性增强", label: { zh: "产业链协同性", en: "Stronger chain coordination" }, tone: "info" },
    ];
  }

  if (period === "2025Q3") {
    return [
      { value: "95.0", label: { zh: "档案趋势分值均值", en: "Archive trend score avg." }, tone: "warning" },
      { value: "96→94", label: { zh: "季内变化", en: "In-quarter movement" }, tone: "warning" },
      { value: "压力缓升", label: { zh: "供应链信号", en: "Supply chain signal" }, tone: "warning" },
      { value: "基准=100", label: { zh: "档案口径", en: "Archive baseline" }, tone: "neutral" },
    ];
  }
  if (period === "2025Q4") {
    return [
      { value: "96.0", label: { zh: "档案趋势分值均值", en: "Archive trend score avg." }, tone: "info" },
      { value: "95→97", label: { zh: "季内变化", en: "In-quarter movement" }, tone: "info" },
      { value: "震荡修复", label: { zh: "供应链信号", en: "Supply chain signal" }, tone: "info" },
      { value: "基准=100", label: { zh: "档案口径", en: "Archive baseline" }, tone: "neutral" },
    ];
  }
  if (period === "2025H2") {
    return [
      { value: "95.5", label: { zh: "档案趋势分值均值", en: "Archive trend score avg." }, tone: "info" },
      { value: "96→97", label: { zh: "半年度趋势", en: "Half-year trend" }, tone: "info" },
      { value: "先压后稳", label: { zh: "运行特征", en: "Operating condition" }, tone: "warning" },
      { value: "基准=100", label: { zh: "档案口径", en: "Archive baseline" }, tone: "neutral" },
    ];
  }
  if (period === "2026Q1") {
    return [
      { value: "1.9%", label: { zh: "WTO 2026货物贸易基线", en: "WTO 2026 merchandise baseline" }, tone: "info" },
      { value: "0.68", label: { zh: "GSCPI（3月）", en: "GSCPI (Mar)" }, tone: "warning" },
      { value: "51.3", label: { zh: "全球制造业PMI（3月）", en: "Global Manufacturing PMI (Mar)" }, tone: "info" },
      { value: "压力抬升", label: { zh: "供应链信号", en: "Supply chain signal" }, tone: "warning" },
    ];
  }
  if (period === "2026Q2") {
    return [
      { value: "1.82", label: { zh: "GSCPI（4月）", en: "GSCPI (Apr)" }, tone: "warning" },
      { value: "2571.73", label: { zh: "SCFI（5/29）", en: "SCFI (May 29)" }, tone: "warning" },
      { value: "$2,800/FEU", label: { zh: "WCI（5/28）", en: "WCI (May 28)" }, tone: "warning" },
      { value: "高波动", label: { zh: "运行特征", en: "Operating condition" }, tone: "danger" },
    ];
  }
  return [
    { value: "1.9%", label: { zh: "WTO 2026货物贸易基线", en: "WTO 2026 merchandise baseline" }, tone: "info" },
    { value: "1.82", label: { zh: "GSCPI（4月）", en: "GSCPI (Apr)" }, tone: "warning" },
    { value: "2571.73", label: { zh: "SCFI（5/29）", en: "SCFI (May 29)" }, tone: "warning" },
    { value: "$2,800/FEU", label: { zh: "WCI（5/28）", en: "WCI (May 28)" }, tone: "warning" },
  ];
}

function getDynamics(scope: Scope): TripleRow[] {
  if (scope === "cn") {
    return [
      {
        a: { zh: "物流景气修复", en: "Logistics sentiment recovery" },
        b: { zh: "春节扰动后需求逐步回暖", en: "Demand gradually recovered after holiday disruption" },
        c: { zh: "补库与履约效率同步改善", en: "Restocking and fulfillment efficiency improved together" },
      },
      {
        a: { zh: "产业链协同增强", en: "Stronger chain coordination" },
        b: { zh: "制造端与物流端联动增强", en: "Manufacturing and logistics coordination strengthened" },
        c: { zh: "对计划弹性提出更高要求", en: "Higher requirements for planning agility" },
      },
      {
        a: { zh: "跨境与内贸并行", en: "Cross-border and domestic parallel growth" },
        b: { zh: "跨境履约与内需物流同步发力", en: "Cross-border fulfillment and domestic logistics grew together" },
        c: { zh: "仓配网络需统一调度", en: "Warehouse and distribution networks need unified orchestration" },
      },
    ];
  }
  return [
    {
      a: { zh: "结构性波动常态化", en: "Structural volatility is the new normal" },
      b: { zh: "地缘与政策扰动持续", en: "Geopolitical and policy volatility persisted" },
      c: { zh: "供应链策略从效率转向韧性+价值", en: "Strategy shifted from pure efficiency to resilience + value" },
    },
    {
      a: { zh: "海运风险溢价维持", en: "Shipping risk premium remains" },
      b: { zh: "关键航线运价在Q2抬升", en: "Key route freight rates rose in Q2" },
      c: { zh: "成本和交付稳定性双承压", en: "Both cost and delivery stability came under pressure" },
    },
    {
      a: { zh: "AI驱动供给约束外溢", en: "AI-driven supply constraints spilled over" },
      b: { zh: "先进制程/封装资源趋紧", en: "Advanced node/packaging capacity tightened" },
      c: { zh: "采购与产能锁定成为重点", en: "Procurement and capacity locking became critical" },
    },
  ];
}

function getTopics(scope: Scope): TripleRow[] {
  if (scope === "cn") {
    return [
      {
        a: { zh: "关键料保障", en: "Critical material assurance" },
        b: { zh: "双供与替代BOM管理提速", en: "Dual sourcing and substitute BOM acceleration" },
        c: { zh: "建立Top料号保供看板", en: "Build top-SKU assurance dashboard" },
      },
      {
        a: { zh: "跨境履约", en: "Cross-border fulfillment" },
        b: { zh: "仓网与口岸协同成为竞争点", en: "Warehouse-port orchestration became a differentiator" },
        c: { zh: "优化前置仓与海外仓联动", en: "Optimize forward and overseas warehouse linkage" },
      },
      {
        a: { zh: "AI计划与调度", en: "AI planning and scheduling" },
        b: { zh: "预测与异常响应速度提升", en: "Forecasting and exception response improved" },
        c: { zh: "形成人机协同闭环", en: "Build human-in-the-loop closed loop" },
      },
    ];
  }
  return [
    {
      a: { zh: "区域化重构", en: "Regional reconfiguration" },
      b: { zh: "Near/Friend-shoring持续推进", en: "Near/friend-shoring continued" },
      c: { zh: "从备份供应商走向网络设计", en: "Move from backup suppliers to network design" },
    },
    {
      a: { zh: "Agentic AI采购", en: "Agentic AI procurement" },
      b: { zh: "AI从试点走向流程嵌入", en: "AI moved from pilots to workflow embedding" },
      c: { zh: "同步强化治理、审计和权限", en: "Strengthen governance, audit, and access control" },
    },
    {
      a: { zh: "供应链金融与现金流", en: "Supply chain finance and cash flow" },
      b: { zh: "高波动下资金效率更关键", en: "Cash efficiency became more critical in high volatility" },
      c: { zh: "推进动态折扣与在途可视化", en: "Advance dynamic discounting and in-transit visibility" },
    },
  ];
}

function rowsOf(lang: Lang, rows: TripleRow[]) {
  return rows.map((r) => [t(lang, r.a), t(lang, r.b), t(lang, r.c)]);
}

export default function SupplyChainReport2026H1() {
  const [lang, setLang] = useCanvasState<Lang>("report-lang", "zh");
  const [scope, setScope] = useCanvasState<Scope>("report-scope", "cn");
  const [windowMode, setWindowMode] = useCanvasState<WindowMode>("report-window-mode", "half");
  const [period, setPeriod] = useCanvasState<PeriodId>("report-period", "2026H1");
  const [specialtyTab, setSpecialtyTab] = useCanvasState<SpecialtyTab>("report-specialty-tab", "electronics");
  const theme = useHostTheme();

  const periodOptions = PERIODS_BY_MODE[windowMode].map((id) => ({
    value: id,
    label: t(lang, PERIOD_META[id].label),
  }));
  const activePeriod = PERIODS_BY_MODE[windowMode].includes(period) ? period : PERIODS_BY_MODE[windowMode][0];
  const cards = getMetricCards(scope, activePeriod);

  const chart = scope === "cn" ? CN_LPI_SERIES[activePeriod] : GLOBAL_GSCPI_SERIES[activePeriod];
  const isArchiveWindow = chart.kind === "archive_proxy";
  const specialty = SPECIALTY_CONFIG[specialtyTab];
  const radarValues = specialty.radar;
  const radarChina = radarValues.cn;
  const radarGlobal = radarValues.global;
  const chinaColor = theme.category.blue;
  const globalColor = theme.category.orange;
  const cx = 260;
  const cy = 190;
  const maxR = 120;
  const rings = [20, 40, 60, 80, 100];
  const toPoint = (idx: number, value: number) => {
    const angle = -Math.PI / 2 + (idx * 2 * Math.PI) / RADAR_AXES.length;
    const r = (value / 100) * maxR;
    return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
  };
  const poly = (values: number[]) => values.map((v, i) => `${toPoint(i, v).x},${toPoint(i, v).y}`).join(" ");

  return (
    <Stack gap={16} style={{ padding: 20 }}>
      <H1>{lang === "zh" ? "供应链行业报告（可切换中英文与时间窗口）" : "Supply Chain Industry Report (Language + Time Window Switchable)"}</H1>
      <Text tone="secondary">
        {lang === "zh"
          ? "该版本支持：中文/英文切换、半年/季度窗口切换、中国/全球市场视角切换，并支持2025Q3~2026Q2档案浏览。"
          : "This version supports Chinese/English switching, half-year/quarter windows, China/global views, and archive browsing from 2025Q3 to 2026Q2."}
      </Text>

      <Card>
        <CardHeader>{lang === "zh" ? "报告控制面板" : "Report Control Panel"}</CardHeader>
        <CardBody>
          <Stack gap={10}>
            <Row gap={8}>
              <Pill active={lang === "zh"} onClick={() => setLang("zh")}>
                中文
              </Pill>
              <Pill active={lang === "en"} onClick={() => setLang("en")}>
                English
              </Pill>
              <Pill active={scope === "cn"} onClick={() => setScope("cn")}>
                {lang === "zh" ? "中国市场" : "China Market"}
              </Pill>
              <Pill active={scope === "global"} onClick={() => setScope("global")}>
                {lang === "zh" ? "全球市场" : "Global Market"}
              </Pill>
            </Row>
            <Row gap={8}>
              <Select
                value={windowMode}
                onChange={(value) => {
                  const nextMode = value as WindowMode;
                  setWindowMode(nextMode);
                  setPeriod(PERIODS_BY_MODE[nextMode][0]);
                }}
                options={[
                  { value: "half", label: lang === "zh" ? "半年窗口" : "Half-year window" },
                  { value: "quarter", label: lang === "zh" ? "季度窗口" : "Quarter window" },
                ]}
                style={{ width: 220 }}
              />
              <Select value={activePeriod} onChange={(value) => setPeriod(value as PeriodId)} options={periodOptions} style={{ width: 220 }} />
            </Row>
          </Stack>
        </CardBody>
      </Card>

      <Callout tone="info" title={lang === "zh" ? t(lang, PERIOD_META[activePeriod].label) : t(lang, PERIOD_META[activePeriod].label)}>
        {t(lang, PERIOD_META[activePeriod].range)}
      </Callout>
      {isArchiveWindow ? (
        <Callout tone="warning" title={lang === "zh" ? "档案窗口说明" : "Archive Window Note"}>
          {lang === "zh"
            ? "2025Q3/Q4 与 2025H2 图表为时间序列档案代理分值（基准=100），用于跨期趋势对比，不等同官方原始统计值。"
            : "Charts for 2025Q3/Q4 and 2025H2 use archive proxy trend scores (baseline=100) for cross-period comparison, and are not official raw statistics."}
        </Callout>
      ) : null}

      <H2>{lang === "zh" ? "一、核心指标概览" : "1. Key Metrics Overview"}</H2>
      <Grid columns={4} gap={12}>
        {cards.map((c) => (
          <Stat key={c.value + t(lang, c.label)} value={c.value} label={t(lang, c.label)} tone={c.tone} />
        ))}
      </Grid>

      <H2>{lang === "zh" ? "二、行业动态" : "2. Industry Dynamics"}</H2>
      <Table
        headers={
          lang === "zh"
            ? ["主题", "本期观察", "影响与含义"]
            : ["Theme", "What Happened", "Implication"]
        }
        rows={rowsOf(lang, getDynamics(scope))}
        striped
      />

      <H2>{lang === "zh" ? "三、市场表现" : "3. Market Performance"}</H2>
      <H3>
        {scope === "cn"
          ? lang === "zh"
            ? "中国物流业景气指数（LPI）"
            : "China Logistics Prosperity Index (LPI)"
          : lang === "zh"
            ? "全球供应链压力指数（GSCPI）"
            : "Global Supply Chain Pressure Index (GSCPI)"}
      </H3>
      <Text tone="secondary">
        {isArchiveWindow
          ? lang === "zh"
            ? "X轴=月份；Y轴=趋势分值（基准=100）。该窗口用于档案式趋势浏览。"
            : "X-axis = month; Y-axis = trend score (baseline=100). This window is for archive-style trend browsing."
          : scope === "cn"
            ? lang === "zh"
              ? "X轴=月份；Y轴=LPI（%）。来源：中物联，窗口内可得月度值。"
              : "X-axis = month; Y-axis = LPI (%). Source: CFLP monthly releases within the selected window."
            : lang === "zh"
              ? "X轴=月份；Y轴=GSCPI（点）。来源：纽约联储。"
              : "X-axis = month; Y-axis = GSCPI (points). Source: Federal Reserve Bank of New York."}
      </Text>
      <LineChart
        categories={chart.categories}
        series={[
          {
            name:
              scope === "cn"
                ? lang === "zh"
                  ? "LPI"
                  : "LPI"
                : lang === "zh"
                  ? "GSCPI"
                  : "GSCPI",
            data: chart.data,
            tone: scope === "cn" ? "info" : "warning",
          },
        ]}
        valueSuffix={isArchiveWindow ? "" : scope === "cn" ? "%" : ""}
        height={280}
      />

      <H2>{lang === "zh" ? "四、热门议题" : "4. Hot Topics"}</H2>
      <Table
        headers={
          lang === "zh"
            ? ["议题", "窗口内信号", "建议动作"]
            : ["Topic", "Signal in Window", "Recommended Action"]
        }
        rows={rowsOf(lang, getTopics(scope))}
        striped
      />

      <H2>{lang === "zh" ? "五、趋势与下阶段建议" : "5. Trends and Next-stage Actions"}</H2>
      <Table
        headers={
          lang === "zh"
            ? ["方向", "趋势判断", "执行建议"]
            : ["Direction", "Trend Assessment", "Execution Advice"]
        }
        rows={
          lang === "zh"
            ? [
                ["网络韧性", "从单点优化走向多节点网络优化", "建立双供覆盖率与切换演练机制"],
                ["计划体系", "静态计划转向情景化滚动计划", "在S&OP中引入关税/运价/交期联动仿真"],
                ["数智化", "AI从分析走向执行闭环", "优先落地预测-预警-处置三段式自动化"],
              ]
            : [
                ["Network Resilience", "From point optimization to multi-node network optimization", "Establish dual-source coverage and switch-over drills"],
                ["Planning System", "From static planning to scenario-based rolling planning", "Introduce tariff/freight/lead-time simulation into S&OP"],
                ["Digital Intelligence", "AI is moving from analytics to execution loops", "Prioritize forecast-alert-response automation"],
              ]
        }
        striped
      />

      <H2>{lang === "zh" ? "六、行业细分与雷达图对比" : "6. Segment Deep-dive & Radar Comparison"}</H2>
      <Text tone="secondary">
        {lang === "zh"
          ? "点击品类查看细分结论，雷达图展示中国与全球在关键供应链能力上的相对对比。"
          : "Switch segment tabs to view deep dives. The radar compares China vs. global relative capabilities on key supply-chain dimensions."}
      </Text>
      <Row gap={8} wrap>
        <Pill active={specialtyTab === "electronics"} onClick={() => setSpecialtyTab("electronics")}>
          {t(lang, SPECIALTY_CONFIG.electronics.title)}
        </Pill>
        <Pill active={specialtyTab === "nev"} onClick={() => setSpecialtyTab("nev")}>
          {t(lang, SPECIALTY_CONFIG.nev.title)}
        </Pill>
        <Pill active={specialtyTab === "pharma"} onClick={() => setSpecialtyTab("pharma")}>
          {t(lang, SPECIALTY_CONFIG.pharma.title)}
        </Pill>
        <Pill active={specialtyTab === "fmcg"} onClick={() => setSpecialtyTab("fmcg")}>
          {t(lang, SPECIALTY_CONFIG.fmcg.title)}
        </Pill>
        <Pill active={specialtyTab === "industrial"} onClick={() => setSpecialtyTab("industrial")}>
          {t(lang, SPECIALTY_CONFIG.industrial.title)}
        </Pill>
      </Row>
      <Grid columns={4} gap={12}>
        {specialty.stats.map((c) => (
          <Stat key={c.value + t(lang, c.label)} value={c.value} label={t(lang, c.label)} tone={c.tone} />
        ))}
      </Grid>
      <Table
        headers={lang === "zh" ? ["模块", "阶段观察", "建议动作"] : ["Module", "Observed Pattern", "Recommended Action"]}
        rows={rowsOf(lang, specialty.rows)}
        striped
      />
      <H3>{lang === "zh" ? "能力雷达图（中国 vs 全球）" : "Capability Radar (China vs Global)"}</H3>
      <Text tone="secondary">
        {lang === "zh"
          ? "图表说明：X轴为能力维度；径向刻度为相对能力分值（0-100，越高代表相对成熟度越高）。"
          : "Chart note: Axes are capability dimensions; radial scale is relative capability score (0-100, higher means stronger maturity)."}
      </Text>
      <svg viewBox="0 0 520 380" style={{ width: "100%", maxWidth: 760 }}>
        {rings.map((ring) => {
          const pts = RADAR_AXES.map((_, i) => {
            const p = toPoint(i, ring);
            return `${p.x},${p.y}`;
          }).join(" ");
          return <polygon key={ring} points={pts} fill="none" stroke={theme.stroke.tertiary} strokeWidth="1" />;
        })}
        {RADAR_AXES.map((axis, i) => {
          const pEnd = toPoint(i, 100);
          const pLabel = toPoint(i, 114);
          return (
            <g key={axis.en}>
              <line x1={cx} y1={cy} x2={pEnd.x} y2={pEnd.y} stroke={theme.stroke.tertiary} strokeWidth="1" />
              <text x={pLabel.x} y={pLabel.y} fill={theme.text.secondary} fontSize="11" textAnchor="middle">
                {t(lang, axis)}
              </text>
            </g>
          );
        })}
        <polygon points={poly(radarChina)} fill="none" stroke={chinaColor} strokeWidth="2.4" />
        <polygon points={poly(radarGlobal)} fill="none" stroke={globalColor} strokeWidth="2.4" strokeDasharray="5 4" />
      </svg>
      <Row gap={12}>
        <Text tone="secondary" style={{ color: chinaColor }}>
          {lang === "zh" ? "中国（蓝色实线）" : "China (Blue Solid Line)"}
        </Text>
        <Text tone="secondary" style={{ color: globalColor }}>
          {lang === "zh" ? "全球（橙色虚线）" : "Global (Orange Dashed Line)"}
        </Text>
      </Row>
      <Callout tone="info" title={t(lang, specialty.title)}>
        {t(lang, specialty.note)}
      </Callout>

      <H2>{lang === "zh" ? "七、参考来源" : "7. Sources"}</H2>
      <Stack gap={6}>
        <Text>1. <Link href="https://www.newyorkfed.org/research/policy/gscpi">Federal Reserve Bank of New York - GSCPI</Link></Text>
        <Text>2. <Link href="https://www.wto.org/english/res_e/booksp_e/gtos0326_e.pdf">WTO - Global Trade Outlook and Statistics (Mar 2026)</Link></Text>
        <Text>3. <Link href="https://www.sse.net.cn/index/singleIndex?indexType=scfi">Shanghai Shipping Exchange - SCFI</Link></Text>
        <Text>4. <Link href="https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry">Drewry - World Container Index</Link></Text>
        <Text>5. <Link href="http://www.cflp.org.cn/">China Federation of Logistics and Purchasing (LPI releases)</Link></Text>
      </Stack>
    </Stack>
  );
}
