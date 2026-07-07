package com.auction.service;

import com.auction.vo.BidRecordVO;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.time.LocalDate;

public interface BidRecordService {
    
    Page<BidRecordVO> getBidRecordList(Integer pageNum, Integer pageSize, 
                                       LocalDate startDate, LocalDate endDate, 
                                       Long userId, String businessArea,
                                       Long auctionItemId);
    
    Object getStatistics();
}
