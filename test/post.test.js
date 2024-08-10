const { createPost } = require('../public/post.js');

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

    test('should alert on failure', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: false, message: 'Error message' }),
            })
        );

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await createPost('circleId');

        expect(alertMock).toHaveBeenCalledWith('发帖失败: Error message');
        alertMock.mockRestore();
    });

    test('should alert if required fields are missing', async () => {
        document.getElementById('postTitle').value = '';
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await createPost('circleId');

        expect(alertMock).toHaveBeenCalledWith('请确保填写所有必需的信息（标题、内容和作者ID）。');
        alertMock.mockRestore();
    });
});