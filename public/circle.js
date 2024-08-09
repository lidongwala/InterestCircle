// 处理兴趣圈相关的功能

function createInterestCircle() {
    const circleName = document.getElementById('circleName').value;
    const circleDescription = document.getElementById('circleDescription').value;

    const data = {
        name: circleName,
        description: circleDescription
    };

    fetch('http://localhost:3000/api/circles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('兴趣圈创建成功');
            loadInterestCircles();
        } else {
            alert('兴趣圈创建失败: ' + data.message);
        }
    })
    .catch(error => {
        console.error('错误:', error);
    });
}

function loadInterestCircles() {
    fetch('http://localhost:3000/api/circles')
        .then(response => response.json())
        .then(circles => {
            if (circles && circles.length > 0) {
                displayCircles(circles);
            } else {
                console.error('No circles found');
                alert('没有找到兴趣圈');
            }
        })
        .catch(error => {
            console.error('Error fetching circles:', error);
            alert('获取兴趣圈时发生错误');
        });
}

function displayCircles(circles) {
    console.log('获取到的兴趣圈:', circles);
    const circleList = document.getElementById('circleList');
    if (!circleList) {
        console.error('无法找到 circleList 元素');
        return;
    }
    circleList.innerHTML = '';
    circles.forEach(circle => {
        const circleElement = document.createElement('div');
        circleElement.className = 'circle-item';
        circleElement.innerHTML = `
            <h3>${circle.name}</h3>
            <p>${circle.description}</p>
            <button onclick="showCircleDetails('${circle._id}')">进入圈子</button>
        `;
        circleList.appendChild(circleElement);
    });
}

function showCircleDetails(circleId) {
    const userId = localStorage.getItem('userId'); // 获取用户ID
    fetch(`http://localhost:3000/api/circles/${circleId}?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('API 返回的数据:', data);
        if (data.success) {
            const circleDetails = document.getElementById('circleDetails');
            circleDetails.innerHTML = `
                <div class="circle-header">
                    <div class="button-container">
                        <button class="styled-button" onclick="goBackToCircles()">返回主页</button>
                        <button class="styled-button" onclick="followCircle('${circleId}')">
                            ${data.user.followedCircles.includes(circleId) ? '已关注' : '关注'}
                        </button>
                    </div>
                    <div class="circle-info">
                        <h3>圈子名称: ${data.circle.name}</h3>
                        <p>描述: ${data.circle.description}</p>
                    </div>
                    <div class="active-members">
                        <img src="../src/4016181.jpg" alt="Active Members Image" class="active-members-image">
                        <div id="memberContent">
                            <h3>活跃成员</h3>
                            <div id="activeMembersList"></div>
                        </div>
                    </div>
                    <div class="post-form">
                        <input type="text" id="postTitle" placeholder="标题" class="form-input">
                        <input type="file" id="postImage" accept="image/*" class="form-input"> <!-- 添加文件输入 -->
                        <textarea id="postContent" placeholder="内容" class="form-textarea"></textarea>
                        <button onclick="createPost('${circleId}')" class="form-button">发帖</button>
                    </div>
                </div>
                <h3>帖子列表</h3>
                <div id="postList">
                    <div class="loading-placeholder">加载中...</div>
                </div>
                
            `;

            // 获取并展示活跃成员
            fetch(`http://localhost:3000/api/circles/${circleId}/activeMembers`)
            .then(response => response.json())
            .then(data => {
                const activeMembersList = document.getElementById('activeMembersList');
                activeMembersList.innerHTML = '';
                if (data.success && data.activeMembers.length > 0) {
                    data.activeMembers.forEach(member => {
                        const memberElement = document.createElement('div');
                        memberElement.innerHTML = `
                            <p>${member.username} - 发帖量: ${member.postCount}, 评论量: ${member.commentCount}</p>
                        `;
                        activeMembersList.appendChild(memberElement);
                    });
                } else {
                    activeMembersList.innerHTML = '<p>没有活跃成员。</p>';
                }
            });

            fetch(`http://localhost:3000/api/circles/${circleId}/posts`)
            .then(response => response.json())
            .then(data => {
                const postList = document.getElementById('postList');
                postList.innerHTML = ''; // 清空现有内容
                if (data.success) {
                    data.posts.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.className = 'post'; 
                        postElement.innerHTML = `
                            <div class="post-content">
                                ${post.image && post.image.data ? `<img src="data:${post.image.contentType};base64,${arrayBufferToBase64(post.image.data.data)}" alt="Post Image" class="post-image">` : ''}
                                <div>
                                    <h4>${post.title}</h4>
                                    <small>作者: ${post.author.username}</small>
                                    <p>${post.content}</p>
                                    <button onclick="viewPost('${post._id}', '${circleId}')" id="backToPostsButton">查看</button>
                                </div>
                            </div>
                        `;
                        postList.appendChild(postElement);
                    });

                    // 初始化懒加载
                    const lazyImages = document.querySelectorAll('.lazy-load');
                    const observer = new IntersectionObserver((entries, observer) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                const img = entry.target;
                                img.src = img.dataset.src;
                                img.classList.remove('lazy-load');
                                observer.unobserve(img);
                            }
                        });
                    });

                    lazyImages.forEach(img => {
                        observer.observe(img);
                    });
                } else {
                    alert('获取帖子失败: ' + data.message);
                }
            })
            .catch(error => {
                console.error('错误:', error);
            });

            document.getElementById('mainContent').style.display = 'none';
            document.getElementById('circleDetails').style.display = 'block';
        } else {
            alert('获取圈子失败: ' + data.message);
        }
    })
    .catch(error => {
        console.error('错误:', error);
    });
}

function goBackToCircles() {
    document.getElementById('circleDetails').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    loadInterestCircles(); // 重新加载兴趣圈列表
}

function followCircle(circleId) {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('请先登录');
        return;
    }
    fetch(`http://localhost:3000/api/circles/${circleId}/follow`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('网络响应不正常');
        }
        return response.json(); // 确保返回 JSON 数据
    })
    .then(data => {
        if (data.success) {
            alert('关注成功');
            document.getElementById('followButton').disabled = true; // 禁用按钮
            document.getElementById('followButton').innerText = '已关注'; // 修改按钮文本
        } else {
            alert('关注失败: ' + data.message);
        }
    })
    .catch(error => {
        console.error('错误:', error);
        alert('发生错误: ' + error.message);
    });
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function loadMorePosts(circleId, page) {
    fetch(`http://localhost:3000/api/circles/${circleId}/posts?page=${page}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const postList = document.getElementById('postList');
                data.posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.className = 'post';
                    postElement.innerHTML = `
                        <div class="post-content">
                            <h4>${post.title}</h4>
                            <small>作者: ${post.author.username}</small>
                            <p>${post.content}</p>
                        </div>
                        ${post.image && post.image.data ? `<img src="data:${post.image.contentType};base64,${arrayBufferToBase64(post.image.data.data)}" alt="Post Image" class="post-image">` : ''}
                        <button class="view-post-button" onclick="viewPost('${post._id}', '${circleId}')">查看</button>
                    `;
                    postList.appendChild(postElement);
                });
            } else {
                alert('加载更多帖子失败: ' + data.message);
            }
        })
        .catch(error => {
            console.error('错误:', error);
        });
}