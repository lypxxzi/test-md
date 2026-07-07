package com.auction.service.impl;

import cn.hutool.core.util.StrUtil;
import com.auction.entity.AuctionItem;
import com.auction.entity.BidRecord;
import com.auction.entity.User;
import com.auction.mapper.AuctionItemMapper;
import com.auction.mapper.BidRecordMapper;
import com.auction.mapper.UserMapper;
import com.auction.service.BidRecordService;
import com.auction.vo.BidRecordVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BidRecordServiceImpl implements BidRecordService {
    
    private final BidRecordMapper bidRecordMapper;
    private final UserMapper userMapper;
    private final AuctionItemMapper auctionItemMapper;
    
    @Override
    public Page<BidRecordVO> getBidRecordList(Integer pageNum, Integer pageSize, 
                                               LocalDate startDate, LocalDate endDate, 
                                               Long userId, String businessArea,
                                               Long auctionItemId) {
        Page<BidRecord> page = new Page<>(pageNum, pageSize);
        LambdaQueryWrapper<BidRecord> wrapper = new LambdaQueryWrapper<>();
        
        if (auctionItemId != null) {
            wrapper.eq(BidRecord::getAuctionItemId, auctionItemId);
        }
        
        if (userId != null) {
            wrapper.eq(BidRecord::getUserId, userId);
        }
        
        if (startDate != null || endDate != null || StrUtil.isNotBlank(businessArea)) {
            List<Long> auctionItemIds = getFilteredAuctionItemIds(startDate, endDate);
            if (auctionItemIds != null && !auctionItemIds.isEmpty()) {
                wrapper.in(BidRecord::getAuctionItemId, auctionItemIds);
            }
        }
        
        if (StrUtil.isNotBlank(businessArea)) {
            LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
            userWrapper.like(User::getBusinessArea, businessArea);
            List<Long> userIds = userMapper.selectList(userWrapper).stream()
                    .map(User::getId).collect(Collectors.toList());
            if (!userIds.isEmpty()) {
                wrapper.in(BidRecord::getUserId, userIds);
            }
        }
        
        wrapper.orderByDesc(BidRecord::getBidTime);
        Page<BidRecord> recordPage = bidRecordMapper.selectPage(page, wrapper);
        
        Page<BidRecordVO> voPage = new Page<>(pageNum, pageSize, recordPage.getTotal());
        List<BidRecordVO> voList = recordPage.getRecords().stream()
                .map(this::convertToVO)
                .collect(Collectors.toList());
        voPage.setRecords(voList);
        
        return voPage;
    }
    
    @Override
    public Object getStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        Long totalBids = bidRecordMapper.selectCount(null);
        statistics.put("totalBids", totalBids);
        
        LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
        Long totalUsers = userMapper.selectCount(userWrapper);
        statistics.put("totalUsers", totalUsers);
        
        List<BidRecord> winningRecords = bidRecordMapper.selectList(
                new LambdaQueryWrapper<BidRecord>().eq(BidRecord::getIsWinning, 1)
        );
        
        Map<String, Long> businessAreaStats = winningRecords.stream()
                .map(record -> {
                    User user = userMapper.selectById(record.getUserId());
                    return user != null ? user.getBusinessArea() : "未知";
                })
                .collect(Collectors.groupingBy(area -> area, Collectors.counting()));
        
        statistics.put("businessAreaStats", businessAreaStats);
        
        return statistics;
    }
    
    private List<Long> getFilteredAuctionItemIds(LocalDate startDate, LocalDate endDate) {
        LambdaQueryWrapper<AuctionItem> wrapper = new LambdaQueryWrapper<>();
        if (startDate != null) {
            wrapper.ge(AuctionItem::getAuctionDate, startDate);
        }
        if (endDate != null) {
            wrapper.le(AuctionItem::getAuctionDate, endDate);
        }
        return auctionItemMapper.selectList(wrapper).stream()
                .map(AuctionItem::getId)
                .collect(Collectors.toList());
    }
    
    private BidRecordVO convertToVO(BidRecord record) {
        BidRecordVO vo = new BidRecordVO();
        vo.setId(record.getId());
        vo.setAuctionItemId(record.getAuctionItemId());
        vo.setUserId(record.getUserId());
        vo.setBidPrice(record.getBidPrice());
        vo.setIsWinning(record.getIsWinning());
        vo.setBidTime(record.getBidTime());
        
        User user = userMapper.selectById(record.getUserId());
        if (user != null) {
            vo.setUserName(user.getName());
            vo.setAgentCode(user.getAgentCode());
            vo.setBusinessArea(user.getBusinessArea());
        }
        
        AuctionItem item = auctionItemMapper.selectById(record.getAuctionItemId());
        if (item != null) {
            vo.setAuctionDate(item.getAuctionDate());
        }
        
        return vo;
    }
}
