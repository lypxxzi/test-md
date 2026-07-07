package com.auction.controller;

import com.auction.common.Result;
import com.auction.service.BidRecordService;
import com.auction.vo.BidRecordVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Tag(name = "管理后台-竞拍记录管理")
@RestController
@RequestMapping("/api/admin/bid")
@RequiredArgsConstructor
public class AdminBidRecordController {
    
    private final BidRecordService bidRecordService;
    
    @Operation(summary = "获取竞拍记录列表")
    @GetMapping("/list")
    public Result<Page<BidRecordVO>> getBidRecordList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String businessArea,
            @RequestParam(required = false) Long auctionItemId) {
        Page<BidRecordVO> page = bidRecordService.getBidRecordList(
                pageNum, pageSize, startDate, endDate, userId, businessArea, auctionItemId);
        return Result.success(page);
    }
    
    @Operation(summary = "获取统计数据")
    @GetMapping("/statistics")
    public Result<Object> getStatistics() {
        Object statistics = bidRecordService.getStatistics();
        return Result.success(statistics);
    }
}
