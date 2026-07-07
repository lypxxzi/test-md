package com.auction.service;

import com.auction.entity.AuctionItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface AuctionItemService {
    
    Page<AuctionItem> getItemList(Integer pageNum, Integer pageSize, Integer status);
    
    void addItem(AuctionItem item);
    
    void updateItem(AuctionItem item);
    
    void deleteItem(Long id);
    
    /**
     * 更新竞拍状态
     * @param id 竞拍商品ID
     * @param status 状态：0-待开始，1-进行中，2-已结束
     */
    void updateStatus(Long id, Integer status);
}
