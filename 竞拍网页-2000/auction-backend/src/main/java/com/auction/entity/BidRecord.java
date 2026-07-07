package com.auction.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("bid_record")
public class BidRecord implements Serializable {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("auction_item_id")
    private Long auctionItemId;
    
    @TableField("user_id")
    private Long userId;
    
    @TableField("bid_price")
    private Integer bidPrice;
    
    @TableField("is_winning")
    private Integer isWinning;
    
    @TableField("bid_time")
    private LocalDateTime bidTime;
}
