package com.auction.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Schema(description = "竞拍记录视图对象")
public class BidRecordVO {
    
    @Schema(description = "记录ID")
    private Long id;
    
    @Schema(description = "商品ID")
    private Long auctionItemId;
    
    @Schema(description = "竞拍日期")
    private LocalDate auctionDate;
    
    @Schema(description = "用户ID")
    private Long userId;
    
    @Schema(description = "用户姓名")
    private String userName;
    
    @Schema(description = "代理人代码")
    private String agentCode;
    
    @Schema(description = "营业区名称")
    private String businessArea;
    
    @Schema(description = "竞拍价格")
    private Integer bidPrice;
    
    @Schema(description = "是否中标")
    private Integer isWinning;
    
    @Schema(description = "竞拍时间")
    private LocalDateTime bidTime;
}
