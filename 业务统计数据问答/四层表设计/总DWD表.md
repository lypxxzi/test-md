# DWD层（明细数据层）— 总表

> 根据事件更新，可视为实时更新，维护拉链表/快照表记录状态变化历史
>
> 共 6 张表

---

## DWD-1：`dwd_client_snapshot`（客户拉链表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| user_id | bigint | 业务员id |
| user_name | varchar | 业务员名称 |
| status | int | 客户状态（0未下单，1活跃，2非活跃） |
| begin_date | bigint | 开始时间（毫秒时间戳） |
| end_date | bigint | 结束时间（毫秒时间戳，9999-12-31表示当前有效） |

**更新逻辑：** 监测 ods_client 的 status 变化，当客户状态发生改变时：
1. 关闭旧行：将当前有效行的 end_date 设为变化时间
2. 插入新行：begin_date = 变化时间，end_date = 9999-12-31 的时间戳

**查询方式：** 查某个时间点的客户状态：`WHERE begin_date <= 时间戳 AND end_date > 时间戳`

**用途：** 客户存量/趋势/转化/同环比（场景1/2/3/10/11）；带业务员id/名称，业务绩效的客户统计可按业务员过滤。

---

## DWD-2：`dwd_order_bus_snapshot`（订单业务快照表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| order_id | bigint | 订单id |
| code | varchar | 订单号 |
| total_price | decimal | 合计金额 |
| bus_type | varchar | 数据生成节点/业务类型（本行由哪个业务事件产生） |
| begin_date | bigint | 开始时间（本次事件发生时间） |
| create_date | bigint | 创建时间（下单时间） |

**本质：** 记录订单全生命周期的事实表。订单每发生一个业务事件，就 append 一行，记录该时刻订单的快照 + 事件节点（bus_type）+ 事件时间（begin_date）。历史行不覆盖，取订单最新状态 = 该 order_id 下 begin_date 最大的行。订单在ODS新建但未审批时只在ODS、不进本表；进本表的订单即为已审批过的订单。

**触发事件（均由 ods_order 事件驱动）：**
1. 订单审批完成（订单生效，首次进表）
2. 订单强制完成
3. 追加费用
4. 删除追加费用

**用途（场景4返单等）：** 进本表的订单即有效订单，取每个订单最新行、按 order_id 回到订单级；同一客户按下单时间排序，第1笔=首单，之后=返单。

---

## DWD-3：`dwd_order_detail_bus_snapshot`（订单明细业务拉链表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| order_id | bigint | 订单id |
| code | varchar | 订单号 |
| order_product_id | bigint | 订单产品id |
| product_id | bigint | 产品id |
| type | int | 产品类型（0配方产品,1中间品,2成品,3非化妆品,4原料,5包材,6辅料） |
| product_code | varchar(500) | 产品编号 |
| product_name | varchar(500) | 产品名 |
| quantity | decimal(40,20) | 下单数量 |
| offer_price | decimal(40,20) | 单价报价 |
| budget_cost_single | decimal(40,20) | 预算单价成本 |
| begin_date | bigint | 开始时间 |
| end_date | bigint | 结束时间 |
| create_date | bigint | 下单时间/创建时间 |

**本质：** 明细级拉链表，来自 7 张订单产品明细 ODS。拉链取有效行：`begin_date <= 时间点 AND end_date > 时间点`。

**用途：** 场景12下单侧（下单数量=∑quantity、下单金额=∑(quantity×offer_price)，按 create_date 归月）；按期交付统计的"累计订单产品数"分母；单客户场景6/7 预算成本（∑budget_cost_single×quantity）。

---

## DWD-4：`dwd_order_ship_detail_snapshot`（订单出货明细业务快照表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| order_id | bigint | 订单id |
| code | varchar(60) | 订单号 |
| order_product_id | bigint | 订单产品id |
| product_id | bigint | 产品id |
| type | int | 产品类型（0配方产品,1中间品,2成品,3非化妆品,4原料,5包材,6辅料） |
| product_code | varchar(500) | 产品编号 |
| product_name | varchar(500) | 产品名 |
| quantity | decimal(40,20) | 下单数量 |
| out_quantity | decimal(40,20) | 已发货数量 |
| offer_price | decimal(40,20) | 单价报价 |
| phase_status | int | 进度状态（0未完成，1发货完成，2强制完成） |
| bus_type | varchar(100) | 数据生成节点（本行由哪个发货事件产生） |
| delivery_date | bigint | 出货日期 |
| finish_date | bigint | 出货完成日期 |
| begin_date | bigint | 开始时间（本次事件发生时间） |

