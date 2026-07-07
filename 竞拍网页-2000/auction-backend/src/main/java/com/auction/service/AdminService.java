package com.auction.service;

import com.auction.dto.AdminLoginRequest;

public interface AdminService {
    
    String login(AdminLoginRequest request);
    
    void logout(String token);
}
