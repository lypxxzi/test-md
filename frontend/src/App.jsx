import React, { useState, useEffect } from 'react'
import { 
  Database, ClipboardList, Activity, ShoppingCart, 
  Plus, Check, X, RefreshCw, ChevronDown, ChevronRight, 
  AlertTriangle, ShieldCheck, Play, Layers, FileText, ArrowRight, Info,
  RotateCcw, Factory, ClipboardCheck
} from 'lucide-react'

// --- 7大物料分类定义 ---
// 原料、配方、配方产品、中间品、产品、内包材、外包材
const MATERIAL_TYPES = ["原料", "配方", "配方产品", "中间品", "产品", "内包材", "外包材"];

// --- 智能预置数据 ---
const INITIAL_MATERIALS = [
  { id: "M001", code: "MAT-RAW-GLY", name: "甘油原液", type: "原料", status: 1, unit: "kg", bomCode: "" },
  { id: "M002", code: "MAT-RAW-HA", name: "精纯透明质酸钠", type: "原料", status: 1, unit: "g", bomCode: "" },
  { id: "M003", code: "MAT-RAW-H2O", name: "纯净高EDI水", type: "原料", status: 1, unit: "kg", bomCode: "" },
  { id: "M004", code: "MAT-PAC-BTL", name: "50ml真空喷雾玻璃瓶", type: "内包材", status: 1, unit: "个", bomCode: "" },
  { id: "M005", code: "MAT-PAC-BOX", name: "玻尿酸精装外包装盒", type: "外包材", status: 1, unit: "个", bomCode: "" },
  // 配方、配方产品、中间品、产品：创建时会自动或手动绑定对应的BOM
  { id: "M006", code: "MAT-FML-BNS", name: "玻尿酸高保湿舒缓配方", type: "配方", status: 1, unit: "L", bomCode: "BOM-FML-01" },
  { id: "M007", code: "MAT-FMP-BNS", name: "玻尿酸高舒缓原液半成品", type: "配方产品", status: 1, unit: "L", bomCode: "BOM-FMP-01" },
  { id: "M008", code: "MAT-MID-BNS", name: "玻尿酸原液内包半成品 (50ml瓶装)", type: "中间品", status: 1, unit: "支", bomCode: "BOM-MID-01" },
  { id: "M009", code: "MAT-PRD-BNS", name: "玻尿酸修护补水精华液 (成品外盒装)", type: "产品", status: 1, unit: "盒", bomCode: "BOM-PRD-01" }
];

// --- 5合1级联BOM主表预置数据 ---
const INITIAL_BOMS = [
  // 1. 配方BOM (原料组成)
  { id: "B001", code: "BOM-FML-01", name: "玻尿酸舒缓配方标准BOM", materialCode: "MAT-FML-BNS", type: "配方", version: "V1.0", status: 1 },
  // 2. 配方产品BOM (配方组成)
  { id: "B002", code: "BOM-FMP-01", name: "玻尿酸舒缓原液半成品标准BOM", materialCode: "MAT-FMP-BNS", type: "配方产品", version: "V1.0", status: 1 },
  // 3. 中间品BOM (配方产品 + 内包材组成)
  { id: "B003", code: "BOM-MID-01", name: "玻尿酸原液内包半成品标准BOM", materialCode: "MAT-MID-BNS", type: "中间品", version: "V1.0", status: 1 },
  // 4. 产品BOM (中间品 + 外包材组成)
  { id: "B004", code: "BOM-PRD-01", name: "玻尿酸成品标准盒装BOM", materialCode: "MAT-PRD-BNS", type: "产品", version: "V1.0", status: 1 }
];

// --- BOM明细表 ---
const INITIAL_BOM_ITEMS = [
  // 配方BOM明细 (由原料组成)
  { id: "BI001", bomId: "B001", materialCode: "MAT-RAW-GLY", materialName: "甘油原液", ratio: 15.0, type: "原料" },
  { id: "BI002", bomId: "B001", materialCode: "MAT-RAW-HA", materialName: "精纯透明质酸钠", ratio: 2.5, type: "原料" },
  { id: "BI003", bomId: "B001", materialCode: "MAT-RAW-H2O", materialName: "纯净高EDI水", ratio: 82.5, type: "原料" },
  
  // 配方产品BOM明细 (由配方组成)
  { id: "BI004", bomId: "B002", materialCode: "MAT-FML-BNS", materialName: "玻尿酸高保湿舒缓配方", ratio: 100.0, type: "配方" },
  
  // 中间品BOM明细 (由配方产品 + 内包材组成)
  { id: "BI005", bomId: "B003", materialCode: "MAT-FMP-BNS", materialName: "玻尿酸高舒缓原液半成品", ratio: 100.0, type: "配方产品" },
  { id: "BI006", bomId: "B003", materialCode: "MAT-PAC-BTL", materialName: "50ml真空喷雾玻璃瓶", ratio: 100.0, type: "内包材" }, // 支装消耗比为1:1
  
  // 产品BOM明细 (由中间品 + 外包材组成)
  { id: "BI007", bomId: "B004", materialCode: "MAT-MID-BNS", materialName: "玻尿酸原液内包半成品 (50ml瓶装)", ratio: 100.0, type: "中间品" },
  { id: "BI008", bomId: "B004", materialCode: "MAT-PAC-BOX", materialName: "玻尿酸精装外包装盒", ratio: 100.0, type: "外包材" }
];

// --- BOM工艺步骤表 ---
const INITIAL_BOM_STEPS = [
  // 配方工艺步骤
  { id: "BS001", bomId: "B001", stepNum: 1, desc: "原料无菌计量投料并静置脱泡" },
  { id: "BS002", bomId: "B001", stepNum: 2, desc: "恒温反应釜高剪切搅拌乳化" },
  // 配方产品工艺步骤
  { id: "BS003", bomId: "B002", stepNum: 1, desc: "乳化原液滤网物理多级精滤" },
  // 中间品工艺步骤
  { id: "BS004", bomId: "B003", stepNum: 1, desc: "玻璃瓶无菌空气吹扫与灭菌" },
  { id: "BS005", bomId: "B003", stepNum: 2, desc: "高精度气动定量灌装并套泵头压紧密封" },
  // 产品工艺步骤
  { id: "BS006", bomId: "B004", stepNum: 1, desc: "瓶身人工贴标并外包装喷码" },
  { id: "BS007", bomId: "B004", stepNum: 2, desc: "装入精装礼盒并覆盖塑封防伪膜" }
];

// --- BOM步骤投料明细 (物料投入在哪个工艺步骤上) ---
const INITIAL_BOM_STEP_FEEDS = [
  // 玻尿酸配方投料
  { id: "BF001", bomId: "B001", stepNum: 1, materialCode: "MAT-RAW-GLY", materialName: "甘油原液" },
  { id: "BF002", bomId: "B001", stepNum: 1, materialCode: "MAT-RAW-HA", materialName: "精纯透明质酸钠" },
  { id: "BF003", bomId: "B001", stepNum: 1, materialCode: "MAT-RAW-H2O", materialName: "纯净高EDI水" },
  // 玻尿酸中间品投料
  { id: "BF004", bomId: "B003", stepNum: 1, materialCode: "MAT-PAC-BTL", materialName: "50ml真空喷雾玻璃瓶" },
  { id: "BF005", bomId: "B003", stepNum: 2, materialCode: "MAT-FMP-BNS", materialName: "玻尿酸高舒缓原液半成品" },
  // 玻尿酸产品投料
  { id: "BF006", bomId: "B004", stepNum: 1, materialCode: "MAT-MID-BNS", materialName: "玻尿酸原液内包半成品 (50ml瓶装)" },
  { id: "BF007", bomId: "B004", stepNum: 2, materialCode: "MAT-PAC-BOX", materialName: "玻尿酸精装外包装盒" }
];

// --- BOM步骤参数配置表 ---
const INITIAL_BOM_PARAMS = [
  { id: "BP001", stepId: "BS001", name: "高EDI水初始电导率", planVal: 0.1, unit: "μS/cm", maxVal: 0.2, minVal: 0 },
  { id: "BP002", stepId: "BS002", name: "反应釜加热温度", planVal: 45, unit: "℃", maxVal: 50, minVal: 40 },
  { id: "BP003", stepId: "BS002", name: "搅拌主轴转速", planVal: 120, unit: "r/min", maxVal: 150, minVal: 100 },
  { id: "BP004", stepId: "BS005", name: "定量灌装精准容积", planVal: 50.5, unit: "ml", maxVal: 51.0, minVal: 50.0 },
  { id: "BP005", stepId: "BS007", name: "封口热缩炉工作温度", planVal: 140, unit: "℃", maxVal: 150, minVal: 130 }
];

// --- 批次库存预置 ---
const INITIAL_BATCHES = [
  { id: "BAT001", batchNo: "BT260601A1", materialCode: "MAT-RAW-GLY", materialName: "甘油原液", type: 1, mfgDate: "2026-05-15", expDate: "2028-05-14", stockQty: 300, qcStatus: 1 },
  { id: "BAT002", batchNo: "BT260601A2", materialCode: "MAT-RAW-HA", materialName: "精纯透明质酸钠", type: 1, mfgDate: "2026-05-10", expDate: "2028-05-09", stockQty: 200, qcStatus: 1 },
  { id: "BAT003", batchNo: "BT260601A3", materialCode: "MAT-RAW-H2O", materialName: "纯净高EDI水", type: 1, mfgDate: "2026-06-01", expDate: "2027-05-31", stockQty: 1000, qcStatus: 1 },
  { id: "BAT004", batchNo: "BT260601A4", materialCode: "MAT-PAC-BTL", materialName: "50ml真空喷雾玻璃瓶", type: 1, mfgDate: "2026-04-12", expDate: "2031-04-11", stockQty: 600, qcStatus: 1 },
  { id: "BAT005", batchNo: "BT260601A5", materialCode: "MAT-PAC-BOX", materialName: "玻尿酸精装外包装盒", type: 1, mfgDate: "2026-04-15", expDate: "2031-04-14", stockQty: 400, qcStatus: 1 }
];

// --- 计划单与生产单 ---
const INITIAL_PLANS = [
  { id: "PL20260602001", code: "PL20260602001", materialCode: "MAT-PRD-BNS", materialName: "玻尿酸修护补水精华液 (成品外盒装)", bomCode: "BOM-PRD-01", targetQty: 200, planStartDate: "2026-06-03", planEndDate: "2026-06-05", status: 2, downQty: 0 }
];

const REWORK_TYPES = ["外包返工", "内包返工", "配制返工", "品质整改"];

const REWORK_STATUS_META = {
  draft: { label: "草稿", badge: "bg-slate-100 text-slate-600" },
  pending: { label: "待审核", badge: "bg-amber-100 text-amber-800" },
  approved: { label: "待下派", badge: "bg-sky-100 text-sky-800" },
  in_progress: { label: "生产中", badge: "bg-indigo-100 text-indigo-800" },
  completed: { label: "已完工", badge: "bg-emerald-100 text-emerald-800" },
  forced: { label: "强制完工", badge: "bg-rose-100 text-rose-700" },
  closed: { label: "已关闭", badge: "bg-slate-800 text-white" }
};

const INITIAL_REWORK_ORDERS = [
  {
    id: "RW001",
    code: "RWK20260601-001",
    type: "外包返工",
    reason: "上市批次外盒喷码模糊，需拆箱返修",
    planStart: "2026-06-06",
    planEnd: "2026-06-07",
    status: "pending",
    remark: "质检部触发，需在72小时内完成返工",
    requester: "生产工艺员A",
    createTime: "2026-06-02 09:00",
    details: [
      {
        id: "RWD001",
        materialCode: "MAT-PRD-BNS",
        materialName: "玻尿酸修护补水精华液 (成品外盒装)",
        batchId: "BAT005",
        batchNo: "BT260601A5",
        reworkQty: 80,
        bomCode: "BOM-PRD-01",
        reworkType: "外包返工",
        remark: "外盒喷码瑕疵需拆箱更换"
      }
    ]
  }
];

const INITIAL_REWORK_PRODUCTIONS = [];

