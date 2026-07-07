package com.auction.service.impl;

import cn.hutool.crypto.digest.BCrypt;
import com.auction.dto.AdminLoginRequest;
import com.auction.entity.Admin;
import com.auction.mapper.AdminMapper;
import com.auction.service.AdminService;
import com.auction.utils.JwtUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    
    private final AdminMapper adminMapper;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, Object> redisTemplate;
    
    @Override
    public String login(AdminLoginRequest request) {
        LambdaQueryWrapper<Admin> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Admin::getUsername, request.getUsername());
        Admin admin = adminMapper.selectOne(wrapper);
        
        if (admin == null) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        if (admin.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }
        
        // 支持明文密码和BCrypt加密密码
        boolean passwordMatch = false;
        if (admin.getPassword().startsWith("$2a$") || admin.getPassword().startsWith("$2b$")) {
            // BCrypt加密密码
            passwordMatch = BCrypt.checkpw(request.getPassword(), admin.getPassword());
        } else {
            // 明文密码（开发环境）
            passwordMatch = admin.getPassword().equals(request.getPassword());
        }
        
        if (!passwordMatch) {
            throw new RuntimeException("用户名或密码错误");
        }
        
        String token = jwtUtil.generateToken(admin.getId(), admin.getUsername());
        
        redisTemplate.opsForValue().set("token:" + admin.getId(), token, 24, TimeUnit.HOURS);
        
        return token;
    }
    
    @Override
    public void logout(String token) {
        Long userId = jwtUtil.getUserIdFromToken(token);
        redisTemplate.delete("token:" + userId);
    }
}
