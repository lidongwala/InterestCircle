const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    title: { type: String, required: true }, 
    content: { type: String, required: true }, 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    circle: { type: mongoose.Schema.Types.ObjectId, ref: 'Circle', index: true },
    comments: [commentSchema], 
    createdAt: { type: Date, default: Date.now },
    image: { data: Buffer, contentType: String }
});

module.exports = mongoose.model('Post', postSchema);