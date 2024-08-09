// 处理兴趣圈相关的路由
const express = require('express');
const router = express.Router();
const Circle = require('../models/circle');
const Post = require('../models/post'); 
const User = require('../models/user');
const multer = require('multer');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });
const sharp = require('sharp');

// 创建兴趣圈
router.post('/circles', async (req, res) => {
    const { name, description } = req.body;
    if (name && description) {
        try {
            const newCircle = new Circle({ name, description });
            await newCircle.save();
            res.json({ success: true, circle: newCircle });
        } catch (error) {
            res.json({ success: false, message: '创建兴趣圈失败' });
        }
    } else {
        res.json({ success: false, message: '缺少必要的信息' });
    }
});

// 获取所有兴趣圈
router.get('/circles', async (req, res) => {
    try {
        const circles = await Circle.find();
        res.json(circles);
    } catch (error) {
        res.json({ success: false, message: '获取兴趣圈失败' });
    }
});

// 获取特定兴趣圈的详细信息
router.get('/circles/:circleId', async (req, res) => {
    const circleId = req.params.circleId;
    const userId = req.query.userId; 

    try {
        const circle = await Circle.findById(circleId).populate('members');
        if (!circle) {
            return res.json({ success: false, message: '圈子不存在' });
        }

        const user = await User.findById(userId); // 获取用户信息
        const followedCircles = user ? user.followedCircles : []; // 获取用户关注的圈子

        res.json({
            success: true,
            circle,
            user: {
                followedCircles
            }
        });
    } catch (error) {
        console.error('获取圈子错误:', error);
        res.json({ success: false, message: '获取圈子失败' });
    }
});

// 获取特定兴趣圈的帖子
router.get('/circles/:circleId/posts', async (req, res) => {
    const circleId = req.params.circleId;
    try {
        const posts = await Post.find({ circle: circleId }).populate('author', 'username');
        res.json({ success: true, posts }); // 确保返回帖子
    } catch (error) {
        res.json({ success: false, message: '获取帖子失败' });
    }
});

// 在特定兴趣圈中发帖
router.post('/circles/:circleId/posts', upload.single('image'), async (req, res) => {
    const { title, content, authorId } = req.body;
    const imageFile = req.file;
    
    // 检查必需字段是否存在
    if (!title || !content || !authorId) {
        return res.json({ success: false, message: '缺少必要的信息' });
    }

    // 检查圈子是否存在
    const circle = await Circle.findById(req.params.circleId);
    if (!circle) {
        return res.json({ success: false, message: '圈子不存在' });
    }

    try {
        const newPost = new Post({
            title,
            content,
            author: authorId,
            circle: req.params.circleId,
            image: imageFile ? { data: imageFile.buffer, contentType: imageFile.mimetype } : null
        });
        await newPost.save();
        // 更新圈子的帖子数组
        circle.posts.push(newPost._id); // 将新帖子的 ID 添加到圈子的帖子数组中
        await circle.save(); // 保存圈子
        
        // 更新用户的发帖计数
        const user = await User.findById(authorId);
        user.postCount += 1; // 增加发帖计数
        await user.save(); // 保存用户

        // 返回新创建的帖子，包括作者信息
        const populatedPost = await Post.findById(newPost._id).populate('author', 'username');
        res.json({ success: true, post: populatedPost });
    } catch (error) {
        console.error('发帖错误:', error); // 添加调试信息
        res.json({ success: false, message: '发帖失败' });
    }
});

// 关注兴趣圈
router.post('/circles/:circleId/follow', async (req, res) => {
    const circleId = req.params.circleId;
    const userId = req.body.userId; // 从请求体中获取用户ID

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: '用户不存在' });
        }

        const circle = await Circle.findById(circleId); // 查找圈子
        if (!circle) {
            return res.status(404).json({ success: false, message: '圈子不存在' });
        }

        if (!user.followedCircles.includes(circleId)) {
            user.followedCircles.push(circleId);
            circle.members.push(userId); // 将用户添加到圈子的成员中
            await user.save();
            await circle.save(); // 保存圈子
            res.json({ success: true, message: '关注成功' });
        } else {
            res.json({ success: false, message: '已关注该圈子' });
        }
    } catch (error) {
        console.error('关注圈子错误:', error);
        console.log('请求体:', req.body); // 打印请求体
        return res.status(500).json({ success: false, message: '关注失败', error: error.message });
    }
});

// 获取兴趣圈成员活跃情况
router.get('/circles/:circleId/activeMembers', async (req, res) => {
    const circleId = req.params.circleId;
    try {
        const circle = await Circle.findById(circleId).populate('members');
        if (!circle) {
            return res.json({ success: false, message: '圈子不存在' });
        }

        const activeMembers = circle.members.sort((a, b) => {
            return (b.postCount + b.commentCount) - (a.postCount + a.commentCount);
        }).slice(0, 3); // 取前五名

        res.json({ success: true, activeMembers });
    } catch (error) {
        console.error('获取活跃成员错误:', error);
        res.json({ success: false, message: '获取活跃成员失败' });
    }
});

module.exports = router;


