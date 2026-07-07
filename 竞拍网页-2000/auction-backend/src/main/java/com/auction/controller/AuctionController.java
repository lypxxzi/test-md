package com.auction.controller;

import com.auction.common.Result;
import com.auction.dto.BidRequest;
import com.auction.dto.PasswordVerifyRequest;
import com.auction.service.AuctionService;
import com.auction.service.SystemConfigService;
import com.auction.vo.AuctionItemVO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "用户竞拍接口")
@RestController
@RequestMapping("/api/auction")
@RequiredArgsConstructor
public class AuctionController {
    
    private final AuctionService auctionService;
    private final SystemConfigService systemConfigService;
    
    @Operation(summary = "验证访问密码")
    @PostMapping("/verify-password")
    public Result<Boolean> verifyPassword(@Valid @RequestBody PasswordVerifyRequest request) {
        boolean valid = systemConfigService.verifyPassword(request.getPassword());
        if (valid) {
            return Result.success(true);
        } else {
            return Result.error("密码错误");
        }
    }
    
    @Operation(summary = "获取竞拍商品列表")
    @GetMapping("/list")
    public Result<List<AuctionItemVO>> getAuctionList() {
        List<AuctionItemVO> list = auctionService.getAuctionList();
        return Result.success(list);
    }
    
    @Operation(summary = "参与竞拍")
    @PostMapping("/bid")
    public Result<Void> placeBid(@Valid @RequestBody BidRequest request) {
        auctionService.placeBid(request);
        return Result.success();
    }
    
    @Operation(summary = "获取竞拍详情")
    @GetMapping("/detail/{id}")
    public Result<AuctionItemVO> getAuctionDetail(@PathVariable Long id) {
        AuctionItemVO detail = auctionService.getAuctionDetail(id);
        return Result.success(detail);
    }
}
