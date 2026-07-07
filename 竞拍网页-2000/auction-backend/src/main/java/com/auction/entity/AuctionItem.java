package com.auction.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("auction_item")
public class AuctionItem implements Serializable {
    
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;
    
    @TableField("auction_date")
    private LocalDate auctionDate;
    
    @TableField("start_price")
    private Integer startPrice;
    
    @TableField("current_price")
    private Integer currentPrice;
    
    @TableField("price_increment")
    private Integer priceIncrement;
    
    @TableField("start_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;
    
    @TableField("end_time")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;
    
    @TableField("status")
    private Integer status;
    
    @TableField("winning_user_id")
    private Long winningUserId;
    
    @TableField("activity_name")
    private String activityName;
    
    @TableField("create_time")
    private LocalDateTime createTime;
    
    @TableField("update_time")
    private LocalDateTime updateTime;
}