**本质：** 只记"发货"事件的明细级快照表：只要某条订单产品明细发生一次发货事件就 append 一行，**没发过货的明细不进本表**。历史行不覆盖，取某明细最新出货状态 = 该 order_product_id 下 begin_date 最大的行。

**触发事件（bus_type 标节点，均由发货业务驱动）：**
1. 发货审核完成（每次发货）— out_quantity 累加、delivery_date 更新；未发满时 phase_status 仍=0未完成（明细级用数量差体现部分发货，无"部分发货"状态）
2. 发货完成 — out_quantity 发满，phase_status→1
3. 强制完成 — phase_status→2

**数据来源：** 7 张订单产品明细 ODS UNION；缺 client_id 的 4 张（配方/原料/包材/辅料）用 order_id 回连 `ods_order` 补 client_id/client_name。

**用途：** 场景12出货侧（出货数量=∑out_quantity、出货金额=∑(out_quantity×offer_price)，按 delivery_date 归月）；按期交付统计的完成/逾期判断（phase_status、finish_date）。

---

## DWD-5：`dwd_order_produce_detail_snapshot`（订单生产明细业务快照表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| order_id | bigint | 订单id |
| code | varchar(60) | 订单号 |
| order_product_id | bigint | 订单产品id |
| product_id | bigint | 产品id |
| type | int | 产品类型（0配方产品,1中间品,2成品,3非化妆品） |
| product_code | varchar(500) | 产品编号 |
| product_name | varchar(500) | 产品名 |
| production_status | int | 生产状态（0未处理,1不需生产,2部分生产,3全部生产） |
| produce_quantity | decimal(40,20) | 生产数量 |
| bus_type | varchar(100) | 数据生成节点（本行由哪个生产事件产生） |
| begin_date | bigint | 开始时间（本次事件发生时间） |
| create_date | bigint | 创建时间/下单时间 |

**本质：** 只记"生产"事件的明细级快照表：订单审批完成即进表（生产状态0），之后某条订单产品明细发生生产事件（开始生产/部分生产/全部生产）就 append 一行，历史行不覆盖；取某明细最新生产状态 = 该 order_product_id 下 begin_date 最大的行。

**数据来源：** 4 张带 production_status 的明细 ODS（配方产品/中间品/规格成品/非化妆品）UNION；缺 client_id 的表用 order_id 回连 `ods_order` 补 client_id/client_name。原料/包材/辅料不需生产，不进本表。

**用途：** 单客户场景1/3 —"在生产中"（任一明细生产状态=2/3）/"未排产"（需生产明细全=0）的订单分类判断。

---

## DWD-6：`dwd_order_proceeds_snapshot`（订单收款业务快照表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| company_id | bigint | 公司id |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| order_id | bigint | 订单id |
| code | varchar(60) | 订单号 |
| proceeds_date | bigint | 收款日期 |
| receivable_amount | decimal(40,20) | 应收金额 |
| received_amount | decimal(40,20) | 已收金额 |
| allocate_status | int | 分配状态（0未分配，1部分分配，2全部分配） |
| allocate_amount | decimal(40,20) | 分配金额 |
| proceeds_mode | int | 结账方式（0未定义，1全款，2月结，3预收，4免费） |
| bus_type | varchar(100) | 数据生成节点（本行由哪个收款事件产生） |
| begin_date | bigint | 开始时间（本次事件发生时间） |
| create_date | bigint | 创建时间/下单时间 |

**本质：** 记录订单收款事件的快照表：**收款记录审批成功才记录**（新建未审批不进表），每次收款/分配事件 append 一行，历史行不覆盖，取最新行=该订单当前收款状态。

**用途：** 回款、应收款类统计（暂不关注，预留）。
