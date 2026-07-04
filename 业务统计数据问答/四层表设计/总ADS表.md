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

**执行逻辑：**

执行时间：每天，DWS之后

数据来源：客户返单汇总_天（DWS）

计算（以近90天为例，180天/1年同理）：把当天所有客户按"近90天是否返单"分两拨汇总到公司层：
- 返单客户数 = 近90天返单的客户数
- 未返单客户数 = 下过单、但近90天没返单的客户数（不含从未下单客户）

输出：每天每公司3条（近90天/近180天/近1年各一条），供前端做分周期对比图

---

## ADS-5：`ads_high_reorder_top5_day`（高返单top5_天）

**来源场景：** 场景5 — 高返单客户统计（排名）

**粒度：一个公司 + 一个时间类型 + 一个排名 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| type | tinyint | 时间类型（3=近180天/近6个月，4=近365天/近1年） |
| ranking | tinyint | 排名（1~5） |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| reorder_count | int | 返单次数（该周期滑动窗口内） |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天（DWS之后）

**数据来源：** DWS-3 `dws_client_repeat_order_daily`（客户返单汇总_天）

**执行逻辑：** 按时间类型（近6个月=近180天、近1年=近365天）把当天所有客户按返单次数从多到少排，各取前5名写排名1~5

**输出：** 每天每周期5条，回答"谁是TOP5高返单客户"

---

## ADS-6：`ads_customer_reorder_trend_monthly`（高返单客户返单次数_月）

**来源场景：** 场景5 — 高返单客户统计（趋势）

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| reorder_count_month | int | 当月返单次数（该自然月内新产生的返单笔数） |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**执行时间：** 每月（DWS之后）

**数据来源：** DWS-4 `dws_client_repeat_order_monthly`（客户返单汇总_月，当月返单次数字段）

**执行逻辑：** 存每个客户每个自然月的当月返单次数

**用法：** 前端先用 ADS-5 拿到TOP5客户id，再来本表查这几个客户逐月的当月返单次数，连成趋势线

**问题点（先标记，后续再想）：**
- 排名（ADS-5，滑动180/365天）与趋势（本表，自然月当月次数）口径不同，TOP5总数 ≠ 趋势各月之和
- 当月返单次数依赖 DWS-4 待补的字段
- 与开发已有的 `ads_high_reorder_top5_month`（月度TOP5排名、带排名+滑动次数）不是同一张，需确认改造复用还是新建

---

## ADS-7：`ads_high_order_client_top30_day`（高订单客户top30_天）

**来源场景：** 场景6 — 高订单量客户统计

**粒度：一个公司 + 一个时间类型 + 一个排名 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| type | tinyint | 时间类型（1=30天，2=90天，3=180天，4=365天） |
| ranking | tinyint | 排名（1~30） |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| order_count | int | 下单笔数（该周期内） |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天（DWS之后）

**数据来源：** DWS-5 `dws_client_order_count_daily`（客户下单数量_天）

**执行逻辑：** 按时间类型（近30/90/180/365天）把当天所有客户按下单数量从多到少排，各取前30名写排名1~30

**输出：** 每天每周期30条、共4个周期120条，供前端做分周期排名图

---

## ADS-8：`ads_high_order_top5_day`（高下单top5_天）

**来源场景：** 场景7 — 高订单量客户统计（排名）

**粒度：一个公司 + 一个时间类型 + 一个排名 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| type | tinyint | 时间类型（1=30天，2=90天，3=180天/近6个月，4=365天/近1年）——本场景只用3、4 |
| ranking | tinyint | 排名（1~5） |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| order_count | int | 下单笔数（该周期滑动窗口内） |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天（DWS之后）

**数据来源：** DWS-5 `dws_client_order_count_daily`（客户下单数量_天）

**执行逻辑：** 按时间类型（近6个月=近180天、近1年=近365天）把当天所有客户按下单数量从多到少排，各取前5名写排名1~5

**输出：** 每天每周期5条，回答"谁是TOP5高订单量客户"

**说明：** 开发已有表，字段兼容30/90/180/365天四种 type；本场景只取 type=3、type=4 两个周期各5条

---

## ADS-9：`ads_customer_order_count_trend_monthly`（客户月度订单量_月）

**来源场景：** 场景7 — 高订单量客户统计（趋势）

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| order_count_month | int | 当月下单笔数（该自然月内新产生的有效订单笔数） |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**执行时间：** 每月（DWS之后）

**数据来源：** DWS-6 `dws_client_order_count_monthly`（客户下单数量_月，当月下单笔数字段）

**执行逻辑：** 存每个客户每个自然月的当月下单笔数

**用法：** 前端先用 ADS-8 拿到TOP5客户id，再来本表查这几个客户逐月的当月下单笔数，连成趋势线

**问题点（先标记，与场景5/ADS-6同型）：**
- 排名（ADS-8，滑动180/365天）与趋势（本表，自然月当月笔数）口径不同，TOP5总数 ≠ 趋势各月之和
- 当月下单笔数依赖 DWS-6 的 order_count_month 字段
- 对应中间表设计 表8 `ads_customer_order_count_trend_monthly`，为新建表
