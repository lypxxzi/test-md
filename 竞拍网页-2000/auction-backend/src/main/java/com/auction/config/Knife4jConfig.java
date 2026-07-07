package com.auction.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Knife4jConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("竞拍系统API文档")
                        .version("1.0.0")
                        .description("竞拍系统后端接口文档")
                        .contact(new Contact()
                                .name("竞拍系统开发团队")
                                .email("dev@auction.com")));
    }
}
