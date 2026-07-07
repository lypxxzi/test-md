-- 为竞拍商品表添加活动名称字段
ALTER TABLE auction_item ADD COLUMN activity_name VARCHAR(200) DEFAULT NULL COMMENT '活动名称';

-- 为现有数据添加默认活动名称（可选）
UPDATE auction_item SET activity_name = CONCAT('竞拍活动 ', DATE_FORMAT(auction_date, '%Y-%m-%d')) WHERE activity_name IS NULL;
