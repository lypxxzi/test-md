package com.auction.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "竞拍请求")
public class BidRequest {
    
    @NotNull(message = "商品ID不能为空")
    @Schema(description = "竞拍商品ID")
    private Long auctionItemId;
    
    @NotBlank(message = "姓名不能为空")
    @Schema(description = "姓名")
    private String name;
    
    @NotBlank(message = "代理人代码不能为空")
    @Schema(description = "代理人代码")
    private String agentCode;
    
    @NotBlank(message = "营业区名称不能为空")
    @Schema(description = "营业区名称")
    private String businessArea;
    
    @NotNull(message = "目标价格不能为空")
    @Schema(description = "目标价格（必须大于当前价格且为100的整数倍）")
    private Integer targetPrice;
}
