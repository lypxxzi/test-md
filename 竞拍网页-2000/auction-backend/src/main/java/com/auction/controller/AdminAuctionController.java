package com.auction.controller;

import com.auction.common.Result;
import com.auction.entity.AuctionItem;
import com.auction.service.AuctionItemService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "管理后台-竞拍商品管理")
@RestController
@RequestMapping("/api/admin/auction")
@RequiredArgsConstructor
public class AdminAuctionController {
    
    private final AuctionItemService auctionItemService;
    
    @Operation(summary = "获取竞拍商品列表")
    @GetMapping("/list")
    public Result<Page<AuctionItem>> getItemList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) Integer status) {
        Page<AuctionItem> page = auctionItemService.getItemList(pageNum, pageSize, status);
        return Result.success(page);
    }
    
    @Operation(summary = "添加竞拍商品")
    @PostMapping("/add")
    public Result<Void> addItem(@RequestBody AuctionItem item) {
        auctionItemService.addItem(item);
        return Result.success();
    }
    
    @Operation(summary = "更新竞拍商品")
    @PutMapping("/update")
    public Result<Void> updateItem(@RequestBody AuctionItem item) {
        auctionItemService.updateItem(item);
        return Result.success();
    }
    
    @Operation(summary = "删除竞拍商品")
    @DeleteMapping("/delete/{id}")
    public Result<Void> deleteItem(@PathVariable Long id) {
        auctionItemService.deleteItem(id);
        return Result.success();
    }
    
    @Operation(summary = "更新竞拍状态")
    @PutMapping("/status/{id}")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        auctionItemService.updateStatus(id, status);
        return Result.success();
    }
}
