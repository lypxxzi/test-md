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
