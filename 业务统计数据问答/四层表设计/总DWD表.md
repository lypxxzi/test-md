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

---

## DWD-3：`dwd_order_detail_bus_snapshot`（订单明细业务快照表）

**来源场景：** 场景12 — 客户出货统计（下单侧）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| order_id | bigint | 订单id |
| order_product_id | bigint | 订单产品id |
| type | int | 产品类型（0配方产品,1中间品,2成品,3非化妆品,4原料,5包材,6辅料） |
| product_code | varchar(500) | 产品编号 |
| product_name | varchar(500) | 产品名 |
| product_id | bigint | 产品id |
| quantity | decimal(40,20) | 数量 |
| province | varchar(50) | 省 |
| city | varchar(50) | 市 |
| area | varchar(50) | 区 |
| offer_price | decimal(40,20) | 单件报价 |
| budget_cost_single | decimal(40,20) | 预算单件成本 |
| begin_date | bigint | 开始时间/数据时间 |
| end_date | bigint | 结束时间 |
| create_date | bigint | 创建时间 |
| company_id | bigint | 所属公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

**说明：** 开发已有表（demo SQL 第453行）。拉链取有效行：`begin_date <= 时间点 AND end_date > 时间点`。

**用途（场景12下单侧）：** 下单数量=∑quantity、下单金额=∑(quantity×offer_price)，按 create_date 归月。

---

## DWD-4：`dwd_order_ship_detail_snapshot`（订单出货明细业务拉链表）【新建】

**来源场景：** 场景12 — 客户出货统计（出货侧）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| code | varchar(60) | 订单号 |
| type | int | 产品类型（0配方产品,1中间品,2成品,3非化妆品,4原料,5包材,6辅料） |
| order_id | bigint | 订单id |
| order_product_id | bigint | 订单产品id |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| product_code | varchar(500) | 产品编号 |
| product_name | varchar(500) | 产品名 |
| out_quantity | decimal(40,20) | 已发货数量 |
| offer_price | decimal(40,20) | 单件报价 |
| phase_status | int | 进度状态（0未完成，1发货完成，2强制完成） |
| bus_type | varchar(100) | 数据生成节点/业务类型（本行由哪个发货事件产生） |
| delivery_date | bigint | 出货日期 |
| finish_date | bigint | 出货完成日期 |
| begin_date | bigint | 开始时间（本次事件发生时间） |
| create_date | bigint | 创建时间（下单时间） |
| company_id | bigint | 所属公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

**本质：** 只记"发货"事件的明细级拉链表（方案A）：只要某条订单产品明细发生一次发货事件就 append 一行，**没发过货的明细不进本表**。历史行不覆盖，取某明细最新出货状态 = 该 order_product_id 下 begin_date 最大的行。下单数量/金额不在本表，由 DWD-3 提供。

**触发事件（bus_type 标节点，均由发货业务驱动）：**
1. 发货审核完成（每次发货）— out_quantity 累加、delivery_date 更新；未发满时 phase_status 仍=0未完成（明细级用数量差体现部分发货，无"部分发货"状态）
2. 发货完成 — out_quantity 发满，phase_status→1
3. 强制完成 — phase_status→2

**待确认：** 发货撤销/退货是否也 append 一行回退 out_quantity（ODS 未见退货字段，需与开发确认）。

**数据来源：** 7 张订单产品明细 ODS（配方/中间品/规格成品/非化妆品/原料/包材/辅料）UNION；缺 client_id 的 4 张（配方/原料/包材/辅料）用 order_id 回连 `ods_order` 补 client_id/client_name。

**说明：** 开发库目前没有这张，需新建。
