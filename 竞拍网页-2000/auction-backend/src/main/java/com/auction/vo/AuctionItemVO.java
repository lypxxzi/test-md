package com.auction.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Schema(description = "竞拍商品视图对象")
public class AuctionItemVO {
    
    @Schema(description = "商品ID")
    private Long id;
    
    @Schema(description = "竞拍日期")
    private LocalDate auctionDate;
    
    @Schema(description = "起拍价")
    private Integer startPrice;
    
    @Schema(description = "当前价格")
    private Integer currentPrice;
    
    @Schema(description = "加价幅度")
    private Integer priceIncrement;
    
    @Schema(description = "开始时间")
    private LocalDateTime startTime;
    
    @Schema(description = "结束时间")
    private LocalDateTime endTime;
    
    @Schema(description = "状态：0-待开始，1-进行中，2-已结束")
    private Integer status;
    
    @Schema(description = "中标用户ID")
    private Long winningUserId;
    
    @Schema(description = "中标营业区名称")
    private String winningBusinessArea;
    
    @Schema(description = "是否可竞拍")
    private Boolean canBid;
}
