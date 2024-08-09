// 用户模型
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    lastActive: { type: Date, default: Date.now },
    postCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    followedCircles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Circle' }]
});

module.exports = mongoose.model('User', userSchema);