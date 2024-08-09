// 处理认证相关的路由
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Notification = require('../models/notification'); // 引入通知模型

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: '用户名已存在' });
        }
        const newUser = new User({ username, password });
        await newUser.save();
        res.json({ success: true, message: '注册成功' });
    } catch (error) {
        res.json({ success: false, message: '注册失败' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            const notifications = await Notification.find({ recipient: user._id, read: false });
            console.log('Notifications:', notifications);
            res.json({ success: true, user, notifications }); // 返回用户对象和未读通知
        } else {
            res.json({ success: false, message: '用户名或密码错误' });
        }
    } catch (error) {
        res.json({ success: false, message: '登录失败' });
    }
});

module.exports = router;