# DWS层（汇总数据层）— 总表

> 跑批时间：每天凌晨，从DWD层聚合数据。“_天”表每天凌晨执行、算的是“昨天”（数据日期=昨天，统计截至昨天24点）；“_月”表每天凌晨执行、覆盖更新“昨天所属月份”的行（统计该月1号~昨天24点，保证本月随时有数），月初1号凌晨算出的即上月完整数据，之后上月行定格。
>
> 逻辑统一格式：粒度 / 执行时间 / 数据来源（写明取有效行或最新行规则）/ 执行逻辑（1取数条件 2计算公式 3落表方式）/ 口径说明

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

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**数据来源：** dwd_client_snapshot（客户拉链表），取"昨天结束时正在生效"的行：begin_date <= 昨天24点 AND end_date > 昨天24点

**执行逻辑（截至昨天为止，示例：跑2026-06期间某天）：**

```
SET @month_end = 执行时刻凌晨0点时间戳（=昨天24点）

total_count     = COUNT(DISTINCT client_id) WHERE begin_date <= @month_end                       -- 累计值
active_count    = COUNT(DISTINCT client_id) WHERE status=1 AND begin_date <= @month_end AND end_date > @month_end   -- 累计值
inactive_count  = COUNT(DISTINCT client_id) WHERE status=2 AND begin_date <= @month_end AND end_date > @month_end   -- 累计值
no_order_count  = COUNT(DISTINCT client_id) WHERE status=0 AND begin_date <= @month_end AND end_date > @month_end   -- 累计值
increment_count = COUNT(DISTINCT client_id) WHERE 首次begin_date在本月内                          -- 增量值

落表：写入/覆盖 当月（yyyy-MM）这一行
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

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**数据来源：** dwd_client_snapshot（客户拉链表），从拉链行的状态变化取数

**执行逻辑（区间=当月1号~昨天24点）：**

```
SET @month_start = 当月1号凌晨时间戳
SET @month_end = 执行时刻凌晨0点时间戳（=昨天24点）

no_order_to_active_count = 本月内从status=0变为status=1的客户数 -- 增量值
no_order_to_active_rate  = 未下单→活跃转化率 = 本月未下单转活跃客户数 ÷ 月初未下单客户数 ×100%
active_to_inactive_count = 本月内从status=1变为status=2的客户数 -- 增量值
active_to_inactive_rate  = 活跃→非活跃转化率 = 本月活跃转非活跃客户数 ÷ 月初活跃客户数 ×100%

落表：写入/覆盖 当月（yyyy-MM）这一行
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
| business_user_id | bigint | 业务员id（=ods_client.user_id，从客户拉链表当前生效行取） |
| business_user_name | varchar | 业务员名称 |
| repeat_count_90d | int | 近90天返单次数 |
| repeat_count_180d | int | 近180天返单次数 |
| repeat_count_365d | int | 近365天返单次数 |
| has_repeat_90d | tinyint | 近90天是否返单（0无，1有） |
| has_repeat_180d | tinyint | 近180天是否返单（0无，1有） |
| has_repeat_365d | tinyint | 近365天是否返单（0无，1有） |
| data_date_str | varchar | 数据日期（yyyy-MM-dd） |

**数据来源：** 订单业务拉链表（进DWD即有效订单），一个订单取最新行回到订单级

**执行时间：** 每天凌晨，新增一行（数据日期=昨天，统计截至昨天24点）

**定义：**
- 首单 = 该客户按下单时间排最早的那一笔订单
- 返单 = 该客户第二笔及以后的订单
- 近N天 = 数据日期往前推N天的区间（N=90/180/365）

**生成逻辑（对每个客户）：**
1、取该客户所有有效订单，一个订单取最新行回到订单级，按下单时间从早到晚排，排第二及以后的都算返单
2、近90/180/365天返单次数 = 下单时间落在区间内的返单笔数（滑动区间增量值）
3、近90天是否返单 = 近90天返单次数大于0则为是，否则为否；180天、365天同理
4、落表：每客户每天新增一行

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
| business_user_id | bigint | 业务员id（从客户拉链表当前生效行取归属） |
| business_user_name | varchar | 业务员名称 |
| repeat_count_180d | int | 近180天返单次数（截至数据日期往前推的滑动值） |
| repeat_count_365d | int | 近365天返单次数（截至数据日期往前推的滑动值） |
| repeat_count_month | int | 当月返单次数（该自然月内新产生的返单笔数）——**待开发补** |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** 订单业务拉链表（进DWD即有效订单），一个订单取最新行回到订单级

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**执行逻辑（对每个客户，截至昨天为止）：**
1、取该客户所有有效订单，按下单时间从早到晚排，第二笔及以后算返单
2、近180/365天返单次数 = 从昨天往前推180/365天区间内的返单笔数（滑动区间增量值）
3、当月返单次数 = 落在当自然月（1号~昨天24点）内的返单笔数（当月增量值）
4、落表：写入/覆盖 该客户当月（yyyy-MM）这一行

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
| business_user_id | bigint | 业务员id（从客户拉链表当前生效行取归属） |
| business_user_name | varchar | 业务员名称 |
| order_count_30d | int | 最近30天下单数量 |
| order_count_90d | int | 最近90天下单数量 |
| order_count_180d | int | 最近180天下单数量 |
| order_count_365d | int | 最近365天下单数量 |
| data_date_str | varchar | 数据日期（yyyy-MM-dd） |

