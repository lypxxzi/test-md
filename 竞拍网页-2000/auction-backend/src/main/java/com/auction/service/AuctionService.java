package com.auction.service;

import com.auction.dto.BidRequest;
import com.auction.vo.AuctionItemVO;
import java.util.List;

public interface AuctionService {
    
    List<AuctionItemVO> getAuctionList();
    
    void placeBid(BidRequest request);
    
    AuctionItemVO getAuctionDetail(Long id);
}
