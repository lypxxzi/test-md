# 竞拍系统管理后台

基于 Vue 3 + Vite + Element Plus 的竞拍系统管理后台。

## 技术栈

- Vue 3
- Vite
- Element Plus
- Axios
- Pinia
- Vue Router
- ECharts

## 功能特性

- ✅ 管理员登录/登出
- ✅ 竞拍商品管理（增删改查）
- ✅ 用户管理（查看/禁用/启用/删除）
- ✅ 竞拍记录查询
- ✅ 系统配置管理
- ✅ 统计数据展示

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3001

### 3. 构建生产版本

```bash
npm run build
```

## 默认管理员账号

- 用户名：`admin`
- 密码：`admin123`

## 项目结构

```
src/
├── api/              # API接口
│   ├── request.js    # Axios封装
│   └── admin.js      # 管理接口
├── stores/           # 状态管理
│   └── auth.js       # 认证状态
├── views/            # 页面
│   ├── Login.vue     # 登录页
│   ├── Layout.vue    # 布局页
│   ├── AuctionManage.vue   # 商品管理
│   ├── UserManage.vue      # 用户管理
│   ├── BidRecord.vue       # 竞拍记录
│   └── SystemConfig.vue    # 系统配置
├── router/           # 路由
│   └── index.js
├── App.vue
└── main.js
```

## 配置说明

后端API地址配置在 `vite.config.js` 中：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## License

私有项目
