# 竞拍系统用户前台

基于 Vue 3 + Vite + Element Plus 的竞拍系统用户界面。

## 技术栈

- Vue 3
- Vite
- Element Plus
- Axios
- Pinia
- Vue Router

## 功能特性

- ✅ 密码验证登录
- ✅ 竞拍商品列表展示
- ✅ 实时价格更新（5秒刷新）
- ✅ 竞拍倒计时（距离18:00）
- ✅ 竞拍弹窗填写信息
- ✅ 中标营业区显示
- ✅ 美观的UI设计

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

### 3. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── api/              # API接口
│   ├── request.js    # Axios封装
│   └── auction.js    # 竞拍接口
├── views/            # 页面
│   ├── Login.vue     # 登录页
│   └── Auction.vue   # 竞拍页
├── router/           # 路由
│   └── index.js
├── App.vue           # 根组件
└── main.js           # 入口文件
```

## 环境要求

- Node.js 16+
- npm 或 yarn

## 配置说明

后端API地址配置在 `vite.config.js` 中：

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',  // 后端地址
      changeOrigin: true
    }
  }
}
```

## 默认访问密码

`123456`

## License

私有项目
