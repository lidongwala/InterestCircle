const { addComment } = require('../public/post.js');

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('addComment', () => {
    let alertMock;

    beforeEach(() => {
        document.body.innerHTML = `
            <textarea id="commentContent" class="comment-input" placeholder="写下你的评论..."></textarea>
        `;
        localStorage.setItem('userId', '12345'); // 模拟用户登录
        global.currentPostId = 'validPostId'; // 设置 currentPostId
        alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
    });

    afterEach(() => {
        alertMock.mockRestore();
    });

    test('should alert if userId is missing', async () => {
        localStorage.removeItem('userId');

        await addComment();

        expect(alertMock).toHaveBeenCalledWith('请确保填写所有必需的信息（内容和作者ID）。');
    });
});