export default function App() {
  const [activeMenu, setActiveMenu] = useState("materials"); // materials, boms, plans, production, batches, requisitions, purchases, reworkOrders, reworkExecution
  const [sidebarExpanded, setSidebarExpanded] = useState({ basic: true, plan: true, prod: true, pur: true, rework: true });

  // 基础状态定义
  const [materials, setMaterials] = useState(() => JSON.parse(localStorage.getItem("b_materials")) || INITIAL_MATERIALS);
  const [boms, setBoms] = useState(() => JSON.parse(localStorage.getItem("b_boms")) || INITIAL_BOMS);
  const [bomItems, setBomItems] = useState(() => JSON.parse(localStorage.getItem("b_bom_items")) || INITIAL_BOM_ITEMS);
  const [bomSteps, setBomSteps] = useState(() => JSON.parse(localStorage.getItem("b_bom_steps")) || INITIAL_BOM_STEPS);
  const [bomStepFeeds, setBomStepFeeds] = useState(() => JSON.parse(localStorage.getItem("b_bom_step_feeds")) || INITIAL_BOM_STEP_FEEDS);
  const [bomParams, setBomParams] = useState(() => JSON.parse(localStorage.getItem("b_bom_params")) || INITIAL_BOM_PARAMS);
  const [batches, setBatches] = useState(() => JSON.parse(localStorage.getItem("b_batches")) || INITIAL_BATCHES);

  // 业务订单状态定义
  const [plans, setPlans] = useState(() => JSON.parse(localStorage.getItem("b_plans")) || INITIAL_PLANS);
  const [productionOrders, setProductionOrders] = useState(() => JSON.parse(localStorage.getItem("b_prods")) || []);
  const [requisitions, setRequisitions] = useState(() => JSON.parse(localStorage.getItem("b_reqs")) || []);
  const [purchases, setPurchases] = useState(() => JSON.parse(localStorage.getItem("b_purchs")) || []);
  const [stockIns, setStockIns] = useState(() => JSON.parse(localStorage.getItem("b_stockins")) || []);
  const [reworkOrders, setReworkOrders] = useState(() => JSON.parse(localStorage.getItem("b_rework_orders")) || INITIAL_REWORK_ORDERS);
  const [reworkProductions, setReworkProductions] = useState(() => JSON.parse(localStorage.getItem("b_rework_prods")) || INITIAL_REWORK_PRODUCTIONS);
  const [feeds, setFeeds] = useState([]);
  const [returns, setReturns] = useState([]);

  const [selectedRework, setSelectedRework] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("b_rework_orders"));
    const list = saved && saved.length ? saved : INITIAL_REWORK_ORDERS;
    return list && list.length ? list[0] : null;
  });

  // 弹窗状态管理
  const [showModal, setShowModal] = useState(null); // materialAdd, bomWizard, reworkCreate
  const [selectedBom, setSelectedBom] = useState(INITIAL_BOMS[3]); // 默认加载成品BOM展示
  const [toastMsg, setToastMsg] = useState("");
  
  // 临时暂存BOM创建向导的状态数据 (5合1联动配置)
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardBom, setWizardBom] = useState({
    code: "", name: "", materialCode: "", type: "产品", version: "V1.0",
    items: [], // { materialCode, materialName, ratio, type }
    steps: [], // { stepNum, desc }
    stepFeeds: [], // { stepNum, materialCode, materialName }
    params: [] // { stepNum, name, planVal, unit, minVal, maxVal }
  });

  // 用于“物料创建”弹窗时，是否联动弹出“新增BOM向导”的临时绑定关联
  const [autoBindMaterialCode, setAutoBindMaterialCode] = useState(null);

  // 页面快速查询状态
  const [searchMaterial, setSearchMaterial] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchBom, setSearchBom] = useState("");
  const [reworkFilterStatus, setReworkFilterStatus] = useState("all");
  const [reworkDraft, setReworkDraft] = useState(null);
  const [reworkDraftDetail, setReworkDraftDetail] = useState({ materialCode: "", batchId: "", qty: "", remark: "" });

  // 同步本地存储
  useEffect(() => {
    localStorage.setItem("b_materials", JSON.stringify(materials));
    localStorage.setItem("b_boms", JSON.stringify(boms));
    localStorage.setItem("b_bom_items", JSON.stringify(bomItems));
    localStorage.setItem("b_bom_steps", JSON.stringify(bomSteps));
    localStorage.setItem("b_bom_step_feeds", JSON.stringify(bomStepFeeds));
    localStorage.setItem("b_bom_params", JSON.stringify(bomParams));
    localStorage.setItem("b_batches", JSON.stringify(batches));
    localStorage.setItem("b_plans", JSON.stringify(plans));
    localStorage.setItem("b_prods", JSON.stringify(productionOrders));
    localStorage.setItem("b_reqs", JSON.stringify(requisitions));
    localStorage.setItem("b_purchs", JSON.stringify(purchases));
    localStorage.setItem("b_stockins", JSON.stringify(stockIns));
    localStorage.setItem("b_rework_orders", JSON.stringify(reworkOrders));
    localStorage.setItem("b_rework_prods", JSON.stringify(reworkProductions));
  }, [materials, boms, bomItems, bomSteps, bomStepFeeds, bomParams, batches, plans, productionOrders, requisitions, purchases, stockIns, reworkOrders, reworkProductions]);

  useEffect(() => {
    if (reworkOrders.length === 0) {
      if (selectedRework) setSelectedRework(null);
      return;
    }
    if (!selectedRework) {
      setSelectedRework(reworkOrders[0]);
      return;
    }
    const match = reworkOrders.find(order => order.id === selectedRework.id);
    if (!match) {
      setSelectedRework(reworkOrders[0]);
    } else if (match !== selectedRework) {
      setSelectedRework(match);
    }
  }, [reworkOrders]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleResetData = () => {
    if (confirm("确定重置整个百事通演示账册吗？")) {
      localStorage.clear();
      location.reload();
    }
  };

  // --- 打开五合一BOM配置向导 ---
  const handleOpenBomWizard = (predefinedMaterialCode = null) => {
    const defaultCode = `BOM-${Date.now().toString().slice(-6)}`;
    let defaultType = "产品";
    if (predefinedMaterialCode) {
      const mat = materials.find(m => m.code === predefinedMaterialCode);
      if (mat) defaultType = mat.type;
    }
    
    setWizardBom({
      code: defaultCode,
      name: "",
      materialCode: predefinedMaterialCode || "",
      type: defaultType,
      version: "V1.1",
      items: [],
      steps: [
        { stepNum: 1, desc: "标准工艺前处理、计量物料" },
        { stepNum: 2, desc: "车间工艺设备运行、搅拌与产出" }
      ],
      stepFeeds: [],
      params: [
        { stepNum: 1, name: "搅拌设备主轴转速", planVal: "100", unit: "r/min", minVal: "80", maxVal: "120" }
      ]
    });
    setWizardStep(1);
    setAutoBindMaterialCode(predefinedMaterialCode);
    setShowModal("bomWizard");
  };

  // --- 联动MRP展开分析与发料：在下派生产指令时运行 ---
  const handleReleaseProdOrder = (plan) => {
    const qtyStr = prompt(`请输入本次下派数量 (计划总量:${plan.targetQty}, 已下达:${plan.downQty}):`, plan.targetQty - plan.downQty);
    const qty = Number(qtyStr);
    if (!qty || isNaN(qty) || qty <= 0) return;

    const matchedBom = boms.find(b => b.code === plan.bomCode);
    if (!matchedBom) {
      alert("该计划尚未绑定配方BOM，请先前往BOM页建立并绑定该成品物料的完整工艺BOM！");
      return;
    }

    const prodCode = `SC${new Date().toISOString().slice(2,10).replace(/-/g, "")}${Math.floor(Math.random()*1000).toString().padStart(3,"0")}`;
    const newProd = {
      id: prodCode,
      code: prodCode,
      planCode: plan.code,
      materialCode: plan.materialCode,
      materialName: plan.materialName,
      bomCode: plan.bomCode,
      targetQty: qty,
      status: 1, // 1-待领发料/2-生产中/3-完工入库
      flStatus: 0,
      createTime: new Date().toLocaleString()
    };

    setPlans(plans.map(p => p.id === plan.id ? { ...p, downQty: p.downQty + qty } : p));
    setProductionOrders([newProd, ...productionOrders]);

    // --- 启动BOM展开物料MRP计算，判断原料、内外包材可用状态并触发采购申购 ---
    const activeItems = bomItems.filter(bi => bi.bomId === matchedBom.id);
    activeItems.forEach(item => {
      const needQty = qty * (item.ratio / 100);
      const stockSum = batches
        .filter(b => b.materialCode === item.materialCode && b.qcStatus === 1)
        .reduce((sum, b) => sum + b.stockQty, 0);

      if (stockSum < needQty) {
        const gap = needQty - stockSum;
        const newReq = {
          id: `REQD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          prodOrderCode: prodCode,
          materialCode: item.materialCode,
          materialName: item.materialName,
          needQty: parseFloat(needQty.toFixed(2)),
          stockQty: parseFloat(stockSum.toFixed(2)),
          shortfall: parseFloat(gap.toFixed(2)),
          status: 0, // 0-待申购
          createTime: new Date().toLocaleString()
        };
        setRequisitions(prev => [newReq, ...prev]);
      }
    });

    showToast(`生产订单 ${prodCode} 下发完成！系统自动展开BOM并对物料库存储库进行了可用性评估。`);
    setActiveMenu("production");
  };

  // --- 申购流程：一键将欠料转化为合并申购单 ---
  const handleAutoRequisition = (reqItem) => {
    const reqNo = `SG${Date.now().toString().slice(-6)}`;
    const newPur = {
      id: reqNo,
      reqNo: reqNo,
      materialCode: reqItem.materialCode,
      materialName: reqItem.materialName,
      qty: reqItem.shortfall,
      status: 1,
      purStatus: 1, // 1-待采购/2-采购在途/3-已入库
      createTime: new Date().toLocaleString(),
      sourceReqId: reqItem.id
    };

    setPurchases([newPur, ...purchases]);
    setRequisitions(requisitions.map(r => r.id === reqItem.id ? { ...r, status: 1 } : r));
    showToast(`合并物料申购单 ${reqNo} 创建成功！`);
    setActiveMenu("purchases");
  };

  // --- 采购商下单 ---
  const handleCreatePurchase = (req) => {
    const poNo = `CG${Date.now().toString().slice(-6)}`;
    const newStock = {
      id: poNo,
      poNo: poNo,
      reqNo: req.reqNo,
      materialCode: req.materialCode,
      materialName: req.materialName,
      qty: req.qty,
      status: 0, // 0-在途
      supplier: "百事通化妆品供应链集团",
      rcvQty: 0
    };

    setPurchases(purchases.map(p => p.id === req.id ? { ...p, purStatus: 2 } : p));
    setStockIns([newStock, ...stockIns]);
    showToast(`采购订单 ${poNo} 已流转给供应商安排发货！`);
  };

  // --- 回料验收并自动入库写入新批次 ---
  const handleReceivePurchase = (po) => {
    const rQty = Number(prompt(`请输入点收回料的实际数量 (订购量:${po.qty}):`, po.qty));
    if (!rQty || isNaN(rQty) || rQty <= 0) return;

    const dateStr = new Date().toISOString().slice(2,10).replace(/-/g, "");
    const batchNo = `BT${dateStr}A${Math.floor(Math.random()*100).toString().padStart(2,"0")}`;

    const newBatch = {
      id: `BAT${Date.now()}`,
      batchNo: batchNo,
      materialCode: po.materialCode,
      materialName: po.materialName,
      type: 1,
      sourceNo: po.poNo,
      mfgDate: new Date().toISOString().slice(0, 10),
      expDate: new Date(Date.now() + 365*2*24*60*60*1000).toISOString().slice(0, 10),
      stockQty: rQty,
      qcStatus: 1
    };

    setBatches([newBatch, ...batches]);
    setStockIns(stockIns.map(si => si.id === po.id ? { ...si, status: 1, rcvQty: rQty } : si));
    setPurchases(purchases.map(p => p.reqNo === po.reqNo ? { ...p, purStatus: 3 } : p));
    showToast(`采购回料验收成功！已将批次号 ${batchNo} 签收入库！`);
  };

  // --- 生产 FIFO 发料 ---
  const handleFIFOIssue = (order) => {
    const matchedBom = boms.find(b => b.code === order.bomCode);
    if (!matchedBom) return;

    const activeItems = bomItems.filter(bi => bi.bomId === matchedBom.id);
    let failedList = [];
    const updatedBatches = [...batches];

    activeItems.forEach(item => {
      const needed = order.targetQty * (item.ratio / 100);
      const availables = updatedBatches.filter(b => b.materialCode === item.materialCode && b.qcStatus === 1);
      
      let allocated = 0;
      for (let b of availables) {
        const need = needed - allocated;
        if (b.stockQty >= need) {
          b.stockQty -= need;
          allocated = needed;
          break;
        } else {
          allocated += b.stockQty;
          b.stockQty = 0;
        }
      }

      if (allocated < needed) {
        failedList.push(`${item.materialName} (缺口:${(needed - allocated).toFixed(2)})`);
      }
    });

    if (failedList.length > 0) {
      alert(`FIFO 配发料失败！以下原辅物料在库合格批次不足：\n- ${failedList.join("\n- ")}`);
      return;
    }

    setBatches(updatedBatches);
    setProductionOrders(productionOrders.map(p => p.id === order.id ? { ...p, status: 2, flStatus: 2 } : p));
    
    setReturns([{
      id: `LL-${Date.now().toString().slice(-5)}`,
      orderCode: order.code,
      time: new Date().toLocaleString(),
      type: "物料已按先进先出(FIFO)足额发货出库"
    }, ...returns]);

    showToast(`生产自动发料配齐！扣减原辅料历史批次，订单更新为“生产中”。`);
  };

  // --- 生产完工入库 ---
  const handleFinishProduction = (order) => {
    const dateStr = new Date().toISOString().slice(2,10).replace(/-/g, "");
    const batchNo = `FG${dateStr}A01`;

    const newBatch = {
      id: `BAT${Date.now()}`,
      batchNo: batchNo,
      materialCode: order.materialCode,
      materialName: order.materialName,
      type: 3,
      sourceNo: order.code,
      mfgDate: new Date().toISOString().slice(0, 10),
      expDate: new Date(Date.now() + 365*2*24*60*60*1000).toISOString().slice(0, 10),
      stockQty: order.targetQty,
      qcStatus: 1
    };

    setBatches([newBatch, ...batches]);
    setProductionOrders(productionOrders.map(p => p.id === order.id ? { ...p, status: 3 } : p));
    showToast(`产品完工归档入库！(批次号: ${batchNo}) 新增成品库存 ${order.targetQty} 个！`);
  };

  const updateReworkOrder = (orderId, patch) => {
    setReworkOrders(prev => prev.map(order => order.id === orderId ? { ...order, ...patch } : order));
  };

  const deriveReworkStatusFromProductions = (orderId, list) => {
    const related = list.filter(item => item.reworkOrderId === orderId);
    if (related.length === 0) return "approved";
    if (related.every(item => item.status === "已完工")) return "completed";
    if (related.every(item => ["已完工", "强制完工"].includes(item.status))) {
      return related.some(item => item.status === "强制完工") ? "forced" : "completed";
    }
    return "in_progress";
  };

  const handleOpenReworkModal = () => {
    const now = new Date();
    const planStart = now.toISOString().slice(0, 10);
    const planEnd = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const sequence = Math.floor(Math.random() * 900 + 100).toString();
    const draftOrder = {
      id: `RW${Date.now()}`,
      code: `RWK${now.toISOString().slice(2,10).replace(/-/g, "")}-${sequence}`,
      type: REWORK_TYPES[0],
      reason: "",
      planStart,
      planEnd,
      status: "draft",
      remark: "",
      requester: "生产工艺员A",
      createTime: now.toLocaleString(),
      details: []
    };
    setReworkDraft(draftOrder);
    setReworkDraftDetail({ materialCode: "", batchId: "", qty: "", remark: "" });
    setShowModal("reworkCreate");
  };

  const handleAddDraftDetail = () => {
    if (!reworkDraft) return;
    const { materialCode, batchId, qty, remark } = reworkDraftDetail;
    if (!materialCode || !batchId || !qty) {
      alert("请选择返工物料、批次并输入返工数量。");
      return;
    }
    const material = materials.find(m => m.code === materialCode);
    const batch = batches.find(b => b.id === batchId);
    if (!material || !batch) {
      alert("选择的物料或批次无效，请重新确认。");
      return;
    }
    const quantity = Number(qty);
    if (!quantity || quantity <= 0) {
      alert("返工数量必须大于0。");
      return;
    }
    const bom = material.bomCode ? boms.find(b => b.code === material.bomCode) : boms.find(b => b.materialCode === material.code);
    const detail = {
      id: `RWD${Date.now()}${Math.floor(Math.random()*100).toString().padStart(2, "0")}`,
      materialCode: material.code,
      materialName: material.name,
      batchId: batch.id,
      batchNo: batch.batchNo,
      reworkQty: quantity,
      bomCode: bom ? bom.code : "",
      reworkType: reworkDraft.type,
      remark: remark || ""
    };
    setReworkDraft(prev => ({ ...prev, details: [detail, ...prev.details] }));
    setReworkDraftDetail({ materialCode: "", batchId: "", qty: "", remark: "" });
  };

  const handleRemoveDraftDetail = (detailId) => {
    if (!reworkDraft) return;
    setReworkDraft(prev => ({ ...prev, details: prev.details.filter(item => item.id !== detailId) }));
  };

  const handleSaveReworkDraft = () => {
    if (!reworkDraft) return;
    if (!reworkDraft.reason.trim()) {
      alert("请填写返工原因。");
      return;
    }
    if (!reworkDraft.details.length) {
      alert("返工单至少需要一条返工明细。");
      return;
    }
    setReworkOrders(prev => [{ ...reworkDraft }, ...prev]);
    setSelectedRework({ ...reworkDraft });
    setShowModal(null);
    setReworkDraft(null);
    setReworkDraftDetail({ materialCode: "", batchId: "", qty: "", remark: "" });
    showToast(`返工单 ${reworkDraft.code} 草稿创建成功！`);
  };

  const handleCloseReworkModal = () => {
    setShowModal(null);
    setReworkDraft(null);
    setReworkDraftDetail({ materialCode: "", batchId: "", qty: "", remark: "" });
  };

  const handleSubmitReworkOrder = (order) => {
    if (!order.details || order.details.length === 0) {
      alert("返工单尚未配置返工明细，无法提交审核。");
      return;
    }
    updateReworkOrder(order.id, { status: "pending", submitTime: new Date().toLocaleString() });
    showToast(`返工单 ${order.code} 已提交审核。`);
  };

  const handleWithdrawReworkOrder = (order) => {
    updateReworkOrder(order.id, { status: "draft" });
    showToast(`返工单 ${order.code} 已退回草稿。`);
  };

  const handleApproveReworkOrder = (order) => {
    updateReworkOrder(order.id, { status: "approved", approveTime: new Date().toLocaleString(), approver: "返工审核员" });
    showToast(`返工单 ${order.code} 审核通过，可下发返工生产。`);
  };

  const handlePushReworkToProduction = (order) => {
    if (!order.details || order.details.length === 0) {
      alert("返工单未配置任何明细，无法下推。");
      return;
    }
    const newProductions = order.details.map((detail, index) => {
      const code = `RWP${new Date().toISOString().slice(2,10).replace(/-/g, "")}${Math.floor(Math.random()*1000).toString().padStart(3, "0")}${index}`;
      return {
        id: code,
        code,
        reworkOrderId: order.id,
        reworkOrderCode: order.code,
        materialCode: detail.materialCode,
        materialName: detail.materialName,
        batchId: detail.batchId,
        batchNo: detail.batchNo,
        bomCode: detail.bomCode,
        targetQty: detail.reworkQty,
        status: "待领料",
        flStatus: 0,
        reworkType: detail.reworkType,
        reason: order.reason,
        createTime: new Date().toLocaleString()
      };
    });
    setReworkProductions(prev => [...newProductions, ...prev]);
    updateReworkOrder(order.id, { status: "in_progress", pushTime: new Date().toLocaleString() });
    showToast(`返工单 ${order.code} 已下推 ${newProductions.length} 条返工生产指令。`);
    setActiveMenu("reworkExecution");
  };

  const handleCloseReworkOrder = (order) => {
    const related = reworkProductions.filter(item => item.reworkOrderId === order.id);
    if (related.some(item => !["已完工", "强制完工"].includes(item.status))) {
      alert("返工指令仍在执行中，无法关闭返工单。");
      return;
    }
    updateReworkOrder(order.id, { status: "closed", closeTime: new Date().toLocaleString() });
    showToast(`返工单 ${order.code} 已正式结案。`);
  };

  const handleReworkFIFOIssue = (prod) => {
    const matchedBom = boms.find(b => b.code === prod.bomCode);
    if (!matchedBom) {
      alert("该返工指令缺少BOM配置，无法自动发料。");
      return;
    }
    const activeItems = bomItems.filter(bi => bi.bomId === matchedBom.id);
    const updatedBatches = [...batches];
    const failedList = [];
    activeItems.forEach(item => {
      const needed = prod.targetQty * (item.ratio / 100);
      const availables = updatedBatches.filter(b => b.materialCode === item.materialCode && b.qcStatus === 1);
      let allocated = 0;
      for (let b of availables) {
        const need = needed - allocated;
        if (b.stockQty >= need) {
          b.stockQty -= need;
          allocated = needed;
          break;
        } else {
          allocated += b.stockQty;
          b.stockQty = 0;
        }
      }
      if (allocated < needed) {
        failedList.push(`${item.materialName} (缺口:${(needed - allocated).toFixed(2)})`);
      }
    });
    if (failedList.length > 0) {
      alert(`返工发料失败：\n- ${failedList.join("\n- ")}`);
      return;
    }
    const updatedProductions = reworkProductions.map(item => item.id === prod.id ? { ...item, status: "生产中", flStatus: 2, issueTime: new Date().toLocaleString() } : item);
    setBatches(updatedBatches);
    setReworkProductions(updatedProductions);
    setReturns(prev => [{
      id: `RW-ISS-${Date.now().toString().slice(-5)}`,
      orderCode: prod.code,
      time: new Date().toLocaleString(),
      type: "返工指令发料(FIFO)完成"
    }, ...prev]);
    const nextStatus = deriveReworkStatusFromProductions(prod.reworkOrderId, updatedProductions);
    updateReworkOrder(prod.reworkOrderId, { status: nextStatus });
    showToast(`返工指令 ${prod.code} 已按FIFO配料完成！`);
  };

  const handleReworkLog = (prod) => {
    setFeeds(prev => [{
      id: `RWLOG-${Date.now().toString().slice(-4)}`,
      prodOrderCode: prod.code,
      feedTime: new Date().toLocaleString(),
      stepNum: 1,
      stepDesc: "返工工序巡检记录",
      note: `返工原因：${prod.reason || "-"}`
    }, ...prev]);
    showToast(`返工指令 ${prod.code} 已记录工艺日志。`);
  };

  const handleReworkFinish = (prod) => {
    const updatedList = reworkProductions.map(item => item.id === prod.id ? { ...item, status: "已完工", finishTime: new Date().toLocaleString() } : item);
    setReworkProductions(updatedList);
    const newBatch = {
      id: `BAT${Date.now()}`,
      batchNo: `RW${new Date().toISOString().slice(2,10).replace(/-/g, "")}A01`,
      materialCode: prod.materialCode,
      materialName: prod.materialName,
      type: 3,
      sourceNo: prod.code,
      mfgDate: new Date().toISOString().slice(0, 10),
      expDate: new Date(Date.now() + 365*2*24*60*60*1000).toISOString().slice(0, 10),
      stockQty: prod.targetQty,
      qcStatus: 1
    };
    setBatches(prev => [newBatch, ...prev]);
    const nextStatus = deriveReworkStatusFromProductions(prod.reworkOrderId, updatedList);
    updateReworkOrder(prod.reworkOrderId, { status: nextStatus });
    showToast(`返工指令 ${prod.code} 已完工，产生返工批次 ${newBatch.batchNo}。`);
  };

  const handleReworkForceClose = (prod) => {
    const updatedList = reworkProductions.map(item => item.id === prod.id ? { ...item, status: "强制完工", forceTime: new Date().toLocaleString() } : item);
    setReworkProductions(updatedList);
    const nextStatus = deriveReworkStatusFromProductions(prod.reworkOrderId, updatedList);
    updateReworkOrder(prod.reworkOrderId, { status: nextStatus, forceRemark: `指令 ${prod.code} 强制完工` });
    showToast(`返工指令 ${prod.code} 已强制完工。`);
  };


  // --- 7大物料类型递进校验明细，过滤可以添加的下级物料 ---
  const getAvailableSubMaterials = (currentType) => {
    // 约束规则：
    // 配方只能加原料
    // 配方产品只能加配方
    // 中间品只能加配方产品和内包材
    // 产品只能加中间品和外包材
    if (currentType === "配方") {
      return materials.filter(m => m.type === "原料");
    } else if (currentType === "配方产品") {
      return materials.filter(m => m.type === "配方");
    } else if (currentType === "中间品") {
      return materials.filter(m => m.type === "配方产品" || m.type === "内包材");
    } else if (currentType === "产品") {
      return materials.filter(m => m.type === "中间品" || m.type === "外包材");
    }
    return [];
  };

  // --- 过滤展示后的物料与BOM ---
  const filteredMaterials = materials.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchMaterial.toLowerCase()) || m.code.toLowerCase().includes(searchMaterial.toLowerCase());
    const matchType = filterType === "all" || m.type === filterType;
    return matchSearch && matchType;
  });

  const filteredBoms = boms.filter(b => {
    return b.name.toLowerCase().includes(searchBom.toLowerCase()) || b.code.toLowerCase().includes(searchBom.toLowerCase()) || b.materialCode.toLowerCase().includes(searchBom.toLowerCase());
  });

  const filteredReworkOrders = reworkOrders.filter(order => {
    if (reworkFilterStatus === "all") return true;
    return order.status === reworkFilterStatus;
  });

  const currentRework = selectedRework ? (reworkOrders.find(order => order.id === selectedRework.id) || null) : null;

  const renderReworkStatus = (statusKey) => {
    const meta = REWORK_STATUS_META[statusKey] || { label: statusKey, badge: "bg-slate-100 text-slate-600" };
    return <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.badge}`}>{meta.label}</span>;
  };

  const renderReworkProdStatus = (status) => {
    switch (status) {
      case "待领料":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">待领料</span>;
      case "生产中":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">生产中</span>;
      case "已完工":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">已完工</span>;
      case "强制完工":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">强制完工</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-800 font-sans">
      
      {/* 消息通知 */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-teal-600 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-5 h-5 text-emerald-300" />
          <span className="font-bold text-sm">{toastMsg}</span>
        </div>
      )}

      {/* --- 左侧折叠式侧边栏菜单 --- */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
          <Layers className="w-6 h-6 text-indigo-400 animate-pulse" />
          <span className="font-bold text-white text-base tracking-wider">百事通日化精细生产</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
          {/* 1. 基础数据 */}
          <div>
            <button 
              onClick={() => setSidebarExpanded(prev => ({ ...prev, basic: !prev.basic }))}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-200"
            >
              <span>1. 基础配方数据</span>
              {sidebarExpanded.basic ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {sidebarExpanded.basic && (
              <div className="mt-1 ml-2 space-y-1">
                <button 
                  onClick={() => setActiveMenu("materials")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "materials" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <Database className="w-4 h-4" /> 物料大类管理
                </button>
                <button 
                  onClick={() => setActiveMenu("boms")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "boms" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <FileText className="w-4 h-4" /> 工艺BOM配方路线
                </button>
              </div>
            )}
          </div>

          {/* 2. 计划管理 */}
          <div className="pt-1">
            <button 
              onClick={() => setSidebarExpanded(prev => ({ ...prev, plan: !prev.plan }))}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-200"
            >
              <span>2. 计划调度</span>
              {sidebarExpanded.plan ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {sidebarExpanded.plan && (
              <div className="mt-1 ml-2 space-y-1">
                <button 
                  onClick={() => setActiveMenu("plans")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "plans" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <ClipboardList className="w-4 h-4" /> 计划与配方下发
                </button>
              </div>
            )}
          </div>

          {/* 3. 生产管理 */}
          <div className="pt-1">
            <button 
              onClick={() => setSidebarExpanded(prev => ({ ...prev, prod: !prev.prod }))}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-200"
            >
              <span>3. 车间中控</span>
              {sidebarExpanded.prod ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {sidebarExpanded.prod && (
              <div className="mt-1 ml-2 space-y-1">
                <button 
                  onClick={() => setActiveMenu("production")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "production" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <Activity className="w-4 h-4" /> 生产单执行与投料
                </button>
                <button 
                  onClick={() => setActiveMenu("batches")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "batches" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <ShieldCheck className="w-4 h-4" /> 批次保质期账册
                </button>
              </div>
            )}
          </div>

          {/* 4. 采购管理 */}
          <div className="pt-1">
            <button 
              onClick={() => setSidebarExpanded(prev => ({ ...prev, pur: !prev.pur }))}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-200"
            >
              <span>4. 物流物控</span>
              {sidebarExpanded.pur ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {sidebarExpanded.pur && (
              <div className="mt-1 ml-2 space-y-1">
                <button 
                  onClick={() => setActiveMenu("requisitions")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "requisitions" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <AlertTriangle className="w-4 h-4" /> 申购需求单 (欠料行)
                </button>
                <button 
                  onClick={() => setActiveMenu("purchases")} 
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "purchases" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <ShoppingCart className="w-4 h-4" /> 采购及回料点收
                </button>
              </div>
            )}
          </div>

          {/* 5. 返工管理 */}
          <div className="pt-1">
            <button 
              onClick={() => setSidebarExpanded(prev => ({ ...prev, rework: !prev.rework }))}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-200"
            >
              <span>5. 返工管理</span>
              {sidebarExpanded.rework ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {sidebarExpanded.rework && (
              <div className="mt-1 ml-2 space-y-1">
                <button 
                  onClick={() => setActiveMenu("reworkOrders")}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "reworkOrders" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <RotateCcw className="w-4 h-4" /> 返工单申请与审批
                </button>
                <button 
                  onClick={() => setActiveMenu("reworkExecution")}
                  className={`flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition ${activeMenu === "reworkExecution" ? "bg-indigo-600 text-white font-semibold shadow" : "hover:bg-slate-800 text-slate-400"}`}
                >
                  <Factory className="w-4 h-4" /> 返工生产执行
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* 底部按钮 */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button 
            onClick={handleResetData}
            className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-1 transition"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            重置演示数据库
          </button>
        </div>
      </aside>

      {/* --- 右侧内容面板 --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* 页眉 */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-slate-800">
              {activeMenu === "materials" && "物料管理 · 7大递进物料主数据账册"}
              {activeMenu === "boms" && "工艺BOM路线 · 级联配方路线图"}
              {activeMenu === "plans" && "计划调度 · MRP运算下派"}
              {activeMenu === "production" && "车间中控 · 投产、发料与中控参数监控"}
              {activeMenu === "batches" && "批次管理 · 先进先出保质期账册"}
              {activeMenu === "requisitions" && "物控分析 · 原辅包材深度欠料行"}
              {activeMenu === "purchases" && "物流物控 · 采购在途与回料质量点收"}
              {activeMenu === "reworkOrders" && "返工管理 · 返工单申请、审批与追踪"}
              {activeMenu === "reworkExecution" && "返工车间 · 返工指令执行与完工监控"}
            </h1>
          </div>
          <span className="text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1 rounded">
            Role: 生产工艺总控系统
          </span>
        </header>

        {/* 主工作区 */}
        <section className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* === 1. 物料管理模块页面 === */}
          {activeMenu === "materials" && (
            <div className="space-y-4 fade-in">
              {/* 过滤条 & 统计看板 */}
              <div className="grid grid-cols-7 gap-3">
                {MATERIAL_TYPES.map(t => {
                  const count = materials.filter(m => m.type === t).length;
                  return (
                    <div key={t} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] text-slate-400 font-bold">{t}</p>
                      <p className="text-base font-extrabold text-slate-800 mt-1 font-mono">{count} <span className="text-[10px] text-slate-400">类</span></p>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3 flex-1 max-w-lg">
                    <input 
                      type="text" 
                      placeholder="模糊检索编码、物料规格及名称..." 
                      value={searchMaterial}
                      onChange={(e) => setSearchMaterial(e.target.value)}
                      className="border border-slate-200 rounded px-3 py-1.5 text-xs flex-1 focus:outline-indigo-600"
                    />
                    <select 
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="border border-slate-200 rounded px-3 py-1.5 text-xs bg-white text-slate-600"
                    >
                      <option value="all">全部大类类型</option>
                      {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <button 
                    onClick={() => setShowModal("materialAdd")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> 登记新物料
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                        <th className="py-2.5 px-4">主键 ID</th>
                        <th className="py-2.5 px-4">物料编码</th>
                        <th className="py-2.5 px-4">规格名称</th>
                        <th className="py-2.5 px-4">物料大类</th>
                        <th className="py-2.5 px-4">单位</th>
                        <th className="py-2.5 px-4">是否需要BOM</th>
                        <th className="py-2.5 px-4">关联BOM配方</th>
                        <th className="py-2.5 px-4 text-center">BOM操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMaterials.map(m => {
                        const needsBOM = ["配方", "配方产品", "中间品", "产品"].includes(m.type);
                        const boundBOM = boms.find(b => b.code === m.bomCode || b.materialCode === m.code);
                        return (
                          <tr key={m.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4 font-mono text-slate-400">{m.id}</td>
                            <td className="py-3 px-4 font-mono font-bold text-indigo-600">{m.code}</td>
                            <td className="py-3 px-4 font-bold text-slate-800 text-sm">{m.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.type === "原料" ? "bg-amber-100 text-amber-800" :
                                m.type === "产品" ? "bg-emerald-100 text-emerald-800" : "bg-sky-100 text-sky-800"
                              }`}>{m.type}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">{m.unit}</td>
                            <td className="py-3 px-4">
                              {needsBOM ? (
                                <span className="text-indigo-600 font-bold flex items-center gap-0.5">● 是</span>
                              ) : (
                                <span className="text-slate-300">无</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono">
                              {needsBOM ? (
                                boundBOM ? (
                                  <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">{boundBOM.code}</span>
                                ) : (
                                  <span className="text-rose-500 font-bold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> 未关联BOM
                                  </span>
                                )
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {needsBOM && (
                                <div className="flex items-center justify-center gap-2">
                                  {boundBOM ? (
                                    <button 
                                      onClick={() => {
                                        setSelectedBom(boundBOM);
                                        setActiveMenu("boms");
                                      }}
                                      className="text-[10px] text-indigo-600 hover:underline font-bold"
                                    >
                                      查看详情BOM
                                    </button>
                                  ) : (
                                    <>
                                      <select 
                                        onChange={(e) => {
                                          const code = e.target.value;
                                          if (code) {
                                            setMaterials(materials.map(mat => mat.id === m.id ? { ...mat, bomCode: code } : mat));
                                            showToast(`成功关联BOM: ${code}`);
                                          }
                                        }}
                                        className="text-[10px] border border-slate-200 rounded px-1"
                                        defaultValue=""
                                      >
                                        <option value="">关联已有BOM</option>
                                        {boms.filter(b => b.type === m.type).map(b => (
                                          <option key={b.id} value={b.code}>{b.code} ({b.name})</option>
                                        ))}
                                      </select>
                                      <button 
                                        onClick={() => handleOpenBomWizard(m.code)}
                                        className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm hover:bg-indigo-700"
                                      >
                                        一键新增BOM
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* === 8. 返工单申请与审批 === */}
          {activeMenu === "reworkOrders" && (
            <div className="grid grid-cols-3 gap-6 items-start fade-in">
              <div className="col-span-1 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <select 
                      value={reworkFilterStatus}
                      onChange={(e) => setReworkFilterStatus(e.target.value)}
                      className="w-full border border-slate-200 rounded px-2 py-1 text-[11px] bg-white"
                    >
                      <option value="all">全部状态</option>
                      <option value="draft">草稿</option>
                      <option value="pending">待审核</option>
                      <option value="approved">待下派</option>
                      <option value="in_progress">生产中</option>
                      <option value="completed">已完工</option>
                      <option value="forced">强制完工</option>
                      <option value="closed">已关闭</option>
                    </select>
                  </div>
                  <button 
                    onClick={handleOpenReworkModal}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> 新建返工单
                  </button>
                </div>
                <div className="max-h-[520px] overflow-y-auto divide-y divide-slate-100 no-scrollbar">
                  {filteredReworkOrders.length === 0 ? (
                    <p className="text-center text-slate-400 text-xs py-8">暂无符合条件的返工单</p>
                  ) : (
                    filteredReworkOrders.map(order => (
                      <div
                        key={order.id}
                        onClick={() => setSelectedRework(order)}
                        className={`p-3 cursor-pointer transition ${currentRework?.id === order.id ? "bg-indigo-50 border-l-4 border-indigo-600" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-slate-500">{order.code}</span>
                          {renderReworkStatus(order.status)}
                        </div>
                        <p className="text-sm font-bold text-slate-800 mt-1">{order.type}</p>
                        <p className="text-[10px] text-slate-400 mt-1">计划：{order.planStart} ~ {order.planEnd}</p>
                        <p className="text-[10px] text-slate-400 truncate mt-1">原因：{order.reason || "-"}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                {currentRework ? (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">返工单 {currentRework.code}</h3>
                        <p className="text-[11px] text-slate-400 mt-1">发起人：{currentRework.requester} · 创建于 {currentRework.createTime}</p>
                        <p className="text-[11px] text-slate-400">计划周期：{currentRework.planStart} ~ {currentRework.planEnd}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {renderReworkStatus(currentRework.status)}
                        <div className="flex gap-2">
                          {currentRework.status === "draft" && (
                            <button onClick={() => handleSubmitReworkOrder(currentRework)} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded font-bold">提交审核</button>
                          )}
                          {currentRework.status === "pending" && (
                            <>
                              <button onClick={() => handleWithdrawReworkOrder(currentRework)} className="px-3 py-1 bg-slate-200 text-slate-600 text-xs rounded font-bold">退回草稿</button>
                              <button onClick={() => handleApproveReworkOrder(currentRework)} className="px-3 py-1 bg-indigo-600 text-white text-xs rounded font-bold">审核通过</button>
                            </>
                          )}
                          {currentRework.status === "approved" && (
                            <button onClick={() => handlePushReworkToProduction(currentRework)} className="px-3 py-1 bg-emerald-600 text-white text-xs rounded font-bold">下推返工生产</button>
                          )}
                          {(["completed", "forced"].includes(currentRework.status) && currentRework.status !== "closed") && (
                            <button onClick={() => handleCloseReworkOrder(currentRework)} className="px-3 py-1 bg-slate-800 text-white text-xs rounded font-bold">关闭返工单</button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded p-3 text-xs text-slate-600">
                      <p className="font-bold text-slate-700">返工原因说明</p>
                      <p className="mt-1 leading-relaxed">{currentRework.reason || "未填写"}</p>
                      {currentRework.remark && (
                        <p className="mt-1 text-slate-400">备注：{currentRework.remark}</p>
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                        <ClipboardCheck className="w-4 h-4 text-indigo-500" /> 返工明细
                      </h4>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                            <th className="p-2">物料</th>
                            <th className="p-2">批次</th>
                            <th className="p-2 text-right">返工数量</th>
                            <th className="p-2">返工类型</th>
                            <th className="p-2">BOM</th>
                            <th className="p-2">备注</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentRework.details && currentRework.details.length > 0 ? (
                            currentRework.details.map(detail => (
                              <tr key={detail.id}>
                                <td className="p-2">
                                  <p className="font-bold text-slate-800">{detail.materialName}</p>
                                  <p className="text-[10px] text-slate-400 font-mono">{detail.materialCode}</p>
                                </td>
                                <td className="p-2">
                                  <span className="font-mono text-slate-500 text-[11px]">{detail.batchNo}</span>
                                </td>
                                <td className="p-2 text-right font-mono font-bold">{detail.reworkQty}</td>
                                <td className="p-2">{detail.reworkType}</td>
                                <td className="p-2 font-mono text-indigo-600">{detail.bomCode || "-"}</td>
                                <td className="p-2 text-slate-500">{detail.remark || "-"}</td>
                              </tr>
                            ))
                          ) : (
                            <tr><td colSpan="6" className="p-3 text-center text-slate-400">暂无返工明细</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-24">
                    请选择左侧返工单以查看详情，或点击“新建返工单”开始流程。
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === 9. 返工生产执行 === */}
          {activeMenu === "reworkExecution" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 fade-in">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm">返工生产指令看板</span>
                <span className="text-[11px] text-slate-400">共 {reworkProductions.length} 条返工指令</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                      <th className="p-2.5">返工指令号</th>
                      <th className="p-2.5">关联返工单</th>
                      <th className="p-2.5">返工物料</th>
                      <th className="p-2.5 text-right">返工数量</th>
                      <th className="p-2.5">发料状态</th>
                      <th className="p-2.5">生产状态</th>
                      <th className="p-2.5 text-center">指令动作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reworkProductions.length === 0 ? (
                      <tr><td colSpan="7" className="py-10 text-center text-slate-400">暂无返工指令。请在返工单页面下推生产。</td></tr>
                    ) : (
                      reworkProductions.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-mono font-bold text-indigo-600">{prod.code}</td>
                          <td className="p-2.5">
                            <p className="font-bold text-slate-700">{prod.reworkOrderCode}</p>
                            <p className="text-[10px] text-slate-400">{prod.reworkType}</p>
                          </td>
                          <td className="p-2.5">
                            <p className="font-bold text-slate-800">{prod.materialName}</p>
                            <p className="text-[10px] text-slate-400 font-mono">批次: {prod.batchNo}</p>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold">{prod.targetQty}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prod.flStatus === 2 ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>
                              {prod.flStatus === 2 ? "FIFO发料完成" : "待发料"}
                            </span>
                          </td>
                          <td className="p-2.5">{renderReworkProdStatus(prod.status)}</td>
                          <td className="p-2.5 text-center space-x-2">
                            {prod.status === "待领料" && (
                              <button onClick={() => handleReworkFIFOIssue(prod)} className="bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded font-bold">FIFO发料</button>
                            )}
                            {prod.status === "生产中" && (
                              <>
                                <button onClick={() => handleReworkLog(prod)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold">记录工艺</button>
                                <button onClick={() => handleReworkFinish(prod)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold">完工入库</button>
                                <button onClick={() => handleReworkForceClose(prod)} className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded font-bold">强制完工</button>
                              </>
                            )}
                            {prod.status === "待领料" && (
                              <button onClick={() => handleReworkForceClose(prod)} className="bg-rose-500 hover:bg-rose-600 text-white px-2.5 py-1 rounded font-bold">强制完工</button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === 2. 工艺BOM配方管理页面 === */}
          {activeMenu === "boms" && (
            <div className="grid grid-cols-3 gap-6 items-start fade-in">
              {/* 左侧 BOM 列表 */}
              <div className="col-span-1 bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <span className="font-bold text-slate-700 text-xs">配方BOM主表</span>
                  <button 
                    onClick={() => handleOpenBomWizard(null)}
                    className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> 级联新建BOM
                  </button>
                </div>
                <div className="p-2 space-y-2">
                  <input 
                    type="text" 
                    placeholder="输入编码或成品检索..." 
                    value={searchBom}
                    onChange={(e) => setSearchBom(e.target.value)}
                    className="border border-slate-200 rounded px-2 py-1 w-full text-[11px]"
                  />
                  <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto no-scrollbar">
                    {filteredBoms.map(b => (
                      <div 
                        key={b.id} 
                        onClick={() => setSelectedBom(b)}
                        className={`p-3 rounded-lg cursor-pointer transition text-xs mt-1 ${selectedBom?.id === b.id ? "bg-indigo-50 border-l-4 border-indigo-600" : "hover:bg-slate-50"}`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">{b.code}</span>
                          <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 py-0.5 rounded font-bold">{b.type}BOM</span>
                        </div>
                        <h4 className="font-bold text-slate-800 mt-1">{b.name}</h4>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">对应物料: {b.materialCode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右侧级联大详情可视化 */}
              <div className="col-span-2 space-y-6">
                {selectedBom ? (
                  <>
                    {/* BOM 主属性与组成明细 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                      <div className="flex justify-between border-b pb-3 mb-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm">{selectedBom.name}</h3>
                          <p className="text-[11px] text-slate-400 mt-1 font-mono">BOM编号: {selectedBom.code} (版本: {selectedBom.version})</p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded font-bold h-fit">启用中</span>
                      </div>

                      <h4 className="font-bold text-slate-700 text-xs mb-2">配方投料配比组成</h4>
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold border-b">
                            <th className="py-2 px-3">物料编码</th>
                            <th className="py-2 px-3">规格名称</th>
                            <th className="py-2 px-3">物料分类</th>
                            <th className="py-2 px-3 text-right">投料参考配比</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {bomItems.filter(bi => bi.bomId === selectedBom.id).map(item => (
                            <tr key={item.id} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-mono text-slate-500">{item.materialCode}</td>
                              <td className="py-2 px-3 font-semibold text-slate-700">{item.materialName}</td>
                              <td className="py-2 px-3">
                                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{item.type}</span>
                              </td>
                              <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">{item.ratio}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 工艺路线图 & 步骤投料与控制参数综合看板 */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
                      <h3 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1">
                        <Activity className="w-4 h-4 text-indigo-500" />
                        中控工艺步骤路线与控制标准
                      </h3>
                      
                      <div className="space-y-4">
                        {bomSteps.filter(bs => bs.bomId === selectedBom.id).map((step, idx) => {
                          const stepFeeds = bomStepFeeds.filter(bf => bf.bomId === selectedBom.id && bf.stepNum === step.stepNum);
                          const stepParams = bomParams.filter(bp => bp.stepId === step.id);

                          return (
                            <div key={step.id} className="border border-slate-100 rounded-lg p-3 bg-slate-50">
                              {/* 步骤基本信息 */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                                    {step.stepNum}
                                  </span>
                                  <span className="font-bold text-slate-800 text-xs">{step.desc}</span>
                                </div>
                                <span className="text-[10px] text-slate-400">工艺卡片 #{idx+1}</span>
                              </div>

                              {/* 该步骤投入哪些原料/包材 */}
                              <div className="mb-2 pl-7 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] text-slate-400 font-bold">工序投料:</span>
                                {stepFeeds.length === 0 ? (
                                  <span className="text-[10px] text-slate-300">本步骤不发生投料动作</span>
                                ) : (
                                  stepFeeds.map(f => (
                                    <span key={f.id} className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded px-1.5 py-0.5 text-[9px] font-semibold">
                                      {f.materialName} ({f.materialCode})
                                    </span>
                                  ))
                                )}
                              </div>

                              {/* 该步骤包含的温湿度压力参数 */}
                              {stepParams.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 pl-7 mt-2 pt-2 border-t border-dashed border-slate-200">
                                  {stepParams.map(param => (
                                    <div key={param.id} className="bg-white p-2 rounded border border-slate-100 flex justify-between items-center text-[10px]">
                                      <span className="text-slate-400">{param.name}</span>
                                      <span className="font-bold text-indigo-700">
                                        {param.planVal} {param.unit} <span className="text-slate-300 font-normal">({param.minVal}~{param.maxVal})</span>
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 border border-dashed rounded-xl text-center bg-white text-slate-400">
                    <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    请在左侧列表中点击选择一个BOM，以查看精细工艺流程图与控制标准
                  </div>
                )}
              </div>
            </div>
          )}

          {/* === 3. 计划单管理 === */}
          {activeMenu === "plans" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 fade-in">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-700 text-sm">待生产返工计划</span>
                  <p className="text-[11px] text-slate-400">选择待投产物料成品与执行BOM，一键下派并自动触发缺料MRP运算</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                      <th className="py-2.5 px-4">计划单号</th>
                      <th className="py-2.5 px-4">对应成品</th>
                      <th className="py-2.5 px-4">执行BOM配方</th>
                      <th className="py-2.5 px-4 text-right">计划总量</th>
                      <th className="py-2.5 px-4 text-right">已下派生产量</th>
                      <th className="py-2.5 px-4">计划周期</th>
                      <th className="py-2.5 px-4 text-center">状态</th>
                      <th className="py-2.5 px-4 text-center">指令流转</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plans.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{p.materialName}</td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">{p.bomCode}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold">{p.targetQty}</td>
                        <td className="py-3 px-4 text-right font-mono text-indigo-600 font-bold">{p.downQty}</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">{p.planStartDate} ~ {p.planEndDate}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded-full font-bold">已核准</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => handleReleaseProdOrder(p)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1 rounded shadow-sm"
                          >
                            下派生产
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === 4. 生产车间中控模块 === */}
          {activeMenu === "production" && (
            <div className="space-y-6 fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="font-bold text-slate-700 text-sm">车间生产指令监控台</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                        <th className="py-2.5 px-4">生产指令号</th>
                        <th className="py-2.5 px-4">返工/产出物料</th>
                        <th className="py-2.5 px-4 text-right">投产数量</th>
                        <th className="py-2.5 px-4">发料情况</th>
                        <th className="py-2.5 px-4">工序状态</th>
                        <th className="py-2.5 px-4 text-center">指令流转</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {productionOrders.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-8 text-center text-slate-400">
                            暂无运行中生产单。请前往计划管理页面下派生产！
                          </td>
                        </tr>
                      ) : (
                        productionOrders.map(o => (
                          <tr key={o.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4 font-mono font-bold text-indigo-600">{o.code}</td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-800">{o.materialName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">工艺BOM: {o.bomCode}</p>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold">{o.targetQty}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${o.flStatus === 2 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                {o.flStatus === 2 ? "先进先出配料完成" : "等待配发料"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                o.status === 1 ? "bg-orange-100 text-orange-800" :
                                o.status === 2 ? "bg-sky-100 text-sky-800" : "bg-green-100 text-green-800"
                              }`}>
                                {o.status === 1 && "待领发料"}
                                {o.status === 2 && "运行生产中"}
                                {o.status === 3 && "已完工结案"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center space-x-2">
                              {o.status === 1 && (
                                <button onClick={() => handleFIFOIssue(o)} className="bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1 rounded font-bold shadow-sm">
                                  FIFO自动发料
                                </button>
                              )}
                              {o.status === 2 && (
                                <>
                                  <button 
                                    onClick={() => {
                                      const time = new Date().toLocaleString();
                                      setFeeds([{
                                        id: `FD-${Date.now().toString().slice(-4)}`,
                                        prodOrderCode: o.code,
                                        feedTime: time,
                                        stepNum: 1,
                                        stepDesc: "按计量投入原辅包装物料",
                                        note: "原料计量无偏离，工艺压力、温控状态合规入录"
                                      }, ...feeds]);
                                      showToast("车间工艺参数、投料日志记录成功！");
                                    }} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold shadow-sm"
                                  >
                                    录入中控工艺日志
                                  </button>
                                  <button onClick={() => handleFinishProduction(o)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold shadow-sm">
                                    完工入库
                                  </button>
                                </>
                              )}
                              {o.status === 3 && <span className="text-slate-300 font-bold">工艺流程终结</span>}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 中控与出库发料审计 */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-1">
                    <Activity className="w-4 h-4 text-indigo-500" /> 中控步骤运行及工艺参数历史审计
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {feeds.length === 0 ? (
                      <p className="text-slate-400 py-6 text-center">暂无工序记录</p>
                    ) : (
                      feeds.map(f => (
                        <div key={f.id} className="p-2.5 bg-slate-50 rounded border border-slate-100">
                          <div className="flex justify-between text-slate-400 font-mono text-[10px]">
                            <span>指令: {f.prodOrderCode}</span>
                            <span>{f.feedTime}</span>
                          </div>
                          <p className="font-bold mt-1 text-slate-800">【工序{f.stepNum}】 {f.stepDesc}</p>
                          <p className="text-[10px] text-indigo-600 mt-0.5">{f.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> 先进先出 (FIFO) 仓库发料轨迹
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                    {returns.length === 0 ? (
                      <p className="text-slate-400 py-6 text-center">暂无发料历史</p>
                    ) : (
                      returns.map(r => (
                        <div key={r.id} className="p-2.5 bg-slate-50 rounded border border-slate-100 text-[11px] flex justify-between items-center">
                          <div>
                            <p className="font-bold text-slate-800">{r.id}</p>
                            <p className="text-slate-400 font-mono text-[9px]">指令单: {r.orderCode}</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-emerald-50 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded font-bold">{r.type}</span>
                            <p className="text-[9px] text-slate-400 mt-1 font-mono">{r.time}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === 5. 批次库存账册 === */}
          {activeMenu === "batches" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 fade-in">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <span className="font-bold text-slate-700 text-sm">物料批次与安全有效期控制账册</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 font-bold border-b border-slate-200">
                      <th className="py-2.5 px-4">系统唯一批次号</th>
                      <th className="py-2.5 px-4">物料</th>
                      <th className="py-2.5 px-4">批次类型</th>
                      <th className="py-2.5 px-4">来源单据</th>
                      <th className="py-2.5 px-4">生产日期</th>
                      <th className="py-2.5 px-4">有效期至</th>
                      <th className="py-2.5 px-4 text-right">在库数量</th>
                      <th className="py-2.5 px-4">质检状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {batches.map(b => {
                      const isExp = Math.ceil((new Date(b.expDate) - Date.now()) / (1000*60*60*24)) <= 30;
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">{b.batchNo}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{b.materialName}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.type === 1 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-teal-800"}`}>
                              {b.type === 1 ? "采购回料" : "完工产出"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-400">{b.sourceNo || "-"}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{b.mfgDate}</td>
                          <td className="py-3 px-4 font-mono">
                            <span className={isExp ? "text-rose-600 font-bold" : "text-slate-500"}>{b.expDate}</span>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{b.stockQty.toLocaleString()}</td>
                          <td className="py-3 px-4 text-emerald-600 font-bold">● 合格放行</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === 6. 申购需求行 (欠料MRP) === */}
          {activeMenu === "requisitions" && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 fade-in">
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <span className="font-bold text-slate-700 text-sm">物料MRP展开深度欠料需求 (物料需求行)</span>
                <p className="text-[11px] text-slate-400 mt-1">系统全自动展开关联BOM并检索对应物料的批次合格可用库存。若产生缺口，在此智能警示。</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                      <th className="py-2.5 px-4">关联下达指令</th>
                      <th className="py-2.5 px-4">需料原料/包材</th>
                      <th className="py-2.5 px-4 text-right">投产所需用量</th>
                      <th className="py-2.5 px-4 text-right">当前可用库存</th>
                      <th className="py-2.5 px-4 text-right text-rose-600">补充采购缺口</th>
                      <th className="py-2.5 px-4">处理状态</th>
                      <th className="py-2.5 px-4 text-center">快捷操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requisitions.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-10 text-center text-slate-400">目前物料充沛，无任何生产欠料缺口。</td>
                      </tr>
                    ) : (
                      requisitions.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-mono font-semibold text-slate-500">{r.prodOrderCode}</td>
                          <td className="py-3 px-4 font-bold text-slate-800">{r.materialName}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-600">{r.needQty}</td>
                          <td className="py-3 px-4 text-right font-mono text-slate-400">{r.stockQty}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">{r.shortfall}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.status === 1 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                              {r.status === 1 ? "已生成申购单" : "等待处理"}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {r.status === 0 ? (
                              <button onClick={() => handleAutoRequisition(r)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold">
                                一键生成申购单
                              </button>
                            ) : (
                              <span className="text-slate-300 font-bold">已流转</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === 7. 采购/到货验收模块 === */}
          {activeMenu === "purchases" && (
            <div className="space-y-6 fade-in">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="font-bold text-slate-700 text-sm">合并采购申购指令</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                        <th className="py-2.5 px-4">合并申购单号</th>
                        <th className="py-2.5 px-4">物料</th>
                        <th className="py-2.5 px-4 text-right">申购点收数</th>
                        <th className="py-2.5 px-4">采购状态</th>
                        <th className="py-2.5 px-4 text-center">物流命令</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {purchases.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-center text-slate-400">暂无申购信息。请先前往物控欠料页一键生成</td>
                        </tr>
                      ) : (
                        purchases.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-mono font-bold text-slate-700">{p.reqNo}</td>
                            <td className="py-3 px-4 font-bold text-slate-800">{p.materialName}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold">{p.qty}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                p.purStatus === 3 ? "bg-green-100 text-green-800" :
                                p.purStatus === 2 ? "bg-indigo-100 text-indigo-800" : "bg-amber-100 text-amber-800"
                              }`}>
                                {p.purStatus === 1 && "待向供应链下单"}
                                {p.purStatus === 2 && "供应商到货途中"}
                                {p.purStatus === 3 && "已点收并上架库存"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {p.purStatus === 1 ? (
                                <button onClick={() => handleCreatePurchase(p)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded font-bold shadow-sm">
                                  向供应商订货下单
                                </button>
                              ) : (
                                <span className="text-slate-400 font-bold">采购命令已激活</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <span className="font-bold text-slate-700 text-sm">采购订单供应商回料与质量验收</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                        <th className="py-2.5 px-4">采购单号</th>
                        <th className="py-2.5 px-4">指定外部厂家</th>
                        <th className="py-2.5 px-4">原辅包装物料</th>
                        <th className="py-2.5 px-4 text-right">订购数</th>
                        <th className="py-2.5 px-4 text-right">实收数</th>
                        <th className="py-2.5 px-4">状态</th>
                        <th className="py-2.5 px-4 text-center">到货动作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stockIns.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-6 text-center text-slate-400">暂无物流在途，请先在上方提报采购单！</td>
                        </tr>
                      ) : (
                        stockIns.map(si => (
                          <tr key={si.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-mono font-bold text-slate-700">{si.poNo}</td>
                            <td className="py-3 px-4 text-slate-500 font-medium">{si.supplier}</td>
                            <td className="py-3 px-4 font-bold text-slate-800">{si.materialName}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold">{si.qty}</td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">{si.rcvQty}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${si.status === 1 ? "bg-green-100 text-green-800" : "bg-rose-100 text-rose-800"}`}>
                                {si.status === 1 ? "回料验收通过" : "在途"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {si.status === 0 ? (
                                <button onClick={() => handleReceivePurchase(si)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded font-bold shadow-sm">
                                  到货质量点收
                                </button>
                              ) : (
                                <span className="text-slate-300 font-bold">点收合格结案</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </section>
      </main>

      {/* ======================================================== */}
      {/* ======================= 弹窗组件 ======================= */}
      {/* ======================================================== */}

      {/* --- 1. 新增物料弹窗 (包含关联已有BOM或一键新增级联BOM) --- */}
      {showModal === "materialAdd" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">登记新增物料信息</h3>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const code = fd.get("code");
              const name = fd.get("name");
              const type = fd.get("type");
              const unit = fd.get("unit");
              const bomOpt = fd.get("bomOpt"); // "none", "choose", "new"
              const chooseBomCode = fd.get("chooseBomCode");

              if (!code || !name) {
                alert("物料编码与名称为必填字段！");
                return;
              }

              let finalBomCode = "";
              if (["配方", "配方产品", "中间品", "产品"].includes(type)) {
                if (bomOpt === "choose") finalBomCode = chooseBomCode;
              }

              const newMat = {
                id: `M${(materials.length + 1).toString().padStart(3, "0")}`,
                code, name, type, unit, status: 1, bomCode: finalBomCode
              };

              // 写入物料主表
              setMaterials([...materials, newMat]);
              setShowModal(null);
              showToast("新物料卡片登记成功！");

              // 核心级联逻辑：若选中的是“一键新增BOM”，则立刻唤起级联BOM五合一向导
              if (bomOpt === "new") {
                setTimeout(() => {
                  handleOpenBomWizard(code);
                }, 500);
              }
            }} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">大类物料编码 *</label>
                  <input type="text" name="code" defaultValue={`MAT-NEW-${Date.now().toString().slice(-4)}`} className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-indigo-600 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">大类类型分类</label>
                  <select 
                    name="type" 
                    id="new_mat_type"
                    onChange={(e) => {
                      const selType = e.target.value;
                      const bomSection = document.getElementById("bom_relation_section");
                      if (bomSection) {
                        if (["配方", "配方产品", "中间品", "产品"].includes(selType)) {
                          bomSection.classList.remove("hidden");
                        } else {
                          bomSection.classList.add("hidden");
                        }
                      }
                    }}
                    className="w-full border border-slate-200 rounded px-3 py-2 bg-white"
                  >
                    {MATERIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">物料规格及名称 *</label>
                <input type="text" name="name" required placeholder="例如：大马士革玫瑰精油 (返工级)" className="w-full border border-slate-200 rounded px-3 py-2 focus:outline-indigo-600" />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">包装核算单位</label>
                <input type="text" name="unit" defaultValue="个" className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-indigo-600" />
              </div>

              {/* 当物料类型需要配方支持时，显示的BOM关联区域 */}
              <div id="bom_relation_section" className="border-t pt-3 space-y-2 hidden">
                <p className="font-bold text-indigo-700 flex items-center gap-1">
                  <FileText className="w-4 h-4" /> 关联与绑定工艺BOM配方
                </p>
                
                <div className="bg-indigo-50/50 p-3 rounded border border-indigo-100 space-y-3">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="bomOpt" value="none" defaultChecked onClick={() => {
                        document.getElementById("choose_bom_wrapper")?.classList.add("hidden");
                      }} />
                      <span>暂不关联BOM</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="radio" name="bomOpt" value="choose" onClick={() => {
                        document.getElementById("choose_bom_wrapper")?.classList.remove("hidden");
                      }} />
                      <span>绑定已有BOM</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-indigo-700 font-bold">
                      <input type="radio" name="bomOpt" value="new" onClick={() => {
                        document.getElementById("choose_bom_wrapper")?.classList.add("hidden");
                      }} />
                      <span>一键创建全新工艺BOM</span>
                    </label>
                  </div>

                  <div id="choose_bom_wrapper" className="hidden">
                    <label className="block font-bold text-slate-400 mb-1">选择对应的已有BOM</label>
                    <select name="chooseBomCode" className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white font-mono">
                      <option value="">-- 请选择匹配类型的BOM --</option>
                      {boms.map(b => (
                        <option key={b.id} value={b.code}>{b.code} ({b.name})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t">
                <button type="button" onClick={() => setShowModal(null)} className="px-4 py-2 border rounded text-slate-500 hover:bg-slate-50">取消</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 shadow-md">保存创建</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. 五合一极简精美BOM配置向导弹窗 (主表、明细、步骤、投料、参数一并配置) --- */}
      {showModal === "bomWizard" && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in">
            {/* 顶栏 */}
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">工艺BOM级联智能配置向导 (5合1联动配置)</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">一站式录入：工艺BOM主表、原辅包材成分明细、设备工艺步骤、步骤投料明细、中控温控质量参数</p>
              </div>
              <button onClick={() => setShowModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 步骤指示条 */}
            <div className="bg-slate-100/50 p-3 border-b flex justify-around text-[10px] font-bold text-slate-400">
              <span className={`pb-1 px-4 ${wizardStep === 1 ? "text-indigo-600 border-b-2 border-indigo-600 font-extrabold" : ""}`}>1. BOM主信息与成分配比</span>
              <span className={`pb-1 px-4 ${wizardStep === 2 ? "text-indigo-600 border-b-2 border-indigo-600 font-extrabold" : ""}`}>2. 工艺路线工序配置</span>
              <span className={`pb-1 px-4 ${wizardStep === 3 ? "text-indigo-600 border-b-2 border-indigo-600 font-extrabold" : ""}`}>3. 工序投料分配与参数指标</span>
            </div>

            {/* 步骤表单内容 */}
            <div className="p-5 min-h-[320px] max-h-[480px] overflow-y-auto text-xs space-y-4">
              
              {/* 向导第一步 */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <p className="font-bold text-indigo-700 bg-indigo-50 p-2 rounded">第一步：配置BOM主属性及原辅包材组成明细（有严格的递进物料类型约束检验）</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">BOM 唯一编号 *</label>
                      <input type="text" value={wizardBom.code} disabled className="w-full border bg-slate-100 rounded px-3 py-1.5 font-mono text-slate-400" />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">工艺BOM名称 *</label>
                      <input 
                        type="text" 
                        value={wizardBom.name}
                        onChange={(e) => setWizardBom({ ...wizardBom, name: e.target.value })}
                        placeholder="例如: 玻尿酸精华液(返工级)标准工艺路线" 
                        className="w-full border border-slate-200 rounded px-3 py-1.5 focus:outline-indigo-600" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">对应目标物料 (仅列出配方/配方产品/中间品/产品) *</label>
                      <select 
                        value={wizardBom.materialCode}
                        onChange={(e) => {
                          const mCode = e.target.value;
                          const mat = materials.find(m => m.code === mCode);
                          setWizardBom({ ...wizardBom, materialCode: mCode, type: mat ? mat.type : "产品", items: [] });
                        }}
                        className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white"
                      >
                        <option value="">-- 请选择物料 --</option>
                        {materials.filter(m => ["配方", "配方产品", "中间品", "产品"].includes(m.type)).map(m => (
                          <option key={m.id} value={m.code}>{m.name} ({m.code}) [{m.type}]</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1">版本号</label>
                      <input type="text" value={wizardBom.version} onChange={(e) => setWizardBom({ ...wizardBom, version: e.target.value })} className="w-full border border-slate-200 rounded px-3 py-1.5 font-mono focus:outline-indigo-600" />
                    </div>
                  </div>

                  {wizardBom.materialCode && (
                    <div className="border p-3 rounded-lg bg-slate-50/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-slate-700">添加配料组成明细</span>
                        <span className="text-[10px] text-indigo-700 font-bold">
                          约束条件:
                          {wizardBom.type === "配方" && " 仅允许添加【原料】"}
                          {wizardBom.type === "配方产品" && " 仅允许添加【配方】"}
                          {wizardBom.type === "中间品" && " 仅允许添加【配方产品】和【内包材】"}
                          {wizardBom.type === "产品" && " 仅允许添加【中间品】和【外包材】"}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <select id="wizard_item_select" className="border px-2 py-1 bg-white flex-1 text-xs">
                          <option value="">选择符合约束类型的物料</option>
                          {getAvailableSubMaterials(wizardBom.type).map(m => (
                            <option key={m.id} value={m.code}>{m.name} ({m.code}) [{m.type}]</option>
                          ))}
                        </select>
                        <input type="number" id="wizard_item_ratio" placeholder="百分比配比" className="border px-2 py-1 w-24 text-xs focus:outline-indigo-600 font-mono" />
                        <span className="font-bold">%</span>
                        <button 
                          type="button"
                          onClick={() => {
                            const selectEl = document.getElementById("wizard_item_select");
                            const ratioEl = document.getElementById("wizard_item_ratio");
                            if (!selectEl.value || !ratioEl.value) {
                              alert("物料和投料配比不能留空！");
                              return;
                            }
                            const matchedM = materials.find(m => m.code === selectEl.value);
                            const newIt = {
                              materialCode: selectEl.value,
                              materialName: matchedM.name,
                              type: matchedM.type,
                              ratio: parseFloat(ratioEl.value)
                            };
                            setWizardBom({ ...wizardBom, items: [...wizardBom.items, newIt] });
                            selectEl.value = "";
                            ratioEl.value = "";
                          }}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1 rounded"
                        >
                          加入
                        </button>
                      </div>

                      {/* 当前已添加的原料明细表 */}
                      <table className="w-full text-left text-xs bg-white border">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b text-slate-500">
                            <th className="p-2">物料编码</th>
                            <th className="p-2">规格名称</th>
                            <th className="p-2 text-right">投料参考配比</th>
                            <th className="p-2 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {wizardBom.items.length === 0 ? (
                            <tr><td colSpan="4" className="p-3 text-center text-slate-400">尚未配置任何原辅包装物料组成明细</td></tr>
                          ) : (
                            wizardBom.items.map((it, idx) => (
                              <tr key={idx}>
                                <td className="p-2 font-mono">{it.materialCode}</td>
                                <td className="p-2 font-bold text-slate-700">{it.materialName}</td>
                                <td className="p-2 text-right font-mono font-bold text-slate-800">{it.ratio}%</td>
                                <td className="p-2 text-center">
                                  <button type="button" onClick={() => {
                                    setWizardBom({ ...wizardBom, items: wizardBom.items.filter((_, i) => i !== idx) });
                                  }} className="text-rose-600 hover:underline">删除</button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 向导第二步 */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <p className="font-bold text-indigo-700 bg-indigo-50 p-2 rounded">第二步：规划生产此产品需要执行的设备工艺路线步骤（工序路线）</p>
                  
                  <div className="border p-3 rounded-lg bg-slate-50/50 space-y-3">
                    <span className="font-bold text-slate-700 block">添加工艺工序步骤</span>
                    
                    <div className="flex gap-2">
                      <input type="number" id="wizard_step_num" defaultValue={wizardBom.steps.length + 1} disabled className="border bg-slate-100 font-mono text-center w-14" />
                      <input type="text" id="wizard_step_desc" placeholder="请输入工艺工序步骤描述（如：玻璃瓶定量灌装并套泵头）" className="border px-2 py-1.5 flex-1 focus:outline-indigo-600" />
                      <button 
                        type="button"
                        onClick={() => {
                          const descEl = document.getElementById("wizard_step_desc");
                          if (!descEl.value) return;
                          const newStep = {
                            stepNum: wizardBom.steps.length + 1,
                            desc: descEl.value
                          };
                          setWizardBom({ ...wizardBom, steps: [...wizardBom.steps, newStep] });
                          descEl.value = "";
                        }}
                        className="bg-indigo-600 text-white font-bold text-xs px-4 py-1.5 rounded"
                      >
                        添加工序
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {wizardBom.steps.map((st, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-600 text-white flex items-center justify-center font-mono font-bold text-[10px]">{st.stepNum}</span>
                            <span className="font-bold text-slate-700">{st.desc}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => {
                              const remainSteps = wizardBom.steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNum: i + 1 }));
                              setWizardBom({ ...wizardBom, steps: remainSteps });
                            }} 
                            className="text-rose-600 font-bold hover:underline"
                          >
                            移除
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 向导第三步 */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <p className="font-bold text-indigo-700 bg-indigo-50 p-2 rounded">第三步：步骤投料明细分配 ➔ 将第一步配置的原料/包材，具体分配在第几个工序中投入。同时添加温控、搅拌转速质量中控参数配置。</p>
                  
                  {/* 工序投料映射 */}
                  <div className="border p-3 rounded-lg bg-slate-50/50 space-y-3">
                    <span className="font-bold text-slate-700 block">1. 分配工艺步骤对应的物料投入（步骤投料明细）</span>
                    
                    <div className="flex gap-2 items-center">
                      <select id="wizard_map_step" className="border px-2 py-1 bg-white text-xs">
                        {wizardBom.steps.map(s => (
                          <option key={s.stepNum} value={s.stepNum}>步骤 {s.stepNum}: {s.desc.slice(0, 15)}...</option>
                        ))}
                      </select>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <select id="wizard_map_item" className="border px-2 py-1 bg-white text-xs">
                        {wizardBom.items.map((it, idx) => (
                          <option key={idx} value={it.materialCode}>{it.materialName} ({it.materialCode})</option>
                        ))}
                      </select>
                      <button 
                        type="button"
                        onClick={() => {
                          const stepEl = document.getElementById("wizard_map_step");
                          const itemEl = document.getElementById("wizard_map_item");
                          if (!stepEl.value || !itemEl.value) return;
                          
                          const matchedM = materials.find(m => m.code === itemEl.value);
                          const isExist = wizardBom.stepFeeds.some(f => f.stepNum === Number(stepEl.value) && f.materialCode === itemEl.value);
                          if (isExist) {
                            alert("该步骤已经分配过此物料！");
                            return;
                          }

                          const newFeed = {
                            stepNum: Number(stepEl.value),
                            materialCode: itemEl.value,
                            materialName: matchedM.name
                          };
                          setWizardBom({ ...wizardBom, stepFeeds: [...wizardBom.stepFeeds, newFeed] });
                        }}
                        className="bg-indigo-600 text-white px-3 py-1 rounded font-bold shadow"
                      >
                        确认分配投料
                      </button>
                    </div>

                    <div className="flex gap-2 flex-wrap bg-white p-2.5 rounded border min-h-[48px]">
                      {wizardBom.stepFeeds.length === 0 ? (
                        <span className="text-slate-400">目前尚未建立任何工艺步骤到物料投入的映射。</span>
                      ) : (
                        wizardBom.stepFeeds.map((fd, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-800 border border-indigo-100 rounded px-2 py-0.5 flex items-center gap-1">
                            <span>【步骤 {fd.stepNum}】{fd.materialName}</span>
                            <X className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500 cursor-pointer" onClick={() => {
                              setWizardBom({ ...wizardBom, stepFeeds: wizardBom.stepFeeds.filter((_, i) => i !== idx) });
                            }} />
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* 步骤中控参数指标 */}
                  <div className="border p-3 rounded-lg bg-slate-50/50 space-y-3">
                    <span className="font-bold text-slate-700 block">2. 设定工序质量中控设备监控红线参数 (工艺参数标准)</span>
                    
                    <div className="grid grid-cols-6 gap-2">
                      <select id="wizard_param_step" className="border px-2 py-1 bg-white text-xs col-span-1">
                        {wizardBom.steps.map(s => <option key={s.stepNum} value={s.stepNum}>步骤 {s.stepNum}</option>)}
                      </select>
                      <input type="text" id="wizard_param_name" placeholder="参数名(如反应温度)" className="border px-2 py-1 text-xs col-span-1 focus:outline-indigo-600" />
                      <input type="text" id="wizard_param_val" placeholder="控制标准" className="border px-2 py-1 text-xs col-span-1 focus:outline-indigo-600 font-mono" />
                      <input type="text" id="wizard_param_unit" placeholder="单位(℃)" className="border px-2 py-1 text-xs col-span-1 focus:outline-indigo-600 font-mono" />
                      <input type="text" id="wizard_param_min" placeholder="最低限" className="border px-2 py-1 text-xs col-span-1 focus:outline-indigo-600 font-mono" />
                      <input type="text" id="wizard_param_max" placeholder="最高限" className="border px-2 py-1 text-xs col-span-1 focus:outline-indigo-600 font-mono" />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        type="button"
                        onClick={() => {
                          const stepEl = document.getElementById("wizard_param_step");
                          const nameEl = document.getElementById("wizard_param_name");
                          const valEl = document.getElementById("wizard_param_val");
                          const unitEl = document.getElementById("wizard_param_unit");
                          const minEl = document.getElementById("wizard_param_min");
                          const maxEl = document.getElementById("wizard_param_max");

                          if (!nameEl.value || !valEl.value) {
                            alert("请输入参数名称及标准设定值！");
                            return;
                          }

                          const newParam = {
                            stepNum: Number(stepEl.value),
                            name: nameEl.value,
                            planVal: valEl.value,
                            unit: unitEl.value,
                            minVal: minEl.value || valEl.value,
                            maxVal: maxEl.value || valEl.value
                          };

                          setWizardBom({ ...wizardBom, params: [...wizardBom.params, newParam] });
                          nameEl.value = "";
                          valEl.value = "";
                          unitEl.value = "";
                          minEl.value = "";
                          maxEl.value = "";
                        }}
                        className="bg-indigo-600 text-white px-4 py-1 rounded font-bold"
                      >
                        加入参数控制指标
                      </button>
                    </div>

                    <div className="bg-white rounded border overflow-hidden">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 font-bold border-b text-slate-500">
                            <th className="p-1.5 pl-3">步骤</th>
                            <th className="p-1.5">监控参数</th>
                            <th className="p-1.5 text-center">指标标准值</th>
                            <th className="p-1.5 text-center">上下限红线值</th>
                            <th className="p-1.5 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-slate-600">
                          {wizardBom.params.length === 0 ? (
                            <tr><td colSpan="5" className="p-3 text-center text-slate-400">尚未配置任何质量控制参数。</td></tr>
                          ) : (
                            wizardBom.params.map((pm, idx) => (
                              <tr key={idx}>
                                <td className="p-1.5 pl-3 font-bold">工序 #{pm.stepNum}</td>
                                <td className="p-1.5">{pm.name}</td>
                                <td className="p-1.5 text-center font-mono font-bold text-indigo-600">{pm.planVal} {pm.unit}</td>
                                <td className="p-1.5 text-center font-mono text-slate-400">({pm.minVal}~{pm.maxVal})</td>
                                <td className="p-1.5 text-center">
                                  <button type="button" onClick={() => {
                                    setWizardBom({ ...wizardBom, params: wizardBom.params.filter((_, i) => i !== idx) });
                                  }} className="text-rose-600 hover:underline">删除</button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* 向导底部控制台 (只有满足强制校验：有明细、有步骤、有投料、有参数，才能最终保存) */}
            <div className="p-4 border-t bg-slate-50 flex justify-between items-center text-xs">
              <button 
                type="button" 
                disabled={wizardStep === 1}
                onClick={() => setWizardStep(prev => prev - 1)}
                className="px-4 py-2 border rounded font-semibold text-slate-500 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一步
              </button>
              
              <div className="flex items-center gap-2">
                {wizardStep < 3 ? (
                  <button 
                    type="button" 
                    onClick={() => {
                      if (wizardStep === 1) {
                        if (!wizardBom.name || !wizardBom.materialCode) {
                          alert("请完整填写BOM工艺名称及绑定的对应成品/半成品物料！");
                          return;
                        }
                        if (wizardBom.items.length === 0) {
                          alert("在第一步中，必须至少配置一种下级原辅包装物料成分明细配比，这是BOM明细约束的核心！");
                          return;
                        }
                      }
                      setWizardStep(prev => prev + 1);
                    }}
                    className="px-5 py-2 bg-indigo-600 text-white font-bold rounded shadow-md hover:bg-indigo-700"
                  >
                    下一步
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={() => {
                      if (wizardBom.items.length === 0 || wizardBom.steps.length === 0 || wizardBom.stepFeeds.length === 0 || wizardBom.params.length === 0) {
                        alert("强校验拦截：一个合格的级联BOM配方，其‘主表、配比明细、工艺步骤、步骤投料明细、控制参数指标’五者缺一不可，请全部配置完整后再保存！");
                        return;
                      }

                      // --- 1. 创建BOM主表 ---
                      const newBId = `B00${boms.length + 1}`;
                      const newB = {
                        id: newBId,
                        code: wizardBom.code,
                        name: wizardBom.name,
                        materialCode: wizardBom.materialCode,
                        type: wizardBom.type,
                        version: wizardBom.version,
                        status: 1
                      };

                      // --- 2. 创建BOM明细 ---
                      const newItems = wizardBom.items.map((it, idx) => ({
                        id: `BI${Date.now()}-${idx}`,
                        bomId: newBId,
                        materialCode: it.materialCode,
                        materialName: it.materialName,
                        ratio: it.ratio,
                        type: it.type
                      }));

                      // --- 3. 创建工艺步骤 ---
                      const newSteps = wizardBom.steps.map((st, idx) => ({
                        id: `BS${Date.now()}-${idx}`,
                        bomId: newBId,
                        stepNum: st.stepNum,
                        desc: st.desc
                      }));

                      // --- 4. 创建步骤投料 ---
                      const newFeeds = wizardBom.stepFeeds.map((fd, idx) => ({
                        id: `BF${Date.now()}-${idx}`,
                        bomId: newBId,
                        stepNum: fd.stepNum,
                        materialCode: fd.materialCode,
                        materialName: fd.materialName
                      }));

                      // --- 5. 创建中控控制参数 ---
                      const newParams = wizardBom.params.map((pm, idx) => {
                        // 寻找对应新创建工艺步骤的 id
                        const stepIndex = wizardBom.steps.findIndex(s => s.stepNum === pm.stepNum);
                        const boundStepId = `BS${Date.now()}-${stepIndex}`;

                        return {
                          id: `BP${Date.now()}-${idx}`,
                          stepId: boundStepId,
                          name: pm.name,
                          planVal: pm.planVal,
                          unit: pm.unit,
                          minVal: pm.minVal,
                          maxVal: pm.maxVal
                        };
                      });

                      // 执行写入持久化
                      setBoms([...boms, newB]);
                      setBomItems([...bomItems, ...newItems]);
                      setBomSteps([...bomSteps, ...newSteps]);
                      setBomStepFeeds([...bomStepFeeds, ...newFeeds]);
                      setBomParams([...bomParams, ...newParams]);

                      // 核心联动：自动回填绑定到触发创建的物料对象上！
                      if (autoBindMaterialCode) {
                        setMaterials(materials.map(m => m.code === autoBindMaterialCode ? { ...m, bomCode: wizardBom.code } : m));
                      }

                      setShowModal(null);
                      setSelectedBom(newB);
                      showToast(`向导级联BOM ${wizardBom.code} 创建成功，主、细、工艺、投料及参数已全部配齐！并已自动将其回填绑定至物料！`);
                      setActiveMenu("boms");
                    }}
                    className="px-6 py-2 bg-emerald-600 text-white font-bold rounded shadow-md hover:bg-emerald-700"
                  >
                    配置完整并保存
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- 3. 新建返工单弹窗 --- */}
      {showModal === "reworkCreate" && reworkDraft && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in">
            <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">创建返工单草稿</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">填写返工原因与返工批次明细，提交后进入审批流。</p>
              </div>
              <button onClick={handleCloseReworkModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-500 mb-1">返工单号</label>
                  <input value={reworkDraft.code} disabled className="w-full border bg-slate-100 rounded px-3 py-1.5 font-mono text-slate-500" />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">返工类型</label>
                  <select 
                    value={reworkDraft.type}
                    onChange={(e) => setReworkDraft(prev => ({ ...prev, type: e.target.value, details: prev.details.map(item => ({ ...item, reworkType: e.target.value })) }))}
                    className="w-full border border-slate-200 rounded px-3 py-1.5 bg-white"
                  >
                    {REWORK_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 mb-1">计划起止</label>
                  <div className="flex gap-2">
                    <input type="date" value={reworkDraft.planStart} onChange={(e) => setReworkDraft(prev => ({ ...prev, planStart: e.target.value }))} className="flex-1 border border-slate-200 rounded px-2 py-1" />
                    <input type="date" value={reworkDraft.planEnd} onChange={(e) => setReworkDraft(prev => ({ ...prev, planEnd: e.target.value }))} className="flex-1 border border-slate-200 rounded px-2 py-1" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">返工原因说明 *</label>
                <textarea
                  value={reworkDraft.reason}
                  onChange={(e) => setReworkDraft(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full border border-slate-200 rounded px-3 py-2 resize-none"
                  placeholder="请准确说明触发返工的原因、质检结论或客户反馈..."
                />
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-700">返工批次明细</span>
                  <div className="text-[10px] text-slate-400">请先选择需要返工的物料与批次，再输入返工数量</div>
                </div>

                <div className="flex gap-2 mb-3">
                  <select 
                    value={reworkDraftDetail.materialCode}
                    onChange={(e) => setReworkDraftDetail(prev => ({ ...prev, materialCode: e.target.value }))}
                    className="border border-slate-200 rounded px-2 py-1 text-xs bg-white flex-1"
                  >
                    <option value="">选择返工物料</option>
                    {materials.filter(m => ["产品", "中间品", "配方产品"].includes(m.type)).map(m => (
                      <option key={m.id} value={m.code}>{m.name} ({m.code})</option>
                    ))}
                  </select>
                  <select 
                    value={reworkDraftDetail.batchId}
                    onChange={(e) => setReworkDraftDetail(prev => ({ ...prev, batchId: e.target.value }))}
                    className="border border-slate-200 rounded px-2 py-1 text-xs bg-white flex-1"
                  >
                    <option value="">选择现存批次</option>
                    {batches.filter(b => b.type !== 3).map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.batchNo} · {batch.materialName} · 可用{batch.stockQty}</option>
                    ))}
                  </select>
                  <input 
                    type="number"
                    value={reworkDraftDetail.qty}
                    onChange={(e) => setReworkDraftDetail(prev => ({ ...prev, qty: e.target.value }))}
                    placeholder="返工数量"
                    className="w-28 border border-slate-200 rounded px-2 py-1 text-xs font-mono"
                  />
                  <input 
                    type="text"
                    value={reworkDraftDetail.remark}
                    onChange={(e) => setReworkDraftDetail(prev => ({ ...prev, remark: e.target.value }))}
                    placeholder="备注"
                    className="flex-1 border border-slate-200 rounded px-2 py-1 text-xs"
                  />
                  <button onClick={handleAddDraftDetail} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-xs font-bold">加入</button>
                </div>

                <div className="bg-white border border-slate-200 rounded">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-slate-500 font-bold border-b">
                        <th className="p-2">物料</th>
                        <th className="p-2">批次</th>
                        <th className="p-2 text-right">数量</th>
                        <th className="p-2">BOM</th>
                        <th className="p-2">备注</th>
                        <th className="p-2 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {reworkDraft.details.length === 0 ? (
                        <tr><td colSpan="6" className="p-3 text-center text-slate-400">尚未添加任何返工批次</td></tr>
                      ) : (
                        reworkDraft.details.map(detail => (
                          <tr key={detail.id}>
                            <td className="p-2">
                              <p className="font-bold text-slate-800">{detail.materialName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{detail.materialCode}</p>
                            </td>
                            <td className="p-2 font-mono text-[11px] text-slate-500">{detail.batchNo}</td>
                            <td className="p-2 text-right font-mono font-bold">{detail.reworkQty}</td>
                            <td className="p-2 font-mono text-indigo-600">{detail.bomCode || "-"}</td>
                            <td className="p-2 text-slate-500">{detail.remark || "-"}</td>
                            <td className="p-2 text-center">
                              <button onClick={() => handleRemoveDraftDetail(detail.id)} className="text-rose-500 hover:underline">移除</button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 text-xs">
              <button onClick={handleCloseReworkModal} className="px-4 py-2 border border-slate-200 rounded text-slate-600 hover:bg-white">取消</button>
              <button onClick={handleSaveReworkDraft} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold">保存草稿</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
