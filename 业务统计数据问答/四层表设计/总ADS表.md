# ADS层（应用数据层）— 总表

> 跑批时间：在DWS完成之后执行，所有接口只能访问ADS层

---

## ADS-1：`ads_client_base_stock_daily`（客户基础存量_天）

**来源场景：** 场景1 — 客户基础存量统计

**粒度：一个公司 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| total_count | int | 客户总数 |
| active_count | int | 活跃客户总数 |
| inactive_count | int | 非活跃客户总数 |
| no_order_count | int | 未下单客户数 |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天

**数据来源：** DWS-1 `dws_client_monthly`（客户统计_月）

**执行逻辑：** 条件：数据日期 = 当月，公司id = 公司id，取唯一一条数据

---

## ADS-2：`ads_client_base_stock_monthly`（客户基础存量_月）

**来源场景：** 场景2 — 客户存量趋势统计

**粒度：一个公司 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| total_count | int | 客户总数 |
| active_count | int | 活跃客户总数 |
| inactive_count | int | 非活跃客户总数 |
| no_order_count | int | 未下单客户数 |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**执行时间：** 每月1号（DWS之后）

**数据来源：** DWS-1 `dws_client_monthly`（客户统计_月）

**执行逻辑：** 条件：公司id=公司id，数据日期取近12个月，取12条数据

---

## ADS-3：`ads_client_conversion_trend_month`（客户状态转化_月）

**来源场景：** 场景3 — 客户状态转化统计

**粒度：一个公司 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| no_order_to_active_rate | decimal | 未下单转活跃转化率 |
| active_to_inactive_rate | decimal | 活跃转非活跃转化率 |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**执行时间：** 每月1号（DWS之后）

**数据来源：** DWS-2 `dws_client_conversion_month`（客户转化_月）

**执行逻辑：** 条件：公司id=公司id，数据日期取近12个月，取12条数据

---

## ADS-4：`ads_customer_reorder_stock_daily`（客户返单存量统计_天）

**来源场景：** 场景4 — 客户返单存量统计

**粒度：一个公司 + 一个时间类型 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| time_type | tinyint | 时间类型（0=近90天，1=近180天，2=近1年） |
| reorder_customer_count | int | 返单客户数 |
| no_reorder_customer_count | int | 未返单客户数 |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天

**数据来源：** DWS-3 `dws_client_repeat_order_daily`（客户返单汇总_天）

**执行逻辑：** 条件：公司id=公司id，数据日期=当天，按时间类型分别统计返单客户数和未返单客户数，3条数据

- 有效订单：能进DWD的订单即已审批订单
- 首单/返单：客户第1笔=首单，之后每笔=返单
- 返单客户：近N天内有≥1笔返单订单（非首单）
- 未返单客户：历史下过单，但近N天内无返单订单（不含从未下单客户）
