# DWS 中间表 —— 建表语句（DDL）与查询示例

> 面向开发评审。6 张表 = 日 3（基础层）+ 月 3（汇总层，从日表派生）。
> 引擎统一 `ReplacingMergeTree`（保证幂等：同主键重跑覆盖不重复）；按月分区；`tenant_id` 为 ORDER BY 第一列；金额一律 `Decimal`；保留 3 年 TTL。

## 架构

```
基础层（日粒度，ETL 直接生成）        汇总层（月粒度，从日表派生）
┌──────────────────────────────┐    ┌──────────────────────────────┐
│ dws_tenant_daily             │ →  │ dws_tenant_monthly           │ 企业
│ dws_customer_daily           │ →  │ dws_customer_monthly         │ 客户
│ dws_customer_product_daily   │ →  │ dws_customer_product_monthly │ 产品
└──────────────────────────────┘    └──────────────────────────────┘
```

派生规则：**增量字段 → 当月各天 SUM；快照字段 → 取当月最后一天的值（不能 SUM）。**

---

# 一、基础层（日粒度）

## 表1 dws_tenant_daily（企业×天，35列）

```sql
CREATE TABLE dws_tenant_daily
(
    -- 维度
    tenant_id                Int64    COMMENT '租户ID',
    stat_date                Date     COMMENT '统计日期',

    -- 客户计数（快照；转化计数为增量）
    total_customers          Int32    COMMENT '截至当日客户总数(快照)',
    active_customers         Int32    COMMENT '截至当日活跃客户数(快照)',
    inactive_customers       Int32    COMMENT '截至当日非活跃客户数(快照)',
    no_order_customers       Int32    COMMENT '截至当日从未下单客户数(快照)',
    reorder_customers        Int32    COMMENT '截至当日有返单客户数(快照)',
    no_order_to_active_count Int32    COMMENT '当日未下单转活跃数(增量)',
    active_to_inactive_count Int32    COMMENT '当日活跃转非活跃数(增量)',

    -- 订单量
    order_count              Int32    COMMENT '当日新增订单总数(增量)',
    shipped_order_count      Int32    COMMENT '当日已发货订单数(增量)',
    in_production_count      Int32    COMMENT '截至当日在产订单数(快照)',
    unscheduled_count        Int32    COMMENT '截至当日未排产订单数(快照)',
    reorder_times            Int32    COMMENT '当日返单次数(增量)',

    -- 订单额
    order_amount             Decimal(14,2) COMMENT '当日新增订单总额(增量)',
    shipped_amount           Decimal(14,2) COMMENT '当日已发货订单额(增量)',
    in_production_amount     Decimal(14,2) COMMENT '截至当日在产订单额(快照)',
    unscheduled_amount       Decimal(14,2) COMMENT '截至当日未排产订单额(快照)',

    -- 出货
    shipping_count           Int32    COMMENT '当日出货数量(增量)',
    shipping_amount          Decimal(14,2) COMMENT '当日出货金额(增量)',

    -- 按期交付
    total_product_count      Int32    COMMENT '当日订单产品数(增量)',
    completed_count          Int32    COMMENT '当日已完成入库订单数(增量)',
    on_time_count            Int32    COMMENT '当日按期完成订单产品数(增量)',
    overdue_count            Int32    COMMENT '截至当日逾期未完成产品数(快照)',

    -- 利润
    budget_cost              Decimal(14,2) COMMENT '当日预算总成本(增量)',
    budget_profit            Decimal(14,2) COMMENT '当日预算总利润(增量)',
    actual_cost              Decimal(14,2) COMMENT '当日已发货实际总成本(增量)',
    actual_profit            Decimal(14,2) COMMENT '当日已发货实际总利润(增量)',

    -- 回款/应收
    collected_amount         Decimal(14,2) COMMENT '当日已收款金额(增量)',
    pending_amount           Decimal(14,2) COMMENT '截至当日待收款金额(快照)',
    receivable_amount        Decimal(14,2) COMMENT '当日已结算订单总额(增量)',
    remaining_unallocated    Decimal(14,2) COMMENT '截至当日剩余未分配收款(快照)',
    prepaid_unallocated      Decimal(14,2) COMMENT '截至当日预收/全款单未分配(快照)',
    monthly_unallocated      Decimal(14,2) COMMENT '截至当日月结单未分配(快照)',
    total_uncollected        Decimal(14,2) COMMENT '截至当日合计未收款(快照)'
)
ENGINE = ReplacingMergeTree
PARTITION BY toYYYYMM(stat_date)
ORDER BY (tenant_id, stat_date)
TTL stat_date + INTERVAL 3 YEAR;
```

