// 兴趣圈模型

const mongoose = require('mongoose');

const circleSchema = new mongoose.Schema({
    name: String,
    description: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Circle', circleSchema);