/*
 Navicat Premium Dump SQL

 Source Server         : bi
 Source Server Type    : MySQL
 Source Server Version : 80028 (8.0.28)
 Source Host           : 192.168.0.101:3306
 Source Schema         : bi_wash

 Target Server Type    : MySQL
 Target Server Version : 80028 (8.0.28)
 File Encoding         : 65001

 Date: 26/06/2026 16:28:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ads_client_active_order_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_active_order_month`;
CREATE TABLE `ads_client_active_order_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active_count` int NOT NULL DEFAULT 0 COMMENT '活跃客户数',
  `client_count_by_order` int NOT NULL COMMENT '活跃客户中有下单数',
  `client_count_by_no_order` int NOT NULL COMMENT '活跃客户中无下单数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_caom_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 455 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_活跃客户下单情况月度汇总表_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_amount_top30_day
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_amount_top30_day`;
CREATE TABLE `ads_client_amount_top30_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `total_amount` decimal(40, 20) NOT NULL COMMENT '下单总金额',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 507995 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户订单金额top30_日' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_amount_top30_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_amount_top30_month`;
CREATE TABLE `ads_client_amount_top30_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `total_amount` decimal(40, 20) NOT NULL COMMENT '下单总金额',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16573 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户订单金额top30_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_base_stock_day
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_base_stock_day`;
CREATE TABLE `ads_client_base_stock_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active_count` int NOT NULL COMMENT '活跃客户总数',
  `inactive_count` int NOT NULL COMMENT '非活跃客户总数',
  `no_order_count` int NOT NULL COMMENT '未下单客户数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 156559 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户基础存量_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_conversion_trend_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_conversion_trend_month`;
CREATE TABLE `ads_client_conversion_trend_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `no_order_to_active_count` int NOT NULL COMMENT '未下单转活跃客户数',
  `active_to_inactive_count` int NOT NULL COMMENT '活跃转非活跃客户数',
  `no_order_to_active_rate` decimal(20, 10) NOT NULL COMMENT '未下单转活跃客户转化率',
  `active_to_inactive_rate` decimal(20, 10) NOT NULL COMMENT '活跃转非活跃客户转化率',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3805 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户转化率月度趋势_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_order_amount_trend_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_order_amount_trend_month`;
CREATE TABLE `ads_client_order_amount_trend_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `total_amount` decimal(40, 20) NOT NULL COMMENT '当月下单总金额',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5737 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户订单金额月度趋势' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_order_trend_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_order_trend_month`;
CREATE TABLE `ads_client_order_trend_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `order_count` int NOT NULL COMMENT '当月下单笔数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5737 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户订单月度趋势_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_reorder_period_stats_day
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_reorder_period_stats_day`;
CREATE TABLE `ads_client_reorder_period_stats_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `reorder_client_count` int NOT NULL COMMENT '返单客户数',
  `no_reorder_client_count` int NOT NULL COMMENT '未返单客户数(不包含未下单客户)',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44765 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户返单分周期统计(近90/180/365天)_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_client_stock_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_client_stock_month`;
CREATE TABLE `ads_client_stock_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_count` int NOT NULL COMMENT '客户总数',
  `client_increment` int NOT NULL COMMENT '当月客户增量',
  `active_count` int NOT NULL COMMENT '活跃客户总数',
  `inactive_count` int NOT NULL COMMENT '非活跃客户总数',
  `no_order_count` int NOT NULL COMMENT '未下单客户数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1346 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户存量_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_high_order_client_top30_day
-- ----------------------------
DROP TABLE IF EXISTS `ads_high_order_client_top30_day`;
CREATE TABLE `ads_high_order_client_top30_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `order_count` int NOT NULL COMMENT '下单笔数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 342276 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_高订单客户top30_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_high_order_client_top30_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_high_order_client_top30_month`;
CREATE TABLE `ads_high_order_client_top30_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `order_count` int NOT NULL COMMENT '下单笔数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11111 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_高订单客户top30_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_high_order_top5_day
-- ----------------------------
DROP TABLE IF EXISTS `ads_high_order_top5_day`;
CREATE TABLE `ads_high_order_top5_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `order_count` int NOT NULL COMMENT '下单次数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 57727 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_高下单top5_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_high_reorder_top5_day
-- ----------------------------
DROP TABLE IF EXISTS `ads_high_reorder_top5_day`;
CREATE TABLE `ads_high_reorder_top5_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `reorder_count` int NOT NULL COMMENT '返单次数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 176284 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_高返单top5_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_high_reorder_top5_month
-- ----------------------------
DROP TABLE IF EXISTS `ads_high_reorder_top5_month`;
CREATE TABLE `ads_high_reorder_top5_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) NOT NULL COMMENT '类型(1->30天;2->90天;3->180天;4->365天)',
  `ranking` tinyint NOT NULL COMMENT '排名',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `reorder_count` int NOT NULL COMMENT '返单次数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5829 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_高返单top5_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_rt_client_daily_inc
-- ----------------------------
DROP TABLE IF EXISTS `ads_rt_client_daily_inc`;
CREATE TABLE `ads_rt_client_daily_inc`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名称',
  `order_increment` int NOT NULL COMMENT '当日新增订单数（实时累加，首单为1）',
  `order_amount` decimal(40, 20) NOT NULL COMMENT '订单金额',
  `force_amount` decimal(40, 20) NOT NULL COMMENT '强制完成金额',
  `plus_amount` decimal(40, 20) NOT NULL COMMENT '追加金额',
  `sub_amount` decimal(40, 20) NOT NULL COMMENT '删除的追加金额',
  `data_date` bigint NOT NULL COMMENT '数据日期(当前是哪天的数据,第二天新单会创建新的数据)',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_rt_客户每日订单计数' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ads_rt_client_stock
-- ----------------------------
DROP TABLE IF EXISTS `ads_rt_client_stock`;
CREATE TABLE `ads_rt_client_stock`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_count` int NOT NULL COMMENT '客户总数',
  `active_count` int NOT NULL COMMENT '活跃客户总数',
  `inactive_count` int NOT NULL COMMENT '非活跃客户总数',
  `no_order_count` int NOT NULL COMMENT '未下单客户数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1857 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'ads_客户实时存量(凌晨生成当天数据,当天监听客户状态变化)' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for bi_log
-- ----------------------------
DROP TABLE IF EXISTS `bi_log`;
CREATE TABLE `bi_log`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `stack` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '堆栈信息',
  `clazz` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '调用的类（可空，正常日志时）',
  `method` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '调用的方法（可空，正常日志时）',
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '入参数据（可空，正常日志时）',
  `remark` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '备注',
  `cause` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '原因	',
  `dispose_date` bigint NOT NULL DEFAULT 0 COMMENT '处理时间',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_bi_disposedate`(`dispose_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'bi消息队列表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bi_message_queue
-- ----------------------------
DROP TABLE IF EXISTS `bi_message_queue`;
CREATE TABLE `bi_message_queue`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '消息ID',
  `bus_id` bigint NOT NULL COMMENT '业务ID',
  `bus_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '业务类型',
  `data_json` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '数据内容json',
  `hander_status` tinyint NOT NULL DEFAULT 0 COMMENT '处理状态（0未处理 1已处理）',
  `send_date` bigint NOT NULL DEFAULT 0 COMMENT '发送时间',
  `finish_date` bigint NOT NULL DEFAULT 0 COMMENT '消费完成时间',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_bi_status`(`hander_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 100 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'bi消息队列表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for bus_sys_bi_message
-- ----------------------------
DROP TABLE IF EXISTS `bus_sys_bi_message`;
CREATE TABLE `bus_sys_bi_message`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '消息ID',
  `bus_id` bigint NOT NULL COMMENT '业务ID',
  `bus_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '业务类型',
  `message_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'mq type',
  `data_json` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '数据内容json',
  `hander_status` tinyint NOT NULL DEFAULT 0 COMMENT '处理状态（0未发送 1已发送）',
  `send_date` bigint NOT NULL DEFAULT 0 COMMENT '发送时间',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_bus_sys_status`(`hander_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'bi消息队列表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dwd_client_snapshot
-- ----------------------------
DROP TABLE IF EXISTS `dwd_client_snapshot`;
CREATE TABLE `dwd_client_snapshot`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `status` int NOT NULL DEFAULT 1 COMMENT '0未下单，1活跃，2非活跃',
  `begin_date` bigint NOT NULL COMMENT '开始时间',
  `end_date` bigint NOT NULL COMMENT '结束时间',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dwd_cs_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 119408 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '客户拉链表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dwd_order_bus_snapshot
-- ----------------------------
DROP TABLE IF EXISTS `dwd_order_bus_snapshot`;
CREATE TABLE `dwd_order_bus_snapshot`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `code` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '订单号',
  `type` int NOT NULL COMMENT '产品类型（0配方产品，1中间品，2成品，3非化妆品，4原料，5包材，6辅料）',
  `order_id` bigint NOT NULL COMMENT '订单id',
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `phase_status` int NOT NULL DEFAULT 0 COMMENT '状态（0未发货，1部分发货，2全部发货，3强制完成）',
  `total_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '合计金额',
  `discount_total_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '优惠金额',
  `begin_date` bigint NOT NULL COMMENT '开始时间',
  `bus_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据生成节点/业务类型',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dwd_odi_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 129411 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dwd订单业务拉链表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dwd_order_detail_bus_snapshot
-- ----------------------------
DROP TABLE IF EXISTS `dwd_order_detail_bus_snapshot`;
CREATE TABLE `dwd_order_detail_bus_snapshot`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `order_id` bigint NOT NULL COMMENT '订单id',
  `order_product_id` bigint NOT NULL COMMENT '订单产品id',
  `type` int NOT NULL COMMENT '产品类型（0配方产品，1中间品，2成品，3非化妆品，4原料，5包材，6辅料）',
  `product_code` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品编号',
  `product_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '产品名',
  `product_id` bigint NOT NULL DEFAULT 0 COMMENT '产品id',
  `quantity` decimal(40, 20) NOT NULL COMMENT '数量',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '市',
  `area` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '区',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `budget_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '预算单件成本',
  `begin_date` bigint NOT NULL COMMENT '开始时间/数据时间',
  `end_date` bigint NOT NULL COMMENT '结束时间',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dwd_odwd_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 137925 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单明细业务快照表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dwd_order_finance_plus_snapshot
-- ----------------------------
DROP TABLE IF EXISTS `dwd_order_finance_plus_snapshot`;
CREATE TABLE `dwd_order_finance_plus_snapshot`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_finance_plus_id` bigint NOT NULL COMMENT '订单追加费用id',
  `order_id` bigint NOT NULL COMMENT '订单id',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '费用名',
  `price` decimal(40, 20) NULL DEFAULT NULL COMMENT '报价',
  `affirm_status` int NOT NULL DEFAULT 0 COMMENT '对账状态（0不需对账，1未对账，2已对账）',
  `bus_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据生成节点/业务类型',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dwd_cs_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 117157 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单追加费用拉链表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for dws_client_active_order_month
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_active_order_month`;
CREATE TABLE `dws_client_active_order_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active_count` int NOT NULL DEFAULT 0 COMMENT '活跃客户数',
  `client_count_by_order` int NOT NULL COMMENT '活跃客户中有下单数',
  `client_count_by_no_order` int NOT NULL COMMENT '活跃客户中无下单数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_caom_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 455 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_活跃客户下单情况月度汇总表_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_conversion_month
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_conversion_month`;
CREATE TABLE `dws_client_conversion_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `no_order_to_active_count` int NOT NULL COMMENT '未下单->活跃数',
  `no_order_to_active_rate` decimal(20, 10) NOT NULL COMMENT '未下单->活跃转换率',
  `active_to_inactive_count` int NOT NULL COMMENT '活跃->非活跃数',
  `active_to_inactive_rate` decimal(20, 10) NOT NULL COMMENT '活跃->非活跃转换率',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_ccm_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16485 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户转化_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_monthly
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_monthly`;
CREATE TABLE `dws_client_monthly`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `total_count` int NOT NULL DEFAULT 0 COMMENT '客户总数',
  `active_count` int NOT NULL DEFAULT 0 COMMENT '活跃客户数',
  `no_order_count` int NOT NULL DEFAULT 0 COMMENT '未下单客户数',
  `inactive_count` int NOT NULL DEFAULT 0 COMMENT '非活跃客户数',
  `increment_count` int NOT NULL DEFAULT 0 COMMENT '月新增客户数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_cm_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1346 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户统计_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_order_amount_daily
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_order_amount_daily`;
CREATE TABLE `dws_client_order_amount_daily`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '市',
  `order_amount_30d` decimal(40, 20) NOT NULL COMMENT '最近30天下单金额',
  `order_amount_90d` decimal(40, 20) NOT NULL COMMENT '最近90天下单金额',
  `order_amount_180d` decimal(40, 20) NOT NULL COMMENT '最近180天下单金额',
  `order_amount_365d` decimal(40, 20) NOT NULL COMMENT '最近365天下单金额',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_coad_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 338064 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户订单金额汇总表_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_order_count_daily
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_order_count_daily`;
CREATE TABLE `dws_client_order_count_daily`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '市',
  `order_count_30d` int NOT NULL COMMENT '最近30天下单数量',
  `order_count_90d` int NOT NULL COMMENT '最近90天下单数量',
  `order_count_180d` int NOT NULL COMMENT '最近180天下单数量',
  `order_count_365d` int NOT NULL COMMENT '最近365天下单数量',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_cocd_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 255822 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户订单量汇总表_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_order_day
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_order_day`;
CREATE TABLE `dws_client_order_day`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `order_count` int NOT NULL COMMENT '当天下单数量',
  `order_amount` decimal(40, 20) NOT NULL COMMENT '当天下单金额',
  `force_amount` decimal(40, 20) NOT NULL COMMENT '当天强制完成金额',
  `plus_amount` decimal(40, 20) NOT NULL COMMENT '当天追加金额',
  `sub_amount` decimal(40, 20) NOT NULL COMMENT '当天扣减金额(删除追加的金额)',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_cod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 454 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户订单数量/金额汇总表_日' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_order_month
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_order_month`;
CREATE TABLE `dws_client_order_month`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `order_count` int NOT NULL COMMENT '当月下单数量',
  `order_amount` decimal(40, 20) NOT NULL COMMENT '当月下单金额',
  `force_amount` decimal(40, 20) NOT NULL COMMENT '当月强制完成金额',
  `plus_amount` decimal(40, 20) NOT NULL COMMENT '当月追加金额',
  `sub_amount` decimal(40, 20) NOT NULL COMMENT '当月扣减金额(删除追加的金额)',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_com_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 187 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户订单数量/金额汇总表_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_repeat_order_daily
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_repeat_order_daily`;
CREATE TABLE `dws_client_repeat_order_daily`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `repeat_count_90d` int NOT NULL COMMENT '近90天返单次数',
  `repeat_count_180d` int NOT NULL COMMENT '近180天返单次数',
  `repeat_count_365d` int NOT NULL COMMENT '近365天返单次数',
  `has_repeat_90d` tinyint NOT NULL COMMENT '近90天是否返单(0无,1有)',
  `has_repeat_180d` tinyint NOT NULL COMMENT '近180天是否返单(0无,1有)',
  `has_repeat_365d` tinyint NOT NULL COMMENT '近365天是否返单(0无,1有)',
  `data_date` bigint NOT NULL COMMENT '数据日期(如果18号执行,存17号,数据包含17号整天)',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM-dd)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crod_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 213213 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户返单汇总表_天' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for dws_client_repeat_order_monthly
-- ----------------------------
DROP TABLE IF EXISTS `dws_client_repeat_order_monthly`;
CREATE TABLE `dws_client_repeat_order_monthly`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `client_id` bigint NOT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '客户名',
  `repeat_count_180d` int NOT NULL COMMENT '近180天返单次数',
  `repeat_count_365d` int NOT NULL COMMENT '近365天返单次数',
  `data_date` bigint NOT NULL COMMENT '数据日期',
  `data_date_str` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '数据日期字符串(yyyy-MM)',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_dws_crom_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1435 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = 'dws_客户返单汇总表_月' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_client
-- ----------------------------
DROP TABLE IF EXISTS `ods_client`;
CREATE TABLE `ods_client`  (
  `id` bigint NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户编号',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户名',
  `perfect_status` int NULL DEFAULT 1 COMMENT '0未完善，1已完善状态)',
  `label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '客户标签/类型',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `status` int NULL DEFAULT 1 COMMENT '0未下单，1活跃，2非活跃',
  `proceeds_mode` int NULL DEFAULT 0 COMMENT '结账方式（0未定义，1全款，2月结，3预收，4免费）',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户id/业务员id',
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '用户真实姓名/业务员姓名',
  `share_status` int NULL DEFAULT 0 COMMENT '是否共享（0不共享，1共享）',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `secret` int NULL DEFAULT 0 COMMENT '是否保密（0否，1是）',
  `code_type` int NULL DEFAULT 0 COMMENT '编号类型（0系统规则，1自定义）',
  `brand_name_array` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '商标名集合',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_client_companyid_userid`(`company_id` ASC, `delete_status` ASC, `user_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '客户信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ods_finish_product
-- ----------------------------
DROP TABLE IF EXISTS `ods_finish_product`;
CREATE TABLE `ods_finish_product`  (
  `id` bigint NOT NULL,
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '编号',
  `reference_type` int NULL DEFAULT 0 COMMENT '备案类型（0未定义，1国内销售，2仅出口）',
  `form_type` int NULL DEFAULT 0 COMMENT '形态（0未定义，1单一，2组合）',
  `cancel_status` int NULL DEFAULT 0 COMMENT '注销状态（0未备案，1已备案，2已注销）',
  `cancel_cause` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '注销原因',
  `name_type` int NULL DEFAULT NULL COMMENT '名字类型（0标准，1非标准）',
  `full_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '完整产品名',
  `brand_id` bigint NULL DEFAULT NULL COMMENT '商标id',
  `brand_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '商标名（冗余）',
  `brand_explain` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '商标解释',
  `general_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '通用名',
  `general_explain` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '通用名解释',
  `property_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '属性名',
  `property_explain` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '属性名解释',
  `suffix_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '后缀名',
  `suffix_explain` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '后缀名解释',
  `total_name_explain` varchar(3000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '总体命名依据',
  `method` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '使用方法',
  `matters` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '注意事项',
  `caution` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '安全警示用语',
  `storage` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '储存条件',
  `validity` int NULL DEFAULT NULL COMMENT '保质期',
  `perfect_status` int NULL DEFAULT 0 COMMENT '信息状态（0未完善，1已完善）',
  `remark` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '备注（可空）',
  `unit` bigint NULL DEFAULT NULL COMMENT '单位（字典id）',
  `unit_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '单位名',
  `report_status` int NULL DEFAULT 0 COMMENT '报告状态（0未完善，1已完善）',
  `check_report_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '检验报告编号',
  `check_report_pdf` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '检验报告pdf',
  `check_report_begin_date` bigint NULL DEFAULT 0 COMMENT '检验报告开始时间',
  `check_report_end_date` bigint NULL DEFAULT 0 COMMENT '检验报告结束时间',
  `human_check_report_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '人体检验报告编号',
  `human_check_report_pdf` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '人体检验报告pdf',
  `human_check_report_begin_date` bigint NULL DEFAULT 0 COMMENT '人体检验报告开始时间',
  `human_check_report_end_date` bigint NULL DEFAULT 0 COMMENT '人体检验报告结束时间',
  `edit_date` bigint NULL DEFAULT NULL COMMENT '编辑时间',
  `edit_user_id` bigint NULL DEFAULT NULL COMMENT '编辑人id',
  `edit_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '编辑人姓名',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `code_type` int NULL DEFAULT 0 COMMENT '编号类型（0系统规则，1自定义）',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `standard_name_list` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '标准名集合',
  `standard_code_list` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '标准号集合',
  `introducer` int NULL DEFAULT 0 COMMENT '批号及限用日期引导语（0未定义 默认，1引导语直接与喷码内容喷出，2引导语额外印刷或喷出，3仅出口 无引导语）',
  `finish_product_type` int NULL DEFAULT 0 COMMENT '成品类型（0未定义，1国内销售，2含新原料，3仅出口）',
  `process_status` int NULL DEFAULT 0 COMMENT '工序状态（0未完善，1已完善，2部分完善）',
  `price_status` int NULL DEFAULT 0 COMMENT '工序单价状态（0未完善，1已完善，2部分完善）',
  `product_type` int NULL DEFAULT 0 COMMENT '产品类型（0正常，1其他）',
  `specification_array` varchar(1200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '产品规格名称集合',
  `create_user_id` bigint NULL DEFAULT 0 COMMENT '创建人id',
  `create_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '创建人名字',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_fp_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '成品信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ods_finish_product_specification
-- ----------------------------
DROP TABLE IF EXISTS `ods_finish_product_specification`;
CREATE TABLE `ods_finish_product_specification`  (
  `id` bigint NOT NULL,
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规格',
  `require` varchar(2000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '产品要求（可空）',
  `cancel_status` int NULL DEFAULT 0 COMMENT '注销状态（0未注销，1已注销）',
  `perfect_status` int NULL DEFAULT 0 COMMENT '信息状态（0未完善，1已完善）',
  `form_type` int NULL DEFAULT 0 COMMENT '形态（0未定义，1单一，2组合）',
  `budgeting_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '生产人工成本预算（真实可空）',
  `finish_product_id` bigint NULL DEFAULT NULL COMMENT '成品id',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `process_status` int NULL DEFAULT 0 COMMENT '工序状态（0未完善，1已完善）',
  `price_status` int NULL DEFAULT 0 COMMENT '工序单价状态（0未完善，1已完善）',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_fps_finishproductid`(`company_id` ASC, `delete_status` ASC, `finish_product_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '规格成品信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ods_order
-- ----------------------------
DROP TABLE IF EXISTS `ods_order`;
CREATE TABLE `ods_order`  (
  `id` bigint NOT NULL,
  `code` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '订单号',
  `type` int NULL DEFAULT NULL COMMENT '产品类型（0配方产品，1中间品，2成品，3非化妆品，4原料，5包材，6辅料）',
  `client_id` bigint NULL DEFAULT NULL COMMENT '客户id',
  `client_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户名',
  `discount_status` int NULL DEFAULT 0 COMMENT '是否折扣（0否，1是）',
  `discount` int NULL DEFAULT 100 COMMENT '折扣比例（0-100）默认100',
  `search_tab` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '搜索标签',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `plan_status` int NULL DEFAULT 0 COMMENT '计划状态（0未处理，1不需计划，2部分计划，3全部计划）',
  `phase_status` int NULL DEFAULT 0 COMMENT '状态（0未发货，1部分发货，2全部发货，3强制完成）',
  `one_follow_user_id` bigint NULL DEFAULT 0 COMMENT '（1）跟单员id/用户id',
  `one_follow_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '（1）跟单员姓名/用户真实姓名',
  `business_user_id` bigint NULL DEFAULT NULL COMMENT '业务员id/用户id',
  `business_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '业务员姓名/用户真实姓名（冗余）',
  `able_status` int NULL DEFAULT 0 COMMENT '可生产状态（0未审核，1已审核，2已预收）',
  `finance_status` int NULL DEFAULT 0 COMMENT '处理费用状态（0不处理，1处理）',
  `proceeds_mode` int NULL DEFAULT 0 COMMENT '结账方式（0未定义，1全款，2月结，3预收，4免费）',
  `proceeds_mode_remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '结账方式备注',
  `tax_affirm_status` int NULL DEFAULT 0 COMMENT '税额对账状态（0不需对账，1未对账，2已对账）',
  `total_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '总报价',
  `tax_rate` decimal(10, 3) NULL DEFAULT NULL COMMENT '税率',
  `tax_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '税额',
  `tax_price_total_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '税价合计',
  `discount_total_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '折后报价合计（产品折后价 + 其他费用 + 追加费用）',
  `received_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '已收金额',
  `received_status` int NULL DEFAULT 0 COMMENT '货款状态（0未收，1部分收，2已收齐）',
  `pdf_document_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT 'pdf文档路径',
  `pdf_document_create_date` bigint NULL DEFAULT 0 COMMENT 'pdf文档创建时间',
  `decide_date` bigint NULL DEFAULT 0 COMMENT '审定时间',
  `fallcause` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '重做/作废原因',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间/下单日期',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `document_name` varchar(105) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '文档名',
  `secret` int NULL DEFAULT 0 COMMENT '是否保密（0否，1是）',
  `client_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '客户编号',
  `two_follow_user_id` bigint NULL DEFAULT 0 COMMENT '（2）跟单员id/用户id',
  `two_follow_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '（2）跟单员姓名/用户真实姓名',
  `three_follow_user_id` bigint NULL DEFAULT 0 COMMENT '（3）跟单员id/用户id',
  `three_follow_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '（3）跟单员姓名/用户真实姓名',
  `four_follow_user_id` bigint NULL DEFAULT 0 COMMENT '（4）跟单员id/用户id',
  `four_follow_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '（4）跟单员姓名/用户真实姓名',
  `five_follow_user_id` bigint NULL DEFAULT 0 COMMENT '（5）跟单员id/用户id',
  `five_follow_user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '（5）跟单员姓名/用户真实姓名',
  `pdf_order_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '订单pdf路径',
  `approval_status` int NULL DEFAULT 0 COMMENT '审批状态（0未签名，1未审批，2已审批，3失效，4作废）',
  `company_approval_task_template_id` bigint NULL DEFAULT 0 COMMENT '公司审批任务模板id',
  `code_type` int NULL DEFAULT NULL COMMENT '编号类型（0系统规则，1自定义）',
  `init_id` bigint NULL DEFAULT 0 COMMENT '初始Id',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `product_order_type` int NULL DEFAULT 0 COMMENT '产品订单类型（0正常，1其他）',
  `export_type` int NULL DEFAULT -1 COMMENT '被用于出口类型（-1未定义，0非仅出口，1仅出口，2非仅出口+仅出口）',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '订单完成时间',
  `currency_id` bigint NULL DEFAULT NULL COMMENT '币别id',
  `currency_type` int NULL DEFAULT NULL COMMENT '数据来源（0系统，1自定义）',
  `currency_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '币别编号',
  `currency_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '币别名称',
  `currency_symbol` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '货币符号',
  `currency_exchange_rate_type` int NULL DEFAULT NULL COMMENT '汇率类型（0固定，1浮动）',
  `currency_exchange_rate` decimal(23, 10) NULL DEFAULT NULL COMMENT '汇率值（小数）',
  `currency_received_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '已收金额本位币',
  `currency_conversion_way` int NULL DEFAULT NULL COMMENT '折算方式（0原币*汇率=本位币，1原币/汇率=本位币）',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '订单发货时间（每一次发货审核完成都会同步）',
  `commission_scale_type` int NULL DEFAULT 0 COMMENT '订单提成类型(0未定义，1首单，2返单)',
  `commission_predict_amount` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '预计提成金额（元）',
  `commission_setting_id` bigint NULL DEFAULT 0 COMMENT '提成设置id',
  `commission_status` int NULL DEFAULT 0 COMMENT '提成申请状态（0无需提成，1未提成，2部分提成，3已提成）',
  `accounting_status` int NULL DEFAULT 0 COMMENT '核算状态（0无需核算，1未核算，2已核算）',
  `received_date` bigint NULL DEFAULT 0 COMMENT '收款日期（取最新）',
  `commission_actual_amount` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '已提成金额(元)',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_order_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ods_order_assist
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_assist`;
CREATE TABLE `ods_order_assist`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `purchase_status` int NULL DEFAULT 0 COMMENT '采购状态（0未处理，1不需采购，2部分采购，3全部采购）',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `assist_id` bigint NULL DEFAULT NULL COMMENT '辅料id',
  `assist_code` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '辅料编号',
  `assist_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '辅料名',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `reality_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '实际单件成本',
  `supplier_max_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '供应商最高报价',
  `purchase_max_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '采购最高报价',
  `quantity` int NULL DEFAULT NULL COMMENT '数量',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '出货日期',
  `out_quantity` int NULL DEFAULT 0 COMMENT '已发货数量',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_oa_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单辅料表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_order_different_product
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_different_product`;
CREATE TABLE `ods_order_different_product`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `production_status` int NULL DEFAULT 0 COMMENT '生产状态（0未处理，1不需生产，2部分生产，3全部生产）',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `product_offer_id` bigint NULL DEFAULT 0 COMMENT '产品报价id',
  `product_offer_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '产品报价编号',
  `product_offer_stage_id` bigint NULL DEFAULT 0 COMMENT '产品阶段报价id',
  `budget_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '预算单件成本',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `different_product_id` bigint NULL DEFAULT 0 COMMENT '非化妆品id',
  `different_product_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '编号',
  `different_product_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名',
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '规格',
  `quantity` decimal(40, 20) NULL DEFAULT NULL COMMENT '数量',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '出货日期',
  `out_quantity` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '已发货数量',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `print_format` int NULL DEFAULT NULL COMMENT '喷码格式（0不需喷码，1自定义，2系统格式）',
  `changeable_type` int NULL DEFAULT 0 COMMENT '计数规则（0数量计算，1重量计算）',
  `unit` bigint NULL DEFAULT NULL COMMENT '单位（字典id）',
  `unit_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '单位名',
  `client_id` bigint NULL DEFAULT NULL COMMENT '客户id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_odp_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单非化妆品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_order_finance_plus
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_finance_plus`;
CREATE TABLE `ods_order_finance_plus`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '费用名',
  `price` decimal(40, 20) NULL DEFAULT NULL COMMENT '报价',
  `affirm_status` int NULL DEFAULT 0 COMMENT '对账状态（0不需对账，1未对账，2已对账）',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_ofp_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单追加费用表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_order_half_product
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_half_product`;
CREATE TABLE `ods_order_half_product`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `production_status` int NULL DEFAULT 0 COMMENT '生产状态（0未处理，1不需生产，2部分生产，3全部生产）',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `product_offer_id` bigint NULL DEFAULT 0 COMMENT '产品报价id',
  `product_offer_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '产品报价编号',
  `product_offer_stage_id` bigint NULL DEFAULT 0 COMMENT '产品阶段报价id',
  `budget_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '预算单件成本',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `half_product_id` bigint NULL DEFAULT 0 COMMENT '中间品id',
  `form_type` int NULL DEFAULT 0 COMMENT '形态（0未定义，1单一，2组合）',
  `half_product_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '编号',
  `half_product_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名',
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '规格',
  `quantity` int NULL DEFAULT NULL COMMENT '数量',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '出货日期',
  `out_quantity` int NULL DEFAULT 0 COMMENT '已发货数量',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `client_id` bigint NULL DEFAULT NULL COMMENT '客户id',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `introducer` int NULL DEFAULT 0 COMMENT '批号及限用日期引导语（0未定义 默认，1引导语直接与喷码内容喷出，2引导语额外印刷或喷出，3仅出口 无引导语）',
  `half_product_type` int NULL DEFAULT NULL COMMENT '中间品类型（0未定义，1国内销售，2含新原料，3仅出口）',
  `half_product_format` int NULL DEFAULT NULL COMMENT '中间品喷码设置（0需喷码，1不需额外定义，同成品喷码，2不需喷码）',
  `commission_amount` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '提成金额',
  `discount` int NULL DEFAULT 100 COMMENT '折扣比例%',
  `reference_price` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '参考单价',
  `half_product_version_id` bigint NULL DEFAULT NULL COMMENT '中间品版本id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_ohp_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单中间品表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_order_pack
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_pack`;
CREATE TABLE `ods_order_pack`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `purchase_status` int NULL DEFAULT 0 COMMENT '采购状态（0未处理，1不需采购，2部分采购，3全部采购）',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `pack_id` bigint NULL DEFAULT NULL COMMENT '包材id',
  `pack_code` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '包材编号',
  `pack_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '包材名',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `reality_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '实际单件成本',
  `supplier_max_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '供应商最高报价',
  `purchase_max_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '采购最高报价',
  `quantity` decimal(40, 20) NULL DEFAULT NULL COMMENT '数量',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '出货日期',
  `out_quantity` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '已发货数量',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `pack_type` int NULL DEFAULT NULL COMMENT '包材类型（0内包材，1外包材）',
  `pack_version_id` bigint NULL DEFAULT 0 COMMENT '包材版本id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_op_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单包材表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_order_plantraw
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_plantraw`;
CREATE TABLE `ods_order_plantraw`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `purchase_status` int NULL DEFAULT 0 COMMENT '采购状态（0未处理，1不需采购，2部分采购，3全部采购）',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `plantraw_code` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '工厂原料编号',
  `plantraw_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '工厂原料名',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `reality_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '实际单件成本',
  `supplier_max_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '供应商最高报价',
  `purchase_max_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '采购最高报价',
  `weight` decimal(40, 20) NULL DEFAULT NULL COMMENT '重量',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '出货日期',
  `out_weight` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '已发货重量',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `plantraw_type` int NULL DEFAULT NULL COMMENT '原料类型：0非化妆品原料、1化妆品原料、2基料',
  `private` int NULL DEFAULT NULL COMMENT '是否保密（0否，1是）',
  `type` int NULL DEFAULT NULL COMMENT '化妆品原料/基料类型（0未定义，1国内原料/基料，2新原料/基料，3仅出口原料/基料）',
  `plantraw_id` bigint NULL DEFAULT NULL COMMENT '原料Id',
  `plantraw_version_id` bigint NULL DEFAULT NULL COMMENT '原料版本id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_op_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单原料表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for ods_order_product_specification
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_product_specification`;
CREATE TABLE `ods_order_product_specification`  (
  `id` bigint NOT NULL,
  `order_id` bigint NULL DEFAULT NULL COMMENT '订单id',
  `production_status` int NULL DEFAULT 0 COMMENT '生产状态（0未处理，1不需生产，2部分生产，3全部生产）',
  `dispose_status` int NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `product_offer_id` bigint NULL DEFAULT 0 COMMENT '产品报价id',
  `product_offer_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '产品报价编号',
  `product_offer_stage_id` bigint NULL DEFAULT 0 COMMENT '产品阶段报价id',
  `budget_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '预算单件成本',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `product_specification_id` bigint NULL DEFAULT 0 COMMENT '规格产品id',
  `form_type` int NULL DEFAULT 0 COMMENT '形态（0未定义，1单一，2组合）',
  `product_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '编号',
  `product_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '产品名',
  `specification` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '规格',
  `quantity` int NULL DEFAULT NULL COMMENT '数量',
  `delivery_date` bigint NULL DEFAULT 0 COMMENT '出货日期',
  `out_quantity` int NULL DEFAULT 0 COMMENT '已发货数量',
  `finish_date` bigint NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `client_id` bigint NULL DEFAULT NULL COMMENT '客户id',
  `create_date` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `company_id` bigint NULL DEFAULT NULL COMMENT '所属公司id',
  `delete_status` int NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NULL DEFAULT 0 COMMENT '删除时间',
  `introducer` int NULL DEFAULT 0 COMMENT '批号及限用日期引导语（0未定义 默认，1引导语直接与喷码内容喷出，2引导语额外印刷或喷出，3仅出口 无引导语）',
  `finish_product_type` int NULL DEFAULT NULL COMMENT '成品类型（0未定义，1国内销售，2含新原料，3仅出口）',
  `half_product_format` int NULL DEFAULT NULL COMMENT '中间品喷码设置（0需喷码，1不需额外定义，同成品喷码，2不需喷码）',
  `reference_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '' COMMENT '备案编号',
  `commission_amount` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '提成金额',
  `discount` int NULL DEFAULT 100 COMMENT '折扣比例%',
  `reference_price` decimal(40, 20) NULL DEFAULT 0.00000000000000000000 COMMENT '参考单价',
  `product_specification_version_id` bigint NULL DEFAULT NULL COMMENT '规格产品版本id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_ods_ops_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE,
  INDEX `ix_ods_ops_psi`(`product_specification_id` ASC) USING BTREE,
  INDEX `ix_ods_ops_oi`(`order_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单规格成品表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ods_order_recipe_product
-- ----------------------------
DROP TABLE IF EXISTS `ods_order_recipe_product`;
CREATE TABLE `ods_order_recipe_product`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_id` bigint NOT NULL COMMENT '订单id',
  `production_status` int NOT NULL DEFAULT 0 COMMENT '生产状态（0未处理，1不需生产，2部分生产，3全部生产）',
  `dispose_status` int NOT NULL DEFAULT 0 COMMENT '处理状态（0未处理完成，1已处理完成）',
  `product_offer_id` bigint NOT NULL DEFAULT 0 COMMENT '产品报价id',
  `product_offer_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '产品报价编号',
  `product_offer_stage_id` bigint NOT NULL DEFAULT 0 COMMENT '产品阶段报价id',
  `budget_cost_single` decimal(40, 20) NULL DEFAULT NULL COMMENT '预算单件成本',
  `offer_price` decimal(40, 20) NULL DEFAULT NULL COMMENT '单件报价',
  `recipe_code` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '配方号',
  `recipe_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '配方名',
  `standard_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '产品标准名（冗余）',
  `standard_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '产品标准号（冗余）',
  `weight` decimal(40, 20) NOT NULL COMMENT '重量',
  `delivery_date` bigint NOT NULL DEFAULT 0 COMMENT '出货日期',
  `out_weight` decimal(40, 20) NOT NULL DEFAULT 0.00000000000000000000 COMMENT '已发货数量',
  `finish_date` bigint NOT NULL DEFAULT 0 COMMENT '出货完成日期',
  `remark` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '' COMMENT '备注',
  `phase_status` int NOT NULL DEFAULT 0 COMMENT '进度状态（0未完成，1已完成/发货完成，2强制完成）',
  `create_date` bigint NOT NULL COMMENT '创建时间',
  `company_id` bigint NOT NULL COMMENT '所属公司id',
  `delete_status` int NOT NULL DEFAULT 0 COMMENT '删除状态（0未删除，1已删除）',
  `delete_date` bigint NOT NULL DEFAULT 0 COMMENT '删除时间',
  `recipe_product_type` int NOT NULL COMMENT '配方类型（0未定义，1国内销售，2含新原料，3仅出口）',
  `recipe_product_id` bigint NOT NULL COMMENT '配方产品id',
  `commission_amount` decimal(40, 20) NOT NULL DEFAULT 0.00000000000000000000 COMMENT '提成金额',
  `discount` int NOT NULL DEFAULT 100 COMMENT '折扣比例%',
  `reference_price` decimal(40, 20) NOT NULL DEFAULT 0.00000000000000000000 COMMENT '参考单价',
  `recipe_product_version_id` bigint NOT NULL COMMENT '配方产品版本id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_bus_sell_orp_companyid`(`company_id` ASC, `delete_status` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 703 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci COMMENT = '订单配方产品表' ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