## 表2 dws_customer_daily（客户×天，38列）—— 核心基础表

> ETL 以客户维表为基准生成行：从未下单的客户当天也要有行（指标全 0），否则「未下单客户数」统计不出来。

```sql
CREATE TABLE dws_customer_daily
(
    -- 维度（含维度退化：名称/地域平铺，查询免 JOIN）
    tenant_id                Int64    COMMENT '租户ID',
    stat_date                Date     COMMENT '统计日期',
    customer_id              Int64    COMMENT '客户ID',
    customer_name            LowCardinality(String) COMMENT '客户名称',
    country                  LowCardinality(String) COMMENT '国家',
    region_type              LowCardinality(String) COMMENT 'domestic/overseas',
    province                 LowCardinality(String) COMMENT '省份',
    city                     LowCardinality(String) COMMENT '城市',

    -- 状态标记（快照）
    is_active                UInt8    COMMENT '截至当日是否活跃 1/0(快照)',
    has_order                UInt8    COMMENT '历史是否下过单 1/0(快照)',
    is_reorder               UInt8    COMMENT '当日是否返单 1/0(快照)',
    status_change            LowCardinality(String) COMMENT '当日状态变化(增量)',

    -- 订单量
    order_count              Int32    COMMENT '当日新增订单数(增量)',
    shipped_order_count      Int32    COMMENT '当日已发货订单数(增量)',
    in_production_count      Int32    COMMENT '截至当日在产订单数(快照)',
    unscheduled_count        Int32    COMMENT '截至当日未排产订单数(快照)',
    reorder_times            Int32    COMMENT '当日返单次数(增量)',

    -- 订单额
    order_amount             Decimal(14,2) COMMENT '当日新增订单额(增量)',
    shipped_amount           Decimal(14,2) COMMENT '当日已发货订单额(增量)',
    in_production_amount     Decimal(14,2) COMMENT '截至当日在产订单额(快照)',
    unscheduled_amount       Decimal(14,2) COMMENT '截至当日未排产订单额(快照)',

    -- 出货
    shipping_count           Int32    COMMENT '当日出货数量(增量)',
    shipping_amount          Decimal(14,2) COMMENT '当日出货金额(增量)',

    -- 按期交付
    total_product_count      Int32    COMMENT '当日订单产品数(增量)',
    completed_count          Int32    COMMENT '当日已完成入库订单数(增量)',
    on_time_count            Int32    COMMENT '当日按期完成订单产品数(增量)',
    overdue_count            Int32    COMMENT '截至当日逾期未完成产品数(快照)',

    -- 利润
    budget_cost              Decimal(14,2) COMMENT '当日预算成本(增量)',
    budget_profit            Decimal(14,2) COMMENT '当日预算利润(增量)',
    actual_cost              Decimal(14,2) COMMENT '当日已发货实际成本(增量)',
    actual_profit            Decimal(14,2) COMMENT '当日已发货实际利润(增量)',

    -- 回款/应收
    collected_amount         Decimal(14,2) COMMENT '当日已收款(增量)',
    pending_amount           Decimal(14,2) COMMENT '截至当日待收款(快照)',
    receivable_amount        Decimal(14,2) COMMENT '当日已结算订单额(增量)',
    remaining_unallocated    Decimal(14,2) COMMENT '剩余未分配收款(快照)',
    prepaid_unallocated      Decimal(14,2) COMMENT '预收/全款单未分配(快照)',
    monthly_unallocated      Decimal(14,2) COMMENT '月结单未分配(快照)',
    total_uncollected        Decimal(14,2) COMMENT '合计未收款(快照)'
)
ENGINE = ReplacingMergeTree
PARTITION BY toYYYYMM(stat_date)
ORDER BY (tenant_id, stat_date, customer_id)
TTL stat_date + INTERVAL 3 YEAR;
```

## 表3 dws_customer_product_daily（客户×产品×天，30列）

