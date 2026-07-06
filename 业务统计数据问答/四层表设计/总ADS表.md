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

---

## ADS-10：`ads_client_amount_top30_day`（客户订单金额top30_日）

**来源场景：** 场景8 — 高订单金额客户统计

**粒度：一个公司 + 一个时间类型 + 一个排名 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| type | tinyint | 时间类型（1=30天，2=90天，3=180天，4=365天） |
| ranking | tinyint | 排名（1~30） |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| total_amount | decimal | 下单总金额（该周期内有效订单合计金额之和） |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天（DWS之后）

**数据来源：** DWS-7 `dws_client_order_amount_daily`（客户订单金额汇总_天）

**执行逻辑：** 按时间类型（近30/90/180/365天）把当天所有客户按下单金额从多到少排，各取前30名写排名1~30

**输出：** 每天每周期30条、共4个周期120条，供前端做分周期排名图

**说明：** 开发已有表（demo SQL 中 `ads_client_amount_top30_day`，与场景6高订单量top30同型，指标换成金额）

---

## ADS-11：`ads_customer_order_amount_top5_daily`（高订单金额客户TOP5排名_天）

**来源场景：** 场景9 — 高订单金额客户统计（排名）

**粒度：一个公司 + 一个时间类型 + 一个排名 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_name | varchar | 公司名称 |
| company_id | bigint | 公司id |
| customer_id | bigint | 客户id |
| customer_name | varchar | 客户名称 |
| top_rank | tinyint | 排名（1~5） |
| time_type | tinyint | 时间类型（0=近6个月，1=近一年） |
| order_amount | decimal | 该周期下订单总金额 |
| data_date | varchar | 数据日期（yyyy-MM-dd） |

**执行时间：** 每天（DWS之后）

**数据来源：** DWS-7 `dws_client_order_amount_daily`（客户订单金额汇总_天）

**执行逻辑：** 按时间类型（0=近6个月=近180天、1=近一年=近365天）把当天所有客户按下单金额从多到少排，各取前5名写排名1~5

**输出：** 每天每时间类型5条（共10条/公司/天），回答"谁是TOP5高订单金额客户"

**说明：** 新建表（中间表设计 表9附）。注意时间类型编码为 0/1，与场景8金额top30（type=1~4）不同

---

## ADS-12：`ads_customer_order_amount_trend_monthly`（客户月度订单金额_月）

**来源场景：** 场景9 — 高订单金额客户统计（趋势）

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_name | varchar | 公司名称 |
| company_id | bigint | 公司id |
| customer_id | bigint | 客户id |
| customer_name | varchar | 客户名称 |
| order_amount | decimal | 当月下订单金额 |
| data_date | varchar | 数据日期（yyyy-MM） |

**执行时间：** 每月（DWS之后）

**数据来源：** DWS-8 `dws_client_order_month`（客户订单数量/金额汇总_月，取"当月下单金额"）

**执行逻辑：** 存每个客户每个自然月的当月下订单金额

**用法：** 前端先用 ADS-11 拿到TOP5客户id，再来本表查这几个客户逐月的当月下订单金额，连成趋势线

**说明：** 开发已有表（中间表设计 表9 `ads_customer_order_amount_trend_monthly`）

**问题点（先标记，与场景5/7同型）：** 排名（ADS-11，滑动180/365天）与趋势（本表，自然月当月额）口径不同，TOP5总额 ≠ 趋势各月之和

---

## ADS-13：`ads_customer_base_comparison_daily`（客户基础信息同环比_天）

**来源场景：** 场景10 — 定期报表·客户增降幅度（同比/环比）

**粒度：一个公司 + 一个统计类型 + 一期（一行）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_name | varchar | 公司名称 |
| company_id | bigint | 公司id |
| stat_type | tinyint | 统计类型（0=月度，1=季度，2=年度） |
| customer_total | int | 客户总数（本期） |
| active_customer_total | int | 活跃客户总数（本期） |
| inactive_customer_total | int | 非活跃客户总数（本期） |
| no_order_customer_count | int | 未下单客户数（本期） |
| customer_total_chain_change | int | 客户总数环比增减量 |
| customer_total_chain_rate | decimal | 客户总数环比涨幅（%） |
| customer_total_yoy_change | int | 客户总数同比增减量 |
| customer_total_yoy_rate | decimal | 客户总数同比涨幅（%） |
| active_chain_change | int | 活跃客户环比增减量 |
| active_chain_rate | decimal | 活跃客户环比涨幅（%） |
| active_yoy_change | int | 活跃客户同比增减量 |
| active_yoy_rate | decimal | 活跃客户同比涨幅（%） |
| inactive_chain_change | int | 非活跃客户环比增减量 |
| inactive_chain_rate | decimal | 非活跃客户环比涨幅（%） |
| inactive_yoy_change | int | 非活跃客户同比增减量 |
| inactive_yoy_rate | decimal | 非活跃客户同比涨幅（%） |
| no_order_chain_change | int | 未下单客户环比增减量 |
| no_order_chain_rate | decimal | 未下单客户环比涨幅（%） |
| no_order_yoy_change | int | 未下单客户同比增减量 |
| no_order_yoy_rate | decimal | 未下单客户同比涨幅（%） |
| data_date | varchar | 数据日期（yyyy-MM，季度/年度取末月） |

**执行时间：** stat_type=0 每月1日凌晨；stat_type=1 每季度首日凌晨；stat_type=2 每年1月1日凌晨（均在DWS之后）

