const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Notification = require('../models/notification'); // 引入通知模型

// 获取特定帖子的详细信息
router.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        const post = await Post.findById(postId)
            .populate('author', 'username')
            .populate('comments.author', 'username');
        if (!post) {
            return res.json({ success: false, message: '帖子不存在' });
        }
        res.json({ success: true, post });
    } catch (error) {
        console.error('获取帖子错误:', error);
        res.json({ success: false, message: '获取帖子失败' });
    }
});

// 添加评论
router.post('/posts/:postId/comments', async (req, res) => {
    const postId = req.params.postId;
    const { content, authorId } = req.body;

    if (!content || !authorId) {
        return res.json({ success: false, message: '缺少必要的信息' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.json({ success: false, message: '帖子不存在' });
        }
        const user = await User.findById(authorId);
        if (!user) {
            return res.json({ success: false, message: '用户不存在' });
        }
        post.comments.push({ content, author: authorId });
        await post.save();

        // 更新用户的评论计数
        user.commentCount += 1; // 增加评论计数
        await user.save(); // 保存用户

        // 创建通知
        const notification = new Notification({
            recipient: post.author,
            message: `${user.username} 评论了你的帖子: ${post.title}`,
            postId: postId
        });
        await notification.save();

        res.json({ success: true, post });
    } catch (error) {
        console.error('添加评论错误:', error);
        res.json({ success: false, message: '添加评论失败' });
    }
});

module.exports = router;