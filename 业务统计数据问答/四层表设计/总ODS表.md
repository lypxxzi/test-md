# ODS层（原始数据层）— 总表

> 实时更新，监测改动，从业务系统全量同步，不做任何计算

---

## ODS-1：`ods_client`（客户信息表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 客户id |
| code | varchar | 客户编号 |
| name | varchar | 客户名 |
| perfect_status | int | 完善状态（0未完善，1已完善） |
| label | varchar | 客户标签/类型 |
| remark | varchar | 备注 |
| status | int | 客户状态（0未下单，1活跃，2非活跃） |
| proceeds_mode | int | 结账方式（0未定义，1全款，2月结，3预收，4免费） |
| user_id | bigint | 业务员id |
| user_name | varchar | 用户真实姓名/业务员姓名 |
| share_status | int | 是否共享（0不共享，1共享） |
| secret | int | 是否保密（0否，1是） |
| code_type | int | 编号类型（0系统规则，1自定义） |
| brand_name_array | varchar | 商标合集 |
| company_id | bigint | 公司id |
| create_date | bigint | 创建时间 |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

---

## ODS-2：`ods_order`（订单表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 订单id |
| code | varchar | 订单号 |
| client_id | bigint | 客户id |
| company_id | bigint | 公司id |
| business_user_id | bigint | 业务员id |
| phase_status | int | 发货状态（0未发货，1部分发货，2全部发货，3强制完成） |
| plan_status | int | 排产状态（0未处理，1不需计划，2部分计划，3全部计划） |
| approval_status | int | 审批状态（0未签名，1未审批，2已审批，3失效，4作废） |
| total_price | decimal | 订单总额 |
| create_date | bigint | 下单时间 |
| delete_status | int | 删除状态（0未删除，1已删除） |

---

## ODS-3：订单产品明细表（7张，按产品类型分表，结构一致）

**来源场景：** 场景12 — 客户出货统计

| ODS 表 | 产品类型 |
|------|------|
| `ods_order_recipe_product` | 配方产品 |
| `ods_order_half_product` | 中间品 |
| `ods_order_product_specification` | 规格成品 |
| `ods_order_different_product` | 非化妆品 |
| `ods_order_plantraw` | 原料 |
| `ods_order_pack` | 包材 |
| `ods_order_assist` | 辅料 |

**本场景用到的公共字段（7张均有）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| order_id | bigint | 订单id |
| quantity | int/decimal | 数量（下单数量，明细件数） |
| out_quantity | int/decimal | 已发货数量 |
| offer_price | decimal | 单件报价 |
| delivery_date | bigint | 出货日期 |
| finish_date | bigint | 出货完成日期 |
| phase_status | int | 进度状态（0未完成，1已完成/发货完成，2强制完成） |
| create_date | bigint | 创建时间 |
| company_id | bigint | 公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |

**说明：**
- 一条产品明细一行；一个主订单挂多条产品明细，每条明细独立发货（out_quantity 逐次累加）
- client_id：中间品/规格成品/非化妆品 3 张有；配方产品/原料/包材/辅料 4 张没有，需 order_id 回连 `ods_order` 补客户
- 明细级没有"部分发货"状态，部分发货靠 out_quantity < quantity 体现

---

## ODS-4：`ods_gathering_record`（收款记录表）

**来源场景：** 应收款统计 — 收款先录入收款记录，再分配给订单（订单表的"已收金额"= 已分配到该订单的金额）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 收款记录id |
| code | varchar | 编号 |
| gathering_date | bigint | 收款日期 |
| client_id | bigint | 客户id |
| client_code | varchar | 客户编号 |
| client_name | varchar | 客户名 |
| secret | int | 是否保密（0否，1是） |
| company_account_name | varchar | 公司账户名 |
| company_account_type | int | 公司账户类型（0银行账户，1微信账户，2支付宝账户，3POS机账户，4现金账户，5其他账户） |
| client_account_name | varchar | 客户账户名 |
| client_account_type | int | 客户账户类型（0银行账户，1微信账户，2支付宝账户，3POS机账户，4现金账户，5其他账户） |
| gathering_price | decimal | 收款金额 |
| allot_price | decimal | 分配金额（已分配到订单的金额） |
| allot_status | int | 分配状态（0未分配，1部分分配，2全部分配） |
| ticket_price | decimal | 有票据金额 |
| ticket_status | int | 票据状态（0不完整，1完整） |
| approval_status | int | 审批状态（0未签名，1未审批，2已审批，3失效，4作废） |
| company_approval_task_template_id | bigint | 公司审批任务模板id |
| decide_date | bigint | 审定时间 |
| fallcause | varchar | 重做/作废原因 |
| currency_id | bigint | 币别id |
| currency_type | int | 数据来源（0系统，1自定义） |
| currency_code | varchar | 币别编号 |
| currency_name | varchar | 币别名称 |
| currency_symbol | varchar | 货币符号 |
| currency_exchange_rate_type | int | 汇率类型（0固定，1浮动） |
| currency_exchange_rate | decimal | 汇率值 |
| currency_conversion_way | int | 折算方式（0原币*汇率=本位币，1原币/汇率=本位币） |
| edit_user_id | bigint | 编辑人id |
| edit_user_name | varchar | 编辑人姓名 |
| edit_date | bigint | 编辑时间 |
| create_user_id | bigint | 创建人id |
| create_date | bigint | 创建时间 |
| company_id | bigint | 公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

**说明：**
- 一笔收款一行；一笔收款可分配到多个订单，`gathering_price − allot_price` = 该笔收款尚未分配的余额
- 客户维度：SUM(gathering_price − allot_price) = 客户已到账但未分配的收款余额，是"剩余未分配收款总额"与"合计未收款总额"的差值来源
