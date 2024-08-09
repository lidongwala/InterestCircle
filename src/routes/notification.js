const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// 获取用户的未读通知
router.get('/users/:userId/notifications', async (req, res) => {
    const userId = req.params.userId;
    try {
        const notifications = await Notification.find({ recipient: userId, read: false });
        res.json({ success: true, notifications });
    } catch (error) {
        console.error('获取通知错误:', error);
        res.json({ success: false, message: '获取通知失败' });
    }
});

// 标记通知为已读
router.post('/notifications/:notificationId/read', async (req, res) => {
    const notificationId = req.params.notificationId;
    try {
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        res.json({ success: true });
    } catch (error) {
        console.error('标记通知为已读错误:', error);
        res.json({ success: false, message: '标记通知为已读失败' });
    }
});

module.exports = router;

module.exports = router;