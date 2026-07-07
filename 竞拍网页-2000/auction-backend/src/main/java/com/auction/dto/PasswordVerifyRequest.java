package com.auction.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "密码验证请求")
public class PasswordVerifyRequest {
    
    @NotBlank(message = "密码不能为空")
    @Schema(description = "访问密码")
    private String password;
}