**数据来源：** 订单业务拉链表（进DWD即有效订单），一个订单取最新行回到订单级

**执行时间：** 每天凌晨，新增一行（数据日期=昨天，统计截至昨天24点）

**执行逻辑（对每个客户）：**
1、取该客户的订单：同一订单在拉链表里有多行（每个业务事件一行），取 begin_date 最大的最新行回到订单级（一个订单只算一次，避免多事件重复计数）
2、分别数 下单时间落在最近30/90/180/365天区间内 的订单笔数（滑动区间增量值）
3、落表：每客户每天新增一行

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
| business_user_id | bigint | 业务员id（从客户拉链表当前生效行取归属） |
| business_user_name | varchar | 业务员名称 |
| order_count_180d | int | 近180天下单数量（截至数据日期往前推的滑动值） |
| order_count_365d | int | 近365天下单数量（截至数据日期往前推的滑动值） |
| order_count_month | int | 当月下单笔数（该自然月内新产生的有效订单笔数） |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** 订单业务拉链表（进DWD即有效订单），一个订单取最新行回到订单级

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**执行逻辑（对每个客户，截至昨天为止）：**
1、取该客户所有有效订单
2、近180/365天下单数量 = 从昨天往前推180/365天区间内的下单笔数（滑动区间增量值）
3、当月下单笔数 = 下单时间落在当自然月（1号~昨天24点）内的有效订单笔数（当月增量值）
4、落表：写入/覆盖 该客户当月（yyyy-MM）这一行

**用途：** 给场景7趋势图，取TOP5客户逐月的"当月下单笔数"连成趋势线

---

## DWS-7：`dws_client_order_amount_daily`（客户订单金额汇总_天）

**来源场景：** 场景8 — 高订单金额客户统计

**粒度：一个公司 + 一个客户 + 一天**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| business_user_id | bigint | 业务员id（从客户拉链表当前生效行取归属） |
| business_user_name | varchar | 业务员名称 |
| order_amount_30d | decimal | 最近30天下单金额 |
| order_amount_90d | decimal | 最近90天下单金额 |
| order_amount_180d | decimal | 最近180天下单金额 |
| order_amount_365d | decimal | 最近365天下单金额 |
| data_date_str | varchar | 数据日期（yyyy-MM-dd） |

**数据来源：** 订单业务拉链表（进DWD即有效订单，取合计金额 total_price）

**执行时间：** 每天凌晨，新增一行（数据日期=昨天，统计截至昨天24点）

**执行逻辑（对每个客户）：**
1、取该客户的有效订单（一个订单取最新行回到订单级，金额取 total_price）
2、分别把 下单时间落在最近30/90/180/365天区间内 的订单合计金额相加（滑动区间增量值）
3、落表：每客户每天新增一行

**用途：** 给场景8排名，按各周期下单金额取TOP30

**说明：** 开发已有表（demo SQL 中 `dws_client_order_amount_daily`，与下单数量_天并列，另含 province/city 等字段）

**用途补充：** 也给场景9排名（按近180/365天下单金额取TOP5）

---

## DWS-8：`dws_client_order_month`（客户订单数量/金额汇总_月）

**来源场景：** 场景7 / 场景9 — 趋势

**粒度：一个公司 + 一个客户 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| client_id | bigint | 客户id |
| client_name | varchar | 客户名称 |
| company_id | bigint | 公司id |
| business_user_id | bigint | 业务员id（从客户拉链表当前生效行取归属） |
| business_user_name | varchar | 业务员名称 |
| order_count | int | 当月下单数量 |
| order_amount | decimal | 当月下单金额 |
| force_amount | decimal | 当月强制完成金额 |
| plus_amount | decimal | 当月追加金额 |
| sub_amount | decimal | 当月扣减金额（删除追加的金额） |
| data_date_str | varchar | 数据日期（yyyy-MM） |

