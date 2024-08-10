const { createPost, loadComments } = require('../public/post.js');

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('createPost', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <input id="postTitle" value="Test Post" />
            <input id="postContent" value="This is a test post." />
            <input id="postImage" type="file" />
        `;
        localStorage.setItem('userId', '12345'); // 模拟用户登录
        global.showCircleDetails = jest.fn(); // 模拟 showCircleDetails 函数
    });

    test('should create a new post', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true }),
            })
        );

        await createPost('circleId');

        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/circles/circleId/posts', expect.any(Object));
    });

    test('should alert if required fields are missing', async () => {
        document.getElementById('postTitle').value = '';
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await createPost('circleId');

        expect(alertMock).toHaveBeenCalledWith('请确保填写所有必需的信息（标题、内容和作者ID）。');
        alertMock.mockRestore();
    });
});

describe('loadComments', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <div id="commentsList"></div>
        `;
    });

    test('should load comments and update commentsList', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    success: true,
                    post: {
                        comments: [
                            { author: { username: 'user1' }, content: 'comment1' },
                            { author: { username: 'user2' }, content: 'comment2' }
                        ]
                    }
                })
            })
        );

        return loadComments(1).then(() => {
            const commentsList = document.getElementById('commentsList');
            expect(commentsList).not.toBeNull();
            expect(commentsList.children.length).toBe(2);
            expect(commentsList.children[0].querySelector('.comment-author').textContent).toBe('作者: user1');
            expect(commentsList.children[0].querySelector('.comment-content').textContent).toBe('comment1');
            expect(commentsList.children[1].querySelector('.comment-author').textContent).toBe('作者: user2');
            expect(commentsList.children[1].querySelector('.comment-content').textContent).toBe('comment2');
        });
    });
});