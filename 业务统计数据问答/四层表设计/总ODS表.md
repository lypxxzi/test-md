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

**其他场景补充字段（业务库已有，同步时一并带上）：**

| 字段 | 类型 | 说明 | 覆盖范围 |
|------|------|------|------|
| product_id | bigint | 产品id | 7张均有（TOP30产品统计用） |
| product_code | varchar | 产品编号 | 7张均有 |
| product_name | varchar | 产品名 | 7张均有 |
| production_status | int | 生产状态（0未处理,1不需生产,2部分生产,3全部生产） | 仅4张需生产明细（配方/中间品/规格成品/非化妆品），在产/未排产判断用 |
| budget_cost_single | decimal | 预算单件成本 | 仅4张需生产明细（成本暂不关注，字段先同步） |

---

## ODS-4：`ods_delivery`（发货单信息表 · 主表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 发货单id |
| company_id | bigint | 公司id |
| type | int | 产品类型（0配方产品,1中间品,2成品,3非化妆品,4原料,5包材,6辅料） |
| product_line_id | bigint | 产线id |
| product_line_name | varchar | 产线名 |
| code | varchar | 发货单号 |
| back_code | varchar | 回返单号 |
| delivery_date | bigint | 发货时间 |
| out_date | bigint | 实际出库日期 |
| client_id | bigint | 客户id |
| client_code | varchar | 客户编号 |
| client_name | varchar | 客户名 |
| secret | int | 是否保密（0否，1是） |
| linkman_id | bigint | 联系人id |
| linkman_name | varchar | 联系人姓名 |
| linkman_phone | varchar | 联系人手机号码 |
| province | varchar | 省 |
| city | varchar | 市 |
| area | varchar | 区 |
| address | varchar | 详细地址 |
| address_type | int | 地址类型（0国内地址，1国外地址） |
| status | int | 发货状态（0未签名，1未审，2已审，3已出库，4失效，5作废） |
| approval_status | int | 审核状态（0未签名，1未审核，2已审核，3失效，4作废） |
| approval_date | bigint | 审定时间 |
| reason | varchar | 重做/作废原因 |
| approval_template_id | bigint | 公司审批任务模板id |
| user_id | bigint | 业务员id/用户id |
| user_name | varchar | 业务员姓名 |
| delivery_type | int | 发货类型（0正常发货，1预备发货，2预备发货已完成） |
| code_collection | varchar | 订单号、产品编号、产品名集合 |
| sign_pdf | varchar | 签收文件pdf |
| pdf_url | varchar | pdf文档路径 |
| pdf_create_date | bigint | pdf创建时间 |
| sign_status | int | 签收照状态（0无，1有） |
| docx_url | varchar | docx文档路径 |
| docx_create_date | bigint | docx创建时间 |

**说明：**
- 一张发货单一行；一张发货单挂多条发货明细（ODS-5），同一订单产品明细可分多张发货单多次发货
- 有效出货口径：审核状态 approval_status=2（已审核）且 发货状态 status=3（已出库）——一定要审核通过后才能出库发货；未审核、失效、作废的发货单是无意义数据，不计入出货统计
- 客户/地址/业务员信息发货单上冗余存了一份，出货统计可直接用，不必回连 `ods_order`

---

## ODS-5：`ods_delivery_detail`（发货明细表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 发货明细id |
| delivery_id | bigint | 发货单id |
| order_detail_id | bigint | 订单明细id（对应7张订单产品明细表的id，含包材等各产品类型） |
| out_quantity | decimal | 出货数量（本次发货数量，单次值、非累计） |
| remark | varchar | 出库备注 |
| check_status | int | 对账状态（0不需对账，1未对账，2已对账） |
| company_id | bigint | 公司id |

**说明：**
- 一条发货明细一行 = 某张发货单里某条订单产品明细的本次出货数量
- order_detail_id 指向哪张订单产品明细表，由主表 `ods_delivery.type`（产品类型）决定
- 某条订单产品明细的累计已发货数量 = ∑该 order_detail_id 下、主表已审核且已出库（approval_status=2 且 status=3）发货单的 out_quantity（应与 ODS-3 的 out_quantity 对得上，可做校验）