```sql
CREATE TABLE dws_customer_product_daily
(
    -- 维度
    tenant_id                Int64    COMMENT '租户ID',
    stat_date                Date     COMMENT '统计日期',
    customer_id              Int64    COMMENT '客户ID',
    customer_name            LowCardinality(String) COMMENT '客户名称',
    product_id               Int64    COMMENT '产品ID',
    product_name             LowCardinality(String) COMMENT '产品名称',
    product_category         LowCardinality(String) COMMENT '产品类型',

    -- 订单量
    order_count              Int32    COMMENT '该产品当日订单量(增量)',
    shipped_order_count      Int32    COMMENT '该产品当日已发货订单数(增量)',
    in_production_count      Int32    COMMENT '该产品截至当日在产数(快照)',
    unscheduled_count        Int32    COMMENT '该产品截至当日未排产数(快照)',

    -- 订单额
    order_amount             Decimal(14,2) COMMENT '该产品当日订单额(增量)',
    shipped_amount           Decimal(14,2) COMMENT '该产品当日已发货额(增量)',
    in_production_amount     Decimal(14,2) COMMENT '该产品截至当日在产额(快照)',
    unscheduled_amount       Decimal(14,2) COMMENT '该产品截至当日未排产额(快照)',

    -- 按期交付
    total_product_count      Int32    COMMENT '该产品当日订单产品数(增量)',
    completed_count          Int32    COMMENT '该产品当日已完成入库数(增量)',
    on_time_count            Int32    COMMENT '该产品当日按期完成数(增量)',
    overdue_count            Int32    COMMENT '该产品截至当日逾期数(快照)',

    -- 利润
    budget_cost              Decimal(14,2) COMMENT '该产品当日预算成本(增量)',
    budget_profit            Decimal(14,2) COMMENT '该产品当日预算利润(增量)',
    actual_cost              Decimal(14,2) COMMENT '该产品当日实际成本(增量)',
    actual_profit            Decimal(14,2) COMMENT '该产品当日实际利润(增量)',

    -- 回款/应收
    collected_amount         Decimal(14,2) COMMENT '该产品当日已收款(增量)',
    pending_amount           Decimal(14,2) COMMENT '该产品截至当日待收款(快照)',
    receivable_amount        Decimal(14,2) COMMENT '该产品当日已结算额(增量)',
    remaining_unallocated    Decimal(14,2) COMMENT '剩余未分配收款(快照)',
    prepaid_unallocated      Decimal(14,2) COMMENT '预收/全款单未分配(快照)',
    monthly_unallocated      Decimal(14,2) COMMENT '月结单未分配(快照)',
    total_uncollected        Decimal(14,2) COMMENT '合计未收款(快照)'
)
ENGINE = ReplacingMergeTree
PARTITION BY toYYYYMM(stat_date)
ORDER BY (tenant_id, stat_date, customer_id, product_id)
TTL stat_date + INTERVAL 3 YEAR;
```

---

# 二、汇总层（月粒度，从日表派生）

> 字段与对应日表一一对应，仅把 `stat_date`(Date) 换成 `stat_month`(String, 'YYYY-MM')。
> 月表可用定时任务从日表 `GROUP BY` 生成（增量 SUM、快照取月末），或用物化视图维护 SUM 类。

## 表4 dws_tenant_monthly（企业×月，35列）

```sql
CREATE TABLE dws_tenant_monthly
(
    tenant_id                Int64    COMMENT '租户ID',
    stat_month               String   COMMENT '统计月份 YYYY-MM',
    total_customers          Int32, active_customers Int32, inactive_customers Int32,
    no_order_customers       Int32, reorder_customers Int32,
    no_order_to_active_count Int32, active_to_inactive_count Int32,
    order_count              Int32, shipped_order_count Int32,
    in_production_count      Int32, unscheduled_count Int32, reorder_times Int32,
    order_amount             Decimal(14,2), shipped_amount Decimal(14,2),
    in_production_amount     Decimal(14,2), unscheduled_amount Decimal(14,2),
    shipping_count           Int32, shipping_amount Decimal(14,2),
    total_product_count      Int32, completed_count Int32, on_time_count Int32, overdue_count Int32,
    budget_cost              Decimal(14,2), budget_profit Decimal(14,2),
    actual_cost              Decimal(14,2), actual_profit Decimal(14,2),
    collected_amount         Decimal(14,2), pending_amount Decimal(14,2),
    receivable_amount        Decimal(14,2), remaining_unallocated Decimal(14,2),
    prepaid_unallocated      Decimal(14,2), monthly_unallocated Decimal(14,2),
    total_uncollected        Decimal(14,2)
)
ENGINE = ReplacingMergeTree
PARTITION BY substring(stat_month, 1, 4)   -- 按年分区
ORDER BY (tenant_id, stat_month);
```

