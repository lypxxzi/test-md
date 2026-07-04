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
| client_name | varchar | 客户名称 |
| business_user_id | bigint | 业务员id |
| business_user_name | varchar | 业务员名称 |
| company_id | bigint | 公司id |
| approval_status | int | 审批状态（0已审批，1失效，2作废） |
| total_price | decimal | 合计金额 |
| bus_type | varchar | 数据生成节点/业务类型（本行由哪个业务事件产生） |
| begin_date | bigint | 开始时间（本次事件发生时间） |
| create_date | bigint | 创建时间（下单时间） |

（发货状态由另一张表专门维护，本表不含。）

**本质：** 记录订单全生命周期的事实表。订单每发生一个业务事件，就 append 一行，记录该时刻订单的快照 + 事件节点（bus_type）+ 事件时间（begin_date）。历史行不覆盖，取订单最新状态 = 该 order_id 下 begin_date 最大的行。订单在ODS新建但未审批时只在ODS、不进本表；进本表的订单即为已审批过的订单。

**触发事件（开发现状，均由 ods_order 事件驱动）：**
1. 订单审批完成（订单生效，首次进表）
2. 订单强制完成
3. 追加费用
4. 删除追加费用

每个事件 append 一行，bus_type 标记是哪个节点触发。

**待确认：** 目前无"作废/失效"触发事件，订单审批后被作废/失效时本表不会新增行，最新行仍停在"已审批"。若返单等场景需要排除审批后作废的订单，需请开发补"作废/失效"事件。

**用途（场景4返单）：** 进本表的订单即有效订单，取每个订单最新行、按 order_id 回到订单级；同一客户按下单时间排序，第1笔=首单，之后=返单。
