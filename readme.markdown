# Interest Circle 项目

## 项目简介
Interest Circle 是一个社交平台，用户可以创建和加入兴趣圈子，发布帖子和评论，并接收通知。

## 运行环境
- Node.js 18.x 或更高版本
- PM2 进程管理器

## 目录结构
```
interestcircle/
├── public/
│   ├── auth.js
│   ├── circle.js
│   ├── index.html
│   ├── main.js
│   ├── post.js
│   ├── script.js
│   ├── style.css
├── src/
│   ├── models/
│   │   ├── circle.js
│   │   ├── notification.js
│   │   ├── post.js
│   │   ├── user.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── circles.js
│   │   ├── notification.js
│   │   ├── posts.js
│   ├── database.js
│   ├── server.js
├── test/
│   ├── circle.test.js
│   ├── post.test.js
```

## 运行步骤

### 1. 克隆仓库
```bash
git clone https://github.com/lidongwala/interestcircle.git
cd interestcircle
```

### 2. 安装依赖
确保你已经安装了 [Node.js](https://nodejs.org/) 和 [MongoDB](https://www.mongodb.com/)，然后运行：
```bash
npm install
```

### 3. 使用 PM2 运行项目
项目中使用了 PM2 来管理和运行 Node.js 应用。PM2 是一个带有负载均衡功能的 Node.js 应用进程管理器。

#### 安装 PM2
如果你还没有安装 PM2，可以使用以下命令进行安装：
```bash
npm install pm2 -g
```

#### 启动应用
在项目根目录下运行以下命令启动应用：
```bash
pm2 start ecosystem.config.js --env production
```

#### 查看应用状态
使用以下命令查看应用的运行状态：
```bash
pm2 status
```

#### 停止应用
使用以下命令停止应用：
```bash
pm2 stop interestcircle
```

#### 重启应用
使用以下命令重启应用：
```bash
pm2 restart interestcircle
```

### 6. 访问应用
打开浏览器，访问 `http://localhost:3000`，你将看到 Interest Circle 的主页。

## 额外完成的功能说明和技术栈描述

### 功能说明
**通知系统**：用户可以接收和查看通知，例如有人评论了他们的帖子。

### 技术栈描述
- **前端**：使用 HTML、CSS 和 JavaScript 构建用户界面，React 用于构建动态组件。
- **后端**：使用 Node.js 和 Express 构建 RESTful API，处理用户请求和响应。
- **数据库**：使用 MongoDB 存储用户、帖子、评论和通知等数据。
- **中间件**：使用 `body-parser` 解析请求体，`cors` 处理跨域请求，`compression` 启用 Gzip 压缩，`helmet` 设置安全 HTTP 头。
- **文件上传**：使用 `multer` 处理文件上传。
- **测试**：使用 Jest 进行单元测试。
- **进程管理**：使用 PM2 管理和运行 Node.js 应用。
