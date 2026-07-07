-- ============================================
-- 竞拍系统数据库初始化脚本
-- ============================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS auction_system DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE auction_system;

-- ============================================
-- 1. 竞拍商品表
-- ============================================
DROP TABLE IF EXISTS auction_item;
CREATE TABLE auction_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    auction_date DATE NOT NULL COMMENT '竞拍日期',
    start_price INT NOT NULL DEFAULT 1000 COMMENT '起拍价（单位：🍎）',
    current_price INT NOT NULL DEFAULT 1000 COMMENT '当前价格（单位：🍎）',
    price_increment INT NOT NULL DEFAULT 100 COMMENT '加价幅度',
    start_time DATETIME NOT NULL COMMENT '开始时间（完整年月日时分秒）',
    end_time DATETIME NOT NULL COMMENT '结束时间（完整年月日时分秒）',
    status TINYINT NOT NULL DEFAULT 0 COMMENT '状态：0-待开始，1-进行中，2-已结束',
    winning_user_id BIGINT DEFAULT NULL COMMENT '中标用户ID',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_auction_date (auction_date),
    INDEX idx_status (status),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='竞拍商品表';

-- ============================================
-- 2. 用户表
-- ============================================
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    agent_code VARCHAR(50) NOT NULL COMMENT '代理人代码',
    business_area VARCHAR(100) NOT NULL COMMENT '营业区名称',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_agent_code (agent_code),
    INDEX idx_business_area (business_area),
    INDEX idx_create_time (create_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 3. 竞拍记录表
-- ============================================
DROP TABLE IF EXISTS bid_record;
CREATE TABLE bid_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    auction_item_id BIGINT NOT NULL COMMENT '商品ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    bid_price INT NOT NULL COMMENT '竞拍价格（单位：🍎）',
    is_winning TINYINT NOT NULL DEFAULT 0 COMMENT '是否中标：0-否，1-是',
    bid_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '竞拍时间',
    INDEX idx_auction_item_id (auction_item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_bid_time (bid_time),
    CONSTRAINT fk_bid_auction_item FOREIGN KEY (auction_item_id) REFERENCES auction_item(id) ON DELETE CASCADE,
    CONSTRAINT fk_bid_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='竞拍记录表';

-- ============================================
-- 4. 管理员表
-- ============================================
DROP TABLE IF EXISTS admin;
CREATE TABLE admin (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
    nickname VARCHAR(50) DEFAULT NULL COMMENT '昵称',
    status TINYINT NOT NULL DEFAULT 1 COMMENT '状态：0-禁用，1-启用',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- ============================================
-- 5. 系统配置表
-- ============================================
DROP TABLE IF EXISTS system_config;
CREATE TABLE system_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    config_key VARCHAR(100) NOT NULL COMMENT '配置键',
    config_value VARCHAR(500) NOT NULL COMMENT '配置值',
    description VARCHAR(200) DEFAULT NULL COMMENT '描述',
    create_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_config_key (config_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入管理员账号（密码：admin123）
-- 注意：首次登录后会自动加密，或者使用BCrypt在线工具预加密
INSERT INTO admin (username, password, nickname, status) VALUES
('admin', 'admin123', '系统管理员', 1);

-- 插入系统配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('user_access_password', '123456', '用户前台访问密码'),
('default_start_price', '1000', '默认起拍价（单位：🍎）'),
('default_price_increment', '100', '默认加价幅度（单位：🍎）');

-- 插入初始竞拍商品（2026年1月26-30日）
INSERT INTO auction_item (auction_date, start_price, current_price, price_increment, start_time, end_time, status) VALUES
('2026-01-26', 1000, 1000, 100, '2026-01-26 09:30:00', '2026-01-26 18:00:00', 0),
('2026-01-27', 1000, 1000, 100, '2026-01-27 09:30:00', '2026-01-27 18:00:00', 0),
('2026-01-28', 1000, 1000, 100, '2026-01-28 09:30:00', '2026-01-28 18:00:00', 0),
('2026-01-29', 1000, 1000, 100, '2026-01-29 09:30:00', '2026-01-29 18:00:00', 0),
('2026-01-30', 1000, 1000, 100, '2026-01-30 09:30:00', '2026-01-30 18:00:00', 0);

-- ============================================
-- 完成
-- ============================================
SELECT '数据库初始化完成！' AS message;
