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

**数据来源：** dwd_order_bus_snapshot（订单业务拉链表），进DWD即已审批订单

**首单/返单判断：** 按order_id去重后，同一客户按创建时间排序，第1笔=首单，之后每笔=返单

**计算逻辑：** 每天统计每个客户在近90/180/365天内的返单订单数（该客户非首笔的订单数）；有返单订单则 has_repeat=1，即为返单客户；有下单历史但近N天无返单订单则为未返单客户