**数据来源：** DWS-1 `dws_client_monthly`（客户统计_月）

**执行逻辑：** 取本期、上期（算环比）、去年同期（算同比）三行月度值；季度/年度取该周期末月的月度值作为本期。对 客户总数/活跃/非活跃/未下单 四项分别算：环比增减量=本期-上期、环比幅度=(本期-上期)/上期×100；同比增减量=本期-去年同期、同比幅度=(本期-去年同期)/去年同期×100

**说明：** 开发已有表（中间表设计 表10）；完整流转见 `客户增降幅度_数据流转分析.md`

---

## ADS-14：`ads_client_active_order_month`（活跃客户下单情况月度汇总表_月）

**来源场景：** 场景11 — 活跃客户下单统计

**粒度：一个公司 + 一个月**（字段与 DWS-9 完全一致）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| active_count | int | 活跃客户数 |
| client_count_by_order | int | 活跃客户中有下单数 |
| client_count_by_no_order | int | 活跃客户中无下单数 |
| data_date | bigint | 数据日期 |
| data_date_str | varchar(20) | 数据日期字符串(yyyy-MM) |
| create_date | bigint | 创建时间 |
| company_id | bigint | 所属公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

**执行时间：** 每月（DWS之后）

**数据来源：** DWS-9 `dws_client_active_order_month`

**执行逻辑：** 按公司取统计周期内各月现成值直接落表，不重算。前端按 data_date_str 排序：堆叠柱状图/饼图展示每月"有下单 vs 无下单"构成，或折线看活跃客户数趋势。

**说明：** 开发已有表（demo SQL 第20行）

---

## ADS-15：`ads_client_order_ship_month`（客户下单出货_月）【新建】

**来源场景：** 场景12 — 客户出货统计

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| order_quantity | decimal | 当月下单数量 |
| order_amount | decimal | 当月下单金额 |
| ship_quantity | decimal | 当月出货数量 |
| ship_amount | decimal | 当月出货金额 |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**执行时间：** 每天凌晨（DWS之后），覆盖更新"昨天所属月份"行；月初1号跑完上月即定格

**数据来源：** DWS-10 `dws_client_order_ship_month`（客户下单出货汇总_月）

**执行逻辑：** 条件：公司id=公司id，按统计周期（如近12个月）取各客户各月现成的四个指标值直接落表，不重算。前端按 data_date_str 排序，画"下单数量 vs 出货数量""下单金额 vs 出货金额"对比图/趋势图。

---

## ADS-16：`ads_client_order_ship_comparison`（客户下单出货同环比）【新建】

**来源场景：** 场景13 — 客户出货增降幅度（同比/环比）

**粒度：一个公司 + 一个客户 + 一个统计类型 + 一期（一行）**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| stat_type | tinyint | 统计类型（0=月度，1=季度，2=年度） |
| order_quantity | decimal | 下单数量（本期） |
| order_amount | decimal | 下单金额（本期） |
| ship_quantity | decimal | 出货数量（本期） |
| ship_amount | decimal | 出货金额（本期） |
| order_quantity_chain_change | decimal | 下单数量环比增减量 |
| order_quantity_chain_rate | decimal | 下单数量环比增降幅度（%） |
| order_quantity_yoy_change | decimal | 下单数量同比增减量 |
| order_quantity_yoy_rate | decimal | 下单数量同比增降幅度（%） |
| order_amount_chain_change | decimal | 下单金额环比增减量 |
| order_amount_chain_rate | decimal | 下单金额环比增降幅度（%） |
| order_amount_yoy_change | decimal | 下单金额同比增减量 |
| order_amount_yoy_rate | decimal | 下单金额同比增降幅度（%） |
| ship_quantity_chain_change | decimal | 出货数量环比增减量 |
| ship_quantity_chain_rate | decimal | 出货数量环比增降幅度（%） |
| ship_quantity_yoy_change | decimal | 出货数量同比增减量 |
| ship_quantity_yoy_rate | decimal | 出货数量同比增降幅度（%） |
| ship_amount_chain_change | decimal | 出货金额环比增减量 |
| ship_amount_chain_rate | decimal | 出货金额环比增降幅度（%） |
| ship_amount_yoy_change | decimal | 出货金额同比增减量 |
| ship_amount_yoy_rate | decimal | 出货金额同比增降幅度（%） |
| data_date | varchar | 数据日期（yyyy-MM，季度/年度取末月） |

**执行时间：** stat_type=0 每月1日凌晨；stat_type=1 每季度首日凌晨；stat_type=2 每年1月1日凌晨（均在DWS之后）

**数据来源：** DWS-10 `dws_client_order_ship_month`（客户下单出货汇总_月）

**执行逻辑：**
1、取本期、上期（算环比）、去年同期（算同比）的月度值；月度=直接取该月一行；季度/年度=把周期内各月的四个指标分别求和作为该期值（下单/出货都是增量值，可直接相加）
2、对 下单数量/下单金额/出货数量/出货金额 四项分别算：
   环比增减量 = 本期 − 上期；环比增降幅度 = (本期 − 上期) ÷ 上期 × 100%
   同比增减量 = 本期 − 去年同期；同比增降幅度 = (本期 − 去年同期) ÷ 去年同期 × 100%
   （上期/去年同期为0时幅度记0，避免除零）
3、按 公司+客户+统计类型+期 写入一行

**说明：** 与 ADS-13（客户基础信息同环比）同型，指标换成下单/出货四项；开发库无此表，需新建
