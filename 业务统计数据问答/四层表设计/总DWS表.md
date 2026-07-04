# DWS层（汇总数据层）— 总表

> 跑批时间：每月最后一天凌晨00:00，从DWD层聚合数据

---

## DWS-1：`dws_client_monthly`（客户统计_月）

**粒度：一个公司 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| total_count | int | 客户总数 |
| active_count | int | 活跃客户总数 |
| inactive_count | int | 非活跃客户总数 |
| no_order_count | int | 未下单客户数 |
| increment_count | int | 月新增客户数 |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** dwd_client_snapshot（客户拉链表）

**计算逻辑（以统计2026年6月为例，6月30日凌晨00:00执行）：**

```
SET @month_end = UNIX_TIMESTAMP('2026-06-30 00:00:00') * 1000

total_count     = COUNT(DISTINCT client_id) WHERE begin_date <= @month_end
active_count    = COUNT(DISTINCT client_id) WHERE status=1 AND begin_date <= @month_end AND end_date > @month_end
inactive_count  = COUNT(DISTINCT client_id) WHERE status=2 AND begin_date <= @month_end AND end_date > @month_end
no_order_count  = COUNT(DISTINCT client_id) WHERE status=0 AND begin_date <= @month_end AND end_date > @month_end
increment_count = COUNT(DISTINCT client_id) WHERE 首次begin_date在本月内
```

---

## DWS-2：`dws_client_conversion_month`（客户转化_月）

**粒度：一个公司 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| no_order_to_active_count | int | 未下单→活跃数 |
| no_order_to_active_rate | decimal | 未下单→活跃转换率 |
| active_to_inactive_count | int | 活跃→非活跃数 |
| active_to_inactive_rate | decimal | 活跃→非活跃转换率 |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** dwd_client_snapshot（客户拉链表）

**计算逻辑（以统计2026年6月为例）：**

```
SET @month_start = UNIX_TIMESTAMP('2026-06-01 00:00:00') * 1000
SET @month_end = UNIX_TIMESTAMP('2026-06-30 00:00:00') * 1000

no_order_to_active_count = 本月内从status=0变为status=1的客户数（从拉链表找本月内结束了status=0且开始了status=1的客户）
no_order_to_active_rate  = no_order_to_active_count / 月初status=0的客户数
active_to_inactive_count = 本月内从status=1变为status=2的客户数
active_to_inactive_rate  = active_to_inactive_count / 月初status=1的客户数
```

---

## DWS-3：`dws_client_repeat_order_daily`（客户返单汇总_天）

**粒度：一个公司 + 一个客户 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| repeat_count_90d | int | 近90天返单次数 |
| repeat_count_180d | int | 近180天返单次数 |
| repeat_count_365d | int | 近365天返单次数 |
| has_repeat_90d | tinyint | 近90天是否返单（0无，1有） |
| has_repeat_180d | tinyint | 近180天是否返单（0无，1有） |
| has_repeat_365d | tinyint | 近365天是否返单（0无，1有） |
| data_date_str | varchar | 数据日期（yyyy-MM-dd） |

**数据来源：** 订单业务拉链表（进DWD即有效订单）

**执行时间：** 每天，统计到数据日期当天为止

**定义：**
- 首单 = 该客户按下单时间排最早的那一笔订单
- 返单 = 该客户第二笔及以后的订单
- 近N天 = 数据日期往前推N天的区间（N=90/180/365）

**生成逻辑（对每个客户）：**
1、取该客户所有有效订单，一个订单取最新行回到订单级，按下单时间从早到晚排，排第二及以后的都算返单
2、近90天返单次数 = 下单时间落在近90天内的返单笔数；近180天、近365天同理换区间
3、近90天是否返单 = 近90天返单次数大于0则为是，否则为否；180天、365天同理

**边界：** 首单不算返单，只下过一次单的客户返单次数为0、都为否；不要求首单也在区间内，只要区间内有第二笔及以后订单就算返单

---

## DWS-4：`dws_client_repeat_order_monthly`（客户返单汇总_月）

**来源场景：** 场景5 — 高返单客户统计（趋势）

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| repeat_count_180d | int | 近180天返单次数（月末时点滑动值） |
| repeat_count_365d | int | 近365天返单次数（月末时点滑动值） |
| repeat_count_month | int | 当月返单次数（该自然月内新产生的返单笔数）——**待开发补** |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** 订单业务拉链表（进DWD即有效订单）

**执行时间：** 每月末

**生成逻辑（对每个客户）：**
1、取该客户所有有效订单，一个订单取最新行回到订单级，按下单时间从早到晚排，第二笔及以后算返单
2、近180/365天返单次数 = 月末往前推180/365天区间内的返单笔数
3、当月返单次数 = 落在当自然月（1号~月末）内的返单笔数

**用途：** 给场景5趋势图，取TOP5客户逐月的"当月返单次数"连成趋势线

**待确认：** 开发现有月表只有近180/365天返单次数，"当月返单次数"字段需请开发补上

---

## DWS-5：`dws_client_order_count_daily`（客户下单数量_天）

**来源场景：** 场景6 — 高订单量客户统计

**粒度：一个公司 + 一个客户 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| order_count_30d | int | 最近30天下单数量 |
| order_count_90d | int | 最近90天下单数量 |
| order_count_180d | int | 最近180天下单数量 |
| order_count_365d | int | 最近365天下单数量 |
| data_date_str | varchar | 数据日期（yyyy-MM-dd） |

**数据来源：** 订单业务拉链表（进DWD即有效订单）

**执行时间：** 每天，统计到数据日期当天为止

**生成逻辑（对每个客户）：** 取该客户的有效订单（一个订单取最新行回到订单级），分别数最近30/90/180/365天区间内的下单笔数

**用途：** 给场景6排名，按各周期下单数量取TOP30；同时给场景7排名（按近180/365天下单数量取TOP5）

---

## DWS-6：`dws_client_order_count_monthly`（客户下单数量_月）

**来源场景：** 场景7 — 高订单量客户统计（趋势）

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| order_count_180d | int | 近180天下单数量（月末时点滑动值） |
| order_count_365d | int | 近365天下单数量（月末时点滑动值） |
| order_count_month | int | 当月下单笔数（该自然月内新产生的有效订单笔数） |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** 订单业务拉链表（进DWD即有效订单）

**执行时间：** 每月末

**生成逻辑（对每个客户）：**
1、取该客户所有有效订单，一个订单取最新行回到订单级
2、近180/365天下单数量 = 月末往前推180/365天区间内的下单笔数
3、当月下单笔数 = 下单时间落在当自然月（1号~月末）内的有效订单笔数

**用途：** 给场景7趋势图，取TOP5客户逐月的"当月下单笔数"连成趋势线
