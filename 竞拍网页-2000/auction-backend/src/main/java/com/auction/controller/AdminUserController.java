package com.auction.controller;

import com.auction.common.Result;
import com.auction.entity.User;
import com.auction.service.UserService;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "管理后台-用户管理")
@RestController
@RequestMapping("/api/admin/user")
@RequiredArgsConstructor
public class AdminUserController {
    
    private final UserService userService;
    
    @Operation(summary = "获取用户列表")
    @GetMapping("/list")
    public Result<Page<User>> getUserList(
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Page<User> page = userService.getUserList(pageNum, pageSize, keyword);
        return Result.success(page);
    }
    
    @Operation(summary = "获取用户详情")
    @GetMapping("/detail/{id}")
    public Result<User> getUserDetail(@PathVariable Long id) {
        User user = userService.getUserDetail(id);
        return Result.success(user);
    }
    
    @Operation(summary = "更新用户状态")
    @PutMapping("/status")
    public Result<Void> updateUserStatus(@RequestParam Long id, @RequestParam Integer status) {
        userService.updateUserStatus(id, status);
        return Result.success();
    }
    
    @Operation(summary = "删除用户")
    @DeleteMapping("/delete/{id}")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }
}
