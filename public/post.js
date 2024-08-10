// 处理帖子相关的功能
let currentPostId; 

function createPost(circleId) {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const authorId = localStorage.getItem('userId');
    const imageFile = document.getElementById('postImage').files[0]; // 获取图片文件
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Author ID:', authorId);
    console.log('Image File:', imageFile);

    if (!title || !content || !authorId) {
        alert('请确保填写所有必需的信息（标题、内容和作者ID）。');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('authorId', authorId);
    if (imageFile) {
        formData.append('image', imageFile); // 添加图片文件
    }

    fetch(`http://localhost:3000/api/circles/${circleId}/posts`, {
        method: 'POST',
        body: formData // 使用 FormData 发送数据
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('发帖成功');
            showCircleDetails(circleId);
            document.getElementById('postTitle').value = '';
            document.getElementById('postContent').value = '';
            document.getElementById('postImage').value = ''; // 清空文件输入
        } else {
            alert('发帖失败: ' + data.message);
        }
    })
    .catch(error => {
        console.error('错误:', error);
        alert('发帖失败: ' + error.message);
    });
}

function viewPost(postId, circleId) {
    currentPostId = postId;
    fetch(`http://localhost:3000/api/posts/${postId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const postDetails = document.getElementById('postDetails');
            postDetails.innerHTML = ''; // 清空现有内容

            postDetails.innerHTML = `
                <button id="backToPostsButton" onclick="goBackToPosts()">返回帖子列表</button>
                <div class="post-detail-content">
                    ${data.post.image && data.post.image.data ? `
                        <img src="data:${data.post.image.contentType};base64,${arrayBufferToBase64(data.post.image.data.data)}" alt="Post Image" class="post-detail-image">
                    ` : ''}
                    <div class="post-detail-text">
                        <h3 id="postTitleDetail" class="post-title">${data.post.title}</h3>
                        <small id="postAuthorDetail" class="post-author">作者: ${data.post.author.username}</small>
                        <p id="postContentDetail" class="post-content">${data.post.content}</p>
                        <textarea id="commentContent" class="comment-input" placeholder="写下你的评论..."></textarea>
                        <button class="comment-button" onclick="addComment()">提交评论</button>
                    </div>
                </div>
                <h4>评论</h4>
                <div id="commentsList"></div>
            `;

            document.getElementById('postDetails').style.display = 'block';
            document.getElementById('circleDetails').style.display = 'none';
            loadComments(postId);
        } else {
            alert('获取帖子失败: ' + data.message);
        }
    })
    .catch(error => {
        console.error('错误:', error);
    });
}

function goBackToPosts() {
    document.getElementById('postDetails').style.display = 'none';
    document.getElementById('circleDetails').style.display = 'block';
}

function addComment() {
    const postId = currentPostId; // 确保 currentPostId 被正确设置
    const content = document.getElementById('commentContent').value;
    const authorId = localStorage.getItem('userId');
    let alertCalled = false; // 添加标志位

    console.log('Post ID:', postId);
    console.log('Content:', content);
    console.log('Author ID:', authorId);

    if (!content || !authorId) {
        alert('请确保填写所有必需的信息（内容和作者ID）。');
        return;
    }

    const data = { content, authorId };

    fetch(`http://localhost:3000/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('评论成功');
            loadComments(postId); // 重新加载评论
            document.getElementById('commentContent').value = ''; // 清空输入框
        } else {
            if (!alertCalled) {
                alert('评论失败: ' + data.message);
                alertCalled = true; // 设置标志位
            }
        }
    })
    .catch(error => {
        console.error('错误:', error);
        if (!alertCalled) {
            alert('评论失败: ' + error.message);
            alertCalled = true; // 设置标志位
        }
    });
}

function loadComments(postId) {
    return fetch(`http://localhost:3000/api/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            const commentsList = document.getElementById('commentsList');
            commentsList.innerHTML = '';
            data.post.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment-item';
                commentElement.innerHTML = `
                    <small class="comment-author">作者: ${comment.author.username}</small>
                    <p class="comment-content">${comment.content}</p>
                `;
                commentsList.appendChild(commentElement);
            });
        });
}

function loadNotifications() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        return;
    }

    fetch(`http://localhost:3000/api/users/${userId}/notifications`)
        .then(response => response.json())
        .then(data => {
            const notificationContainer = document.getElementById('notificationContainer');
            notificationContainer.innerHTML = ''; // 清空现有内容
            if (data.notifications.length > 0) {
                data.notifications.forEach(notification => {
                    const notificationElement = document.createElement('div');
                    notificationElement.className = 'notification';
                    notificationElement.innerHTML = `
                        <p>${notification.message}</p>
                        <input type="checkbox" onclick="markAsRead('${notification._id}')">
                    `;
                    notificationContainer.appendChild(notificationElement);
                });
            } else {
                notificationContainer.innerHTML = '<p>没有消息</p>'; // 显示没有消息的提示
            }
        })
        .catch(error => {
            console.error('错误:', error);
        });
}

function markAsRead(notificationId) {
    fetch(`http://localhost:3000/api/notifications/${notificationId}/read`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            loadNotifications(); // 重新加载通知
        } else {
            console.error('标记通知为已读失败:', data.message);
        }
    })
    .catch(error => {
        console.error('错误:', error);
    });
}

module.exports = {
    createPost,
    viewPost,
    goBackToPosts,
    addComment, 
    loadComments,
    loadNotifications,
    markAsRead
};