派生方式：

| 字段组 | 派生方式 |
|--------|---------|
| total/active/inactive/no_order/reorder_customers | 取当月最后一天快照 |
| no_order_to_active_count / active_to_inactive_count | 当月各天 SUM |
| order_* / shipped_* / shipping_* / 按期交付增量 / 利润 / collected / receivable | 当月各天 SUM |
| in_production_* / unscheduled_* / overdue_count / pending / *_unallocated / total_uncollected | 取当月最后一天快照 |

## 表5 dws_customer_monthly（客户×月，38列）

字段同 `dws_customer_daily`，`stat_date`→`stat_month`。

```sql
CREATE TABLE dws_customer_monthly
(
    tenant_id Int64, stat_month String,
    customer_id Int64, customer_name LowCardinality(String),
    country LowCardinality(String), region_type LowCardinality(String),
    province LowCardinality(String), city LowCardinality(String),
    is_active UInt8, has_order UInt8, is_reorder UInt8, status_change LowCardinality(String),
    order_count Int32, shipped_order_count Int32, in_production_count Int32,
    unscheduled_count Int32, reorder_times Int32,
    order_amount Decimal(14,2), shipped_amount Decimal(14,2),
    in_production_amount Decimal(14,2), unscheduled_amount Decimal(14,2),
    shipping_count Int32, shipping_amount Decimal(14,2),
    total_product_count Int32, completed_count Int32, on_time_count Int32, overdue_count Int32,
    budget_cost Decimal(14,2), budget_profit Decimal(14,2),
    actual_cost Decimal(14,2), actual_profit Decimal(14,2),
    collected_amount Decimal(14,2), pending_amount Decimal(14,2),
    receivable_amount Decimal(14,2), remaining_unallocated Decimal(14,2),
    prepaid_unallocated Decimal(14,2), monthly_unallocated Decimal(14,2),
    total_uncollected Decimal(14,2)
)
ENGINE = ReplacingMergeTree
PARTITION BY substring(stat_month, 1, 4)
ORDER BY (tenant_id, stat_month, customer_id);
```

## 表6 dws_customer_product_monthly（客户×产品×月，30列）

```sql
CREATE TABLE dws_customer_product_monthly
(
    tenant_id Int64, stat_month String,
    customer_id Int64, customer_name LowCardinality(String),
    product_id Int64, product_name LowCardinality(String),
    product_category LowCardinality(String),
    order_count Int32, shipped_order_count Int32,
    in_production_count Int32, unscheduled_count Int32,
    order_amount Decimal(14,2), shipped_amount Decimal(14,2),
    in_production_amount Decimal(14,2), unscheduled_amount Decimal(14,2),
    total_product_count Int32, completed_count Int32, on_time_count Int32, overdue_count Int32,
    budget_cost Decimal(14,2), budget_profit Decimal(14,2),
    actual_cost Decimal(14,2), actual_profit Decimal(14,2),
    collected_amount Decimal(14,2), pending_amount Decimal(14,2),
    receivable_amount Decimal(14,2), remaining_unallocated Decimal(14,2),
    prepaid_unallocated Decimal(14,2), monthly_unallocated Decimal(14,2),
    total_uncollected Decimal(14,2)
)
ENGINE = ReplacingMergeTree
PARTITION BY substring(stat_month, 1, 4)
ORDER BY (tenant_id, stat_month, customer_id, product_id);
```

---

# 三、派生（现算）指标 —— 不入表，查询时算

| 指标 | 口径 |
|------|------|
| 订单频次（平均下单周期） | 周期天数 ÷ SUM(order_count)（口径A） |
| 按期完成率 % | on_time_count ÷ total_product_count × 100 |
| 逾期率 % | overdue_count ÷ total_product_count × 100 |
| 预算/实际利润率 % | budget_profit(或 actual_profit) ÷ order_amount × 100 |
| 回款率 % | collected_amount ÷ order_amount × 100 |
| 状态转化率 % | no_order_to_active_count ÷ total_customers × 100 |
| 同比 | (本期 − 去年同期) / 去年同期 × 100 |
| 环比 | (本期 − 上一周期) / 上一周期 × 100 |

> 除法统一用 `nullIf(分母, 0)` 防除零。

