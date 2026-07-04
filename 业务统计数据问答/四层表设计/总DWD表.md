# DWD层（明细数据层）— 总表

> 根据事件更新，可视为实时更新，维护拉链表记录状态变化历史

---

## DWD-1：`dwd_client_snapshot`（客户拉链表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| company_name | varchar | 公司名称 |
| status | int | 客户状态（0未下单，1活跃，2非活跃） |
| begin_date | bigint | 开始时间（毫秒时间戳） |
| end_date | bigint | 结束时间（毫秒时间戳，9999-12-31表示当前有效） |

**更新逻辑：** 监测 ods_client 的 status 变化，当客户状态发生改变时：
1. 关闭旧行：将当前有效行的 end_date 设为变化时间
2. 插入新行：begin_date = 变化时间，end_date = 9999-12-31 的时间戳

**查询方式：** 查某个时间点的客户状态：`WHERE begin_date <= 时间戳 AND end_date > 时间戳`

---

## DWD-2：`dwd_order_bus_snapshot`（订单业务拉链表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| order_id | bigint | 订单id |
| code | varchar | 订单号 |
| client_id | bigint | 客户id |
| company_id | bigint | 公司id |
| phase_status | int | 发货状态（0未发货，1部分发货，2全部发货，3强制完成） |
| total_price | decimal | 订单总额 |
| begin_date | bigint | 该状态开始时间（毫秒时间戳） |
| end_date | bigint | 该状态结束时间（毫秒时间戳） |

**更新逻辑：** 监测 ods_order 的 phase_status 变化，当订单发货状态改变时：
1. 关闭旧行：将当前有效行的 end_date 设为变化时间
2. 插入新行：begin_date = 变化时间，end_date = 9999-12-31 的时间戳

---

## DWD-3：`dwd_order_detail`（已审批订单明细）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| order_id | bigint | 订单id |
| client_id | bigint | 客户id |
| company_id | bigint | 公司id |
| approval_status | int | 审批状态（0未签名，1未审批，2已审批，3失效，4作废） |
| create_date | bigint | 下单时间 |

**更新逻辑：** 只同步 ods_order 中已审批（approval_status=2）的订单，一个订单一行，不做状态拉链。

**用途：** 返单统计（场景4），按 客户id + 下单时间 判断首单/返单。
