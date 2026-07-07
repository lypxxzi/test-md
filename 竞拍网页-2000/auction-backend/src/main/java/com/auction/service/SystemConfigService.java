package com.auction.service;

public interface SystemConfigService {
    
    String getConfigValue(String key);
    
    boolean verifyPassword(String password);
}
