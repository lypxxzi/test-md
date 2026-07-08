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

补充字段（发货单驱动后新增）：

| 字段 | 类型 | 说明 |
|------|------|------|
| delivery_id | bigint | 发货单id（本行由哪张发货单触发） |
| delivery_code | varchar(60) | 发货单号 |
| this_out_quantity | decimal(40,20) | 本次出货数量（该发货明细单次值；out_quantity 为累计值） |

**本质：** 只记"发货"事件的明细级拉链表（方案A）：只要某条订单产品明细发生一次发货事件就 append 一行，**没发过货的明细不进本表**。历史行不覆盖，取某明细最新出货状态 = 该 order_product_id 下 begin_date 最大的行。下单数量/金额不在本表，由 DWD-3 提供。

**事件源改为发货单（ODS-4/ODS-5），生成逻辑：**

监听 `ods_delivery`（发货单主表）的 status（发货状态）变化，按发货单驱动写入；每张发货单出库时，对它下面的每条 `ods_delivery_detail`（发货明细）各 append 一行：

1. **发货单出库（status→3已出库，且 approval_status=2已审核）**，对该发货单每条发货明细：（一定要审核通过后才能出库；未审核的发货单不可能出库，若出现视为脏数据丢弃）
   - 用 delivery_detail.order_detail_id + delivery.type（产品类型）定位到对应订单产品明细（7张ODS之一）
   - this_out_quantity = 该发货明细的出货数量；out_quantity = 该 order_detail_id 历史累计（∑此前已出库发货单的出货数量 + 本次）
   - delivery_date = 发货单的发货时间（归月用）；begin_date = 出库事件时间
   - out_quantity < quantity（DWD-3）→ phase_status 仍=0未完成（部分发货靠数量差体现）；发满 → phase_status=1，finish_date = 本次出库时间
2. **发货单失效/作废（status→4/5，且此前已出库计入过）**：对该单每条发货明细 append 一行回退，out_quantity 扣减该单的出货数量，this_out_quantity 记负数，bus_type 标"发货作废/失效"（解决原"发货撤销如何回退"的待确认问题）
3. **订单明细强制完成**（订单侧事件，非发货单驱动）— phase_status→2

**口径：**
- 只统计 审核状态=2已审核 且 发货状态=3已出库 的发货单；未签名/未审核/已审未出库/失效/作废 一律不产生行（未审核即可失效作废的数据无意义，在DWD入口挡掉）
- client_id/client_name/省市区/业务员 直接取发货单冗余字段，不必回连 `ods_order`；发货单缺失时再用 order_id 回连补
- delivery_type：0正常发货计入；1预备发货/2预备发货已完成 是否计入出货统计【待与业务确认】
- 同一订单产品明细可被多张发货单多次发货，每次出库各 append 一行，出货数量按月归集时用 this_out_quantity 求和（∑单次值），避免用累计值重复计算

**数据来源：** `ods_delivery` + `ods_delivery_detail`（事件源、出货数量）；7 张订单产品明细 ODS（产品信息、quantity、offer_price）；`ods_order`（兜底补客户）。

**说明：** 开发库目前没有这张，需新建。