**数据来源：** 订单业务拉链表（进DWD即有效订单），一个订单取最新行回到订单级

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**执行逻辑（对每个客户）：**
1、取该客户下单时间落在当自然月（1号~昨天24点）内的有效订单
2、当月下单数量=订单笔数、当月下单金额=∑total_price、强制完成/追加/扣减金额按对应事件行汇总（均为当月增量值）
3、落表：写入/覆盖 该客户当月（yyyy-MM）这一行

**用途：**
- 场景7趋势：取"当月下单数量"字段
- 场景9趋势：取"当月下单金额"字段

**说明：** 开发已有表（demo SQL 中 `dws_client_order_month`）。场景7趋势可直接复用本表的"当月下单数量"，不必再单独建 `dws_client_order_count_monthly`

---

## DWS-9：`dws_client_active_order_month`（活跃客户下单情况月度汇总表_月）

**来源场景：** 场景11 — 活跃客户下单统计

**粒度：一个公司 + 一个月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键 |
| active_count | int | 活跃客户数 |
| client_count_by_order | int | 活跃客户中有下单数 |
| client_count_by_no_order | int | 活跃客户中无下单数 |
| data_date | bigint | 数据日期 |
| data_date_str | varchar(20) | 数据日期字符串(yyyy-MM) |
| create_date | bigint | 创建时间 |
| company_id | bigint | 所属公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

**数据来源：** 客户拉链表（DWD-1，取昨天结束时正在生效的行）+ 订单业务拉链表（DWD-2，一个订单取最新行回到订单级）

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**执行逻辑（截至昨天为止）：**
1、active_count = 昨天结束时处于活跃（status=1）的客户数（累计值）
2、client_count_by_order = 这些活跃客户中，本月（1号~昨天24点）有有效下单的客户数（当月增量值）
3、client_count_by_no_order = active_count − client_count_by_order
4、落表：写入/覆盖 当月（yyyy-MM）这一行

**说明：** 开发已有表（demo SQL 第502行）

---

## DWS-10：`dws_client_order_ship_month`（客户下单出货汇总表_月）【新建】

**来源场景：** 场景12 — 客户出货统计

**粒度：一个公司 + 一个客户 + 一个自然月**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | bigint | 主键（自增） |
| client_id | bigint | 客户id |
| client_name | varchar(100) | 客户名 |
| order_quantity | decimal(40,20) | 当月下单数量 |
| order_amount | decimal(40,20) | 当月下单金额 |
| ship_quantity | decimal(40,20) | 当月出货数量 |
| ship_amount | decimal(40,20) | 当月出货金额 |
| data_date | bigint | 数据日期 |
| data_date_str | varchar(20) | 数据日期字符串(yyyy-MM) |
| create_date | bigint | 创建时间 |
| company_id | bigint | 所属公司id |
| delete_status | int | 删除状态（0未删除，1已删除） |
| delete_date | bigint | 删除时间 |

**数据来源：**
- 下单侧 DWD-3 `dwd_order_detail_bus_snapshot`（拉链取昨天结束时正在生效的行）
- 出货侧 DWD-4 `dwd_order_ship_detail_snapshot`（每条明细取最新行 = 该 order_product_id 下 begin_date 最大）

**执行时间：** 每天凌晨，覆盖更新“昨天所属月份”行（统计该月1号~昨天24点）；月初1号跑完上月即定格

**执行逻辑（两侧各按各的日期归月，再按 客户+公司+月 拼一行）：**
1、下单侧：取 create_date 落在当月的明细 → order_quantity=∑quantity、order_amount=∑(quantity×offer_price)（当月增量值）
2、出货侧：取 delivery_date 落在当月的明细 → ship_quantity=∑out_quantity、ship_amount=∑(out_quantity×offer_price)（当月增量值；⚠️out_quantity是累计已发货数，明细跨月分批发货时需用差值：本月最新行out_quantity − 上月末最新行out_quantity，避免把上月发的量算进本月）
3、以 client_id+company_id+月 为键合并两侧成一行，写入/覆盖当月行（某月只下单没发货→出货为0；只发货没下单→下单为0）

**口径提醒：** 同条明细"下单月"和"出货月"可能不同（这月下、下月发），一行里 order_* 与 ship_* 是"该月下了多少 / 该月发了多少"两个独立口径，不是同一批货的一一对应。

**说明：** 开发库目前没有这张，需新建。
