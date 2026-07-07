package com.auction.service.impl;

import com.auction.entity.SystemConfig;
import com.auction.mapper.SystemConfigMapper;
import com.auction.service.SystemConfigService;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SystemConfigServiceImpl implements SystemConfigService {
    
    private final SystemConfigMapper systemConfigMapper;
    
    @Override
    public String getConfigValue(String key) {
        LambdaQueryWrapper<SystemConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(SystemConfig::getConfigKey, key);
        SystemConfig config = systemConfigMapper.selectOne(wrapper);
        return config != null ? config.getConfigValue() : null;
    }
    
    @Override
    public boolean verifyPassword(String password) {
        String correctPassword = getConfigValue("user_access_password");
        return correctPassword != null && correctPassword.equals(password);
    }
}
