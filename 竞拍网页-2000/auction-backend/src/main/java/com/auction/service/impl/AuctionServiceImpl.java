package com.auction.service.impl;

import cn.hutool.core.bean.BeanUtil;
import com.auction.dto.BidRequest;
import com.auction.entity.AuctionItem;
import com.auction.entity.BidRecord;
import com.auction.entity.User;
import com.auction.mapper.AuctionItemMapper;
import com.auction.mapper.BidRecordMapper;
import com.auction.mapper.UserMapper;
import com.auction.service.AuctionService;
import com.auction.vo.AuctionItemVO;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionServiceImpl implements AuctionService {
    
    private final AuctionItemMapper auctionItemMapper;
    private final UserMapper userMapper;
    private final BidRecordMapper bidRecordMapper;
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public List<AuctionItemVO> getAuctionList() {
        LambdaQueryWrapper<AuctionItem> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(AuctionItem::getAuctionDate);
        List<AuctionItem> items = auctionItemMapper.selectList(wrapper);
        
        return items.stream().map(this::convertToVO).collect(Collectors.toList());
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void placeBid(BidRequest request) {
        Long itemId = request.getAuctionItemId();
        // 竞拍锁：防止并发出价
        String bidLockKey = "bid:lock:" + itemId;
        // 结算锁：与定时结算互斥，续时优先级最高
        String settleLockKey = "settle:lock:" + itemId;
        
        Boolean bidLock = redisTemplate.opsForValue().setIfAbsent(bidLockKey, "1", 10, TimeUnit.SECONDS);
        if (Boolean.FALSE.equals(bidLock)) {
            throw new RuntimeException("竞拍进行中，请稍后再试");
        }
        
        // 获取结算锁，阻止定时任务同时结算
        Boolean settleLock = redisTemplate.opsForValue().setIfAbsent(settleLockKey, "bid", 10, TimeUnit.SECONDS);
        if (Boolean.FALSE.equals(settleLock)) {
            redisTemplate.delete(bidLockKey);
            throw new RuntimeException("系统正在处理中，请稍后再试");
        }
        
        try {
            AuctionItem item = auctionItemMapper.selectById(itemId);
            if (item == null) {
                throw new RuntimeException("竞拍商品不存在");
            }
            
            // 校验状态
            if (item.getStatus() != 1) {
                throw new RuntimeException("该竞拍活动未开启");
            }
            
            // 校验是否已过期
            LocalDateTime now = LocalDateTime.now();
            if (now.isBefore(item.getStartTime())) {
                throw new RuntimeException("竞拍尚未开始");
            }
            if (now.isAfter(item.getEndTime())) {
                throw new RuntimeException("竞拍已结束");
            }
            
            // 验证目标价格
            int targetPrice = request.getTargetPrice();
            if (targetPrice <= item.getCurrentPrice()) {
                throw new RuntimeException("目标价格必须大于当前价格");
            }
            if (targetPrice % 100 != 0) {
                throw new RuntimeException("目标价格必须为100的整数倍");
            }
            
            LambdaQueryWrapper<User> userWrapper = new LambdaQueryWrapper<>();
            userWrapper.eq(User::getAgentCode, request.getAgentCode());
            User user = userMapper.selectOne(userWrapper);
            
            if (user == null) {
                user = new User();
                user.setName(request.getName());
                user.setAgentCode(request.getAgentCode());
                user.setBusinessArea(request.getBusinessArea());
                user.setStatus(1);
                userMapper.insert(user);
            } else {
                user.setName(request.getName());
                user.setBusinessArea(request.getBusinessArea());
                userMapper.updateById(user);
            }
            
            int newPrice = targetPrice;
            
            // 竞拍记录暂不标记中标，等竞拍结束后由最高价决定
            BidRecord record = new BidRecord();
            record.setAuctionItemId(item.getId());
            record.setUserId(user.getId());
            record.setBidPrice(newPrice);
            record.setIsWinning(0);
            record.setBidTime(LocalDateTime.now());
            bidRecordMapper.insert(record);
            
            // 更新当前价格和临时领先者
            item.setCurrentPrice(newPrice);
            item.setWinningUserId(user.getId());
            item.setStatus(1);
            
            // 出价成功后，检查是否在截止前1分钟内，自动续时2分钟
            LocalDateTime afterBidNow = LocalDateTime.now();
            long secondsToEnd = java.time.Duration.between(afterBidNow, item.getEndTime()).getSeconds();
            if (secondsToEnd >= 0 && secondsToEnd <= 60) {
                item.setEndTime(afterBidNow.plusMinutes(2));
            }
            
            auctionItemMapper.updateById(item);
            
            redisTemplate.opsForValue().set("price:" + item.getId(), newPrice, 1, TimeUnit.DAYS);
            
        } finally {
            redisTemplate.delete(settleLockKey);
            redisTemplate.delete(bidLockKey);
        }
    }
    
    @Override
    public AuctionItemVO getAuctionDetail(Long id) {
        AuctionItem item = auctionItemMapper.selectById(id);
        if (item == null) {
            throw new RuntimeException("竞拍商品不存在");
        }
        return convertToVO(item);
    }
    
    private AuctionItemVO convertToVO(AuctionItem item) {
        AuctionItemVO vo = new AuctionItemVO();
        BeanUtil.copyProperties(item, vo);
        
        if (item.getWinningUserId() != null) {
            User user = userMapper.selectById(item.getWinningUserId());
            if (user != null) {
                vo.setWinningBusinessArea(user.getBusinessArea());
            }
        }
        
        // 不是进行中，直接不能拍；是进行中，再看当前时间是否在 startTime ~ endTime 之间
        if (item.getStatus() != 1) {
            vo.setCanBid(false);
        } else {
            LocalDateTime now = LocalDateTime.now();
            vo.setCanBid(!now.isBefore(item.getStartTime()) && !now.isAfter(item.getEndTime()));
        }
        
        return vo;
    }
    
    /**
     * 结算竞拍，标记最高价中标
     */
    @Transactional(rollbackFor = Exception.class)
    public void settleAuction(AuctionItem item) {
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
    
    /**
     * 定时任务：每分钟自动开启和结算竞拍
     */
    @Scheduled(cron = "0 * * * * ?")
    public void autoManageAuctions() {
        LocalDateTime now = LocalDateTime.now();
        System.out.println("[定时任务] 执行时间: " + now);
        
        // === 自动开启：到了开始时间 + 还没过结束时间 + status=0 ===
        LambdaQueryWrapper<AuctionItem> openWrapper = new LambdaQueryWrapper<>();
        openWrapper.eq(AuctionItem::getStatus, 0)
                   .le(AuctionItem::getStartTime, now)
                   .gt(AuctionItem::getEndTime, now);
        List<AuctionItem> toOpen = auctionItemMapper.selectList(openWrapper);
        System.out.println("[定时任务] 待开启数量: " + toOpen.size());
        for (AuctionItem item : toOpen) {
            item.setStatus(1);
            auctionItemMapper.updateById(item);
            System.out.println("[定时任务] 已开启: " + item.getId() + ", 日期: " + item.getAuctionDate());
        }
        
        // === 自动关闭+结算：status=1 且已过结束时间 ===
        LambdaQueryWrapper<AuctionItem> closeWrapper = new LambdaQueryWrapper<>();
        closeWrapper.eq(AuctionItem::getStatus, 1)
                    .lt(AuctionItem::getEndTime, now);
        
        List<AuctionItem> endedItems = auctionItemMapper.selectList(closeWrapper);
        System.out.println("[定时任务] 待结算数量: " + endedItems.size());
        
        for (AuctionItem item : endedItems) {
            System.out.println("[定时任务] 尝试结算: id=" + item.getId() + ", endTime=" + item.getEndTime());
            String settleLockKey = "settle:lock:" + item.getId();
            Boolean settleLock = redisTemplate.opsForValue().setIfAbsent(settleLockKey, "settle", 10, TimeUnit.SECONDS);
            if (Boolean.FALSE.equals(settleLock)) {
                System.out.println("[定时任务] 获取锁失败，跳过: " + item.getId());
                continue;
            }
            try {
                // 二次查数据库，确认end_time确实过了（可能已被续时）
                AuctionItem freshItem = auctionItemMapper.selectById(item.getId());
                if (freshItem == null || freshItem.getStatus() != 1) {
                    System.out.println("[定时任务] 二次检查状态不对，跳过: " + item.getId() + ", status=" + (freshItem != null ? freshItem.getStatus() : "null"));
                    continue;
                }
                LocalDateTime nowCheck = LocalDateTime.now();
                if (!nowCheck.isAfter(freshItem.getEndTime())) {
                    System.out.println("[定时任务] 二次检查未过期，跳过: " + item.getId() + ", endTime=" + freshItem.getEndTime() + ", now=" + nowCheck);
                    continue;
                }
                System.out.println("[定时任务] 开始结算: " + item.getId());
                settleAuction(freshItem);
                System.out.println("[定时任务] 结算完成: " + item.getId());
            } catch (Exception e) {
                System.err.println("结算竞拍失败: " + item.getId() + ", 错误: " + e.getMessage());
            } finally {
                redisTemplate.delete(settleLockKey);
            }
        }
    }
}
