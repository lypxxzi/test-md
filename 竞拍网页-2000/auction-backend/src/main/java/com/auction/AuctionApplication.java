package com.auction;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.auction.mapper")
@EnableScheduling
public class AuctionApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuctionApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("竞拍系统后端服务启动成功！");
        System.out.println("接口文档地址: http://localhost:8080/doc.html");
        System.out.println("========================================\n");
    }
}
