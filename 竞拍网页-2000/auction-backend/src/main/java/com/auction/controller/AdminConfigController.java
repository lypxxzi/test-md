package com.auction.controller;

import com.auction.common.Result;
import com.auction.entity.SystemConfig;
import com.auction.mapper.SystemConfigMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "管理后台-系统配置管理")
@RestController
@RequestMapping("/api/admin/config")
@RequiredArgsConstructor
public class AdminConfigController {
    
    private final SystemConfigMapper systemConfigMapper;
    
    @Operation(summary = "获取配置列表")
    @GetMapping("/list")
    public Result<List<SystemConfig>> getConfigList() {
        LambdaQueryWrapper<SystemConfig> wrapper = new LambdaQueryWrapper<>();
        wrapper.orderByAsc(SystemConfig::getId);
        List<SystemConfig> list = systemConfigMapper.selectList(wrapper);
        return Result.success(list);
    }
    
    @Operation(summary = "更新配置")
    @PutMapping("/update")
    public Result<Void> updateConfig(@RequestBody SystemConfig config) {
        systemConfigMapper.updateById(config);
        return Result.success();
    }
}
