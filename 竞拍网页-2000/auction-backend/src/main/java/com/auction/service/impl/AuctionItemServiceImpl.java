package com.auction.service.impl;

import com.auction.entity.AuctionItem;
import com.auction.entity.BidRecord;
import com.auction.mapper.AuctionItemMapper;
import com.auction.mapper.BidRecordMapper;
import com.auction.service.AuctionItemService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuctionItemServiceImpl implements AuctionItemService {
    
    private final AuctionItemMapper auctionItemMapper;
    private final BidRecordMapper bidRecordMapper;
    
    @Override
    public Page<AuctionItem> getItemList(Integer pageNum, Integer pageSize, Integer status) {
        Page<AuctionItem> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<AuctionItem> wrapper = new LambdaQueryWrapper<>();
        
        if (status != null) {
            wrapper.eq(AuctionItem::getStatus, status);
        }
        
        wrapper.orderByAsc(AuctionItem::getAuctionDate);
        return auctionItemMapper.selectPage(page, wrapper);
    }
    
    @Override
    public void addItem(AuctionItem item) {
        if (item.getStartPrice() == null) {
            item.setStartPrice(1000);
        }
        if (item.getCurrentPrice() == null) {
            item.setCurrentPrice(item.getStartPrice());
        }
        if (item.getPriceIncrement() == null) {
            item.setPriceIncrement(100);
        }
        if (item.getStatus() == null) {
            item.setStatus(0);
        }
        auctionItemMapper.insert(item);
    }
    
    @Override
    public void updateItem(AuctionItem item) {
        AuctionItem existingItem = auctionItemMapper.selectById(item.getId());
        if (existingItem == null) {
            throw new RuntimeException("竞拍商品不存在");
        }
        auctionItemMapper.updateById(item);
    }
    
    @Override
    public void deleteItem(Long id) {
        auctionItemMapper.deleteById(id);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void updateStatus(Long id, Integer status) {
        AuctionItem item = auctionItemMapper.selectById(id);
        if (item == null) {
            throw new RuntimeException("竞拍商品不存在");
        }
        
        // 如果是结算（状态改为2），则标记最高价为中标
        if (status == 2) {
            settleAuction(item);
        } else {
            item.setStatus(status);
            auctionItemMapper.updateById(item);
        }
    }
    
    /**
     * 结算竞拍，标记最高价中标
     */
    private void settleAuction(AuctionItem item) {
        // 查找该商品的最高出价记录
        LambdaQueryWrapper<BidRecord> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(BidRecord::getAuctionItemId, item.getId())
               .orderByDesc(BidRecord::getBidPrice)
               .orderByAsc(BidRecord::getBidTime)
               .last("LIMIT 1");
        BidRecord highestBid = bidRecordMapper.selectOne(wrapper);
        
        if (highestBid != null) {
            // 先将所有记录设为未中标
            LambdaUpdateWrapper<BidRecord> updateWrapper = new LambdaUpdateWrapper<>();
            updateWrapper.eq(BidRecord::getAuctionItemId, item.getId())
                        .set(BidRecord::getIsWinning, 0);
            bidRecordMapper.update(null, updateWrapper);
            
            // 标记最高价记录为中标
            highestBid.setIsWinning(1);
            bidRecordMapper.updateById(highestBid);
            
            // 更新商品状态为已结束
            item.setStatus(2);
            item.setWinningUserId(highestBid.getUserId());
            auctionItemMapper.updateById(item);
        } else {
            // 没有出价记录，直接标记为已结束
            item.setStatus(2);
            item.setWinningUserId(null);
            auctionItemMapper.updateById(item);
        }
    }
}
