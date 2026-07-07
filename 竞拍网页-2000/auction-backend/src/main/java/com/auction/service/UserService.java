package com.auction.service;

import com.auction.entity.User;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

public interface UserService {
    
    Page<User> getUserList(Integer pageNum, Integer pageSize, String keyword);
    
    User getUserDetail(Long id);
    
    void updateUserStatus(Long id, Integer status);
    
    void deleteUser(Long id);
}