---

# 四、查询示例

### 1. 客户基础存量（实时，取最新一天快照）

```sql
SELECT total_customers, active_customers, inactive_customers, no_order_customers
FROM dws_tenant_daily
WHERE tenant_id = 1
  AND stat_date = (SELECT max(stat_date) FROM dws_tenant_daily WHERE tenant_id = 1);
```

### 2. 高订单金额客户 TOP10（近30天滚动窗口，查日表）

```sql
SELECT customer_id, customer_name, SUM(order_amount) AS amount_30d
FROM dws_customer_daily
WHERE tenant_id = 1 AND stat_date >= today() - 30
GROUP BY customer_id, customer_name
ORDER BY amount_30d DESC
LIMIT 10;
```

### 3. 活跃客户地域分布（省/市，取最新快照）

```sql
SELECT province, city, count() AS active_cnt
FROM dws_customer_daily
WHERE tenant_id = 1 AND region_type = 'domestic' AND is_active = 1
  AND stat_date = (SELECT max(stat_date) FROM dws_customer_daily WHERE tenant_id = 1)
GROUP BY province, city
ORDER BY active_cnt DESC;
```

### 4. 按月客户存量趋势（近一年，查月表快照）

```sql
SELECT stat_month, total_customers, active_customers, inactive_customers, no_order_customers
FROM dws_tenant_monthly
WHERE tenant_id = 1 AND stat_month BETWEEN '2024-07' AND '2025-06'
ORDER BY stat_month;
```

### 5. 按月状态转化率（近一年）

```sql
SELECT stat_month,
       no_order_to_active_count,
       active_to_inactive_count,
       no_order_to_active_count * 100.0 / nullIf(total_customers, 0) AS to_active_rate
FROM dws_tenant_monthly
WHERE tenant_id = 1 AND stat_month BETWEEN '2024-07' AND '2025-06'
ORDER BY stat_month;
```

### 6. 同比 / 环比（季度客户总数，定期报表用）

```sql
-- 取各季度末客户总数（季度末月份的快照）
WITH q AS (
    SELECT stat_month, total_customers
    FROM dws_tenant_monthly
    WHERE tenant_id = 1 AND stat_month IN ('2024-03','2024-06','2025-03','2025-06')
)
SELECT
    '2025Q2' AS period,
    (SELECT total_customers FROM q WHERE stat_month='2025-06') AS cur,
    (SELECT total_customers FROM q WHERE stat_month='2025-03') AS prev_q,   -- 环比基期
    (SELECT total_customers FROM q WHERE stat_month='2024-06') AS yoy_base, -- 同比基期
    (cur - prev_q) * 100.0 / nullIf(prev_q, 0)   AS qoq_rate,  -- 环比%
    (cur - yoy_base) * 100.0 / nullIf(yoy_base, 0) AS yoy_rate; -- 同比%
```

### 7. 按期完成率 / 逾期率（累计，现算比率）

```sql
SELECT
    SUM(on_time_count)  AS on_time,
    SUM(total_product_count) AS total_prod,
    SUM(on_time_count) * 100.0 / nullIf(SUM(total_product_count), 0) AS on_time_rate,
    max(overdue_count)  AS overdue_snapshot   -- 快照取最新值
FROM dws_tenant_daily
WHERE tenant_id = 1 AND stat_date >= today() - 90;
```

### 8. 全公司某产品近30天销量（聚合掉客户维度）

```sql
SELECT product_id, product_name,
       SUM(order_count) AS cnt_30d, SUM(order_amount) AS amt_30d
FROM dws_customer_product_daily
WHERE tenant_id = 1 AND stat_date >= today() - 30
GROUP BY product_id, product_name
ORDER BY amt_30d DESC;
```

### 9. 高返单客户 TOP5（近一年）+ 按月趋势

```sql
-- 近一年 TOP5
SELECT customer_id, customer_name, SUM(reorder_times) AS reorders
FROM dws_customer_daily
WHERE tenant_id = 1 AND stat_date >= today() - 365
GROUP BY customer_id, customer_name
ORDER BY reorders DESC
LIMIT 5;

-- TOP5 客户按月返单趋势（月表）
SELECT stat_month, customer_id, reorder_times
FROM dws_customer_monthly
WHERE tenant_id = 1 AND customer_id IN (/* 上面 TOP5 */)
ORDER BY stat_month;
```
