const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const app = express();
const authRoutes = require('./routes/auth');
const circleRoutes = require('./routes/circles');
const postRoutes = require('./routes/posts'); 
const notificationsRouter = require('./routes/notification');

require('./database');

app.use(cors());
app.use(bodyParser.json());
app.use(compression()); // Enable Gzip compression

// 使用 helmet 设置 CSP 头
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"], // 允许加载 data: 和 https: 协议的图片
            scriptSrc: ["'self'", "'unsafe-inline'"], // 允许内联脚本
            scriptSrcAttr: ["'self'", "'unsafe-inline'"], // 允许内联事件处理程序
            styleSrc: ["'self'", "'unsafe-inline'"], // 允许内联样式
            connectSrc: ["'self'"],
            fontSrc: ["'self'", "https:", "data:"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
            // 添加其他需要的指令
        }
    }
}));

app.use('/api', authRoutes);
app.use('/api', circleRoutes);
app.use('/api', postRoutes);
app.use('/api', notificationsRouter);

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '..', 'public')));

// 根路径路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(3000, () => {
    console.log('服务器运行在端口 3000');
});