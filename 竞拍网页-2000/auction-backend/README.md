# 竞拍系统后端

## 技术栈

- Java 17
- Spring Boot 3.2.1
- MyBatis Plus 3.5.5
- MySQL 8.0
- Redis
- JWT
- Knife4j (Swagger)

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.6+
- MySQL 8.0
- Redis

### 2. 数据库初始化

执行项目根目录下的数据库脚本：

```bash
mysql -h 115.190.209.228 -P 3306 -u root -p < ../database/init.sql
```

### 3. 配置文件

配置文件位于 `src/main/resources/application.yml`

数据库和Redis配置已配置好，无需修改。

### 4. 启动项目

```bash
# 使用Maven启动
mvn spring-boot:run

# 或者先打包再运行
mvn clean package
java -jar target/auction-backend-1.0.0.jar
```

### 5. 访问接口文档

启动成功后，访问：

- Swagger UI: http://localhost:8080/doc.html
- API文档: http://localhost:8080/v3/api-docs

## 项目结构

```
src/main/java/com/auction/
├── config/              # 配置类
│   ├── CorsConfig.java       # 跨域配置
│   ├── RedisConfig.java      # Redis配置
│   └── Knife4jConfig.java    # Swagger配置
├── controller/          # 控制器
│   ├── AuctionController.java   # 竞拍接口
│   └── AdminController.java     # 管理员接口
├── service/            # 服务层
│   ├── impl/                # 服务实现
│   ├── AuctionService.java
│   ├── AdminService.java
│   └── SystemConfigService.java
├── mapper/             # 数据访问层
├── entity/             # 实体类
├── dto/                # 数据传输对象
├── vo/                 # 视图对象
├── utils/              # 工具类
│   └── JwtUtil.java         # JWT工具
├── common/             # 公共类
│   └── Result.java          # 统一返回结果
├── exception/          # 异常处理
│   └── GlobalExceptionHandler.java
└── AuctionApplication.java  # 启动类
```

## API接口

### 用户竞拍接口

- `POST /api/auction/verify-password` - 验证访问密码
- `GET /api/auction/list` - 获取竞拍商品列表
- `POST /api/auction/bid` - 参与竞拍
- `GET /api/auction/detail/{id}` - 获取竞拍详情

### 管理员接口

- `POST /api/admin/login` - 管理员登录
- `POST /api/admin/logout` - 管理员登出

## 默认账号

**管理员账号**：
- 用户名: `admin`
- 密码: `admin123`

**用户访问密码**：`123456`

## 注意事项

1. **并发控制**：使用Redis分布式锁防止并发竞拍
2. **时间控制**：竞拍时间为每日09:30-18:00
3. **价格机制**：起拍价1000🍎，每次加价100🍎
4. **Token管理**：JWT Token存储在Redis，有效期24小时

## 开发说明

- 所有接口返回格式统一使用 `Result<T>` 包装
- 参数校验使用 Jakarta Validation
- 异常统一由 `GlobalExceptionHandler` 处理
- 日志使用 Lombok 的 `@Slf4j` 注解

## 待完成功能

- [ ] 管理后台商品管理接口
- [ ] 管理后台用户管理接口
- [ ] 管理后台竞拍记录查询接口
- [ ] WebSocket实时推送
- [ ] 数据统计分析接口

## License

私有项目
