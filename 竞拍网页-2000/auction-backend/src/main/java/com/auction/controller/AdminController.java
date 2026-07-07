package com.auction.controller;

import com.auction.common.Result;
import com.auction.dto.AdminLoginRequest;
import com.auction.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Tag(name = "管理员接口")
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final AdminService adminService;
    
    @Operation(summary = "管理员登录")
    @PostMapping("/login")
    public Result<Map<String, String>> login(@Valid @RequestBody AdminLoginRequest request) {
        String token = adminService.login(request);
        Map<String, String> result = new HashMap<>();
        result.put("token", token);
        return Result.success(result);
    }
    
    @Operation(summary = "管理员登出")
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String authorization) {
        String token = authorization.replace("Bearer ", "");
        adminService.logout(token);
        return Result.success();
    }
}
