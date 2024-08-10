const { createInterestCircle, loadInterestCircles } = require('../public/circle.js');

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('createInterestCircle', () => {
    beforeEach(() => {
        // 在每个测试之前设置 DOM 元素
        document.body.innerHTML = `
            <input id="circleName" value="Test Circle" />
            <input id="circleDescription" value="This is a test description." />
        `;
    });

    test('should create a new interest circle', async () => {
        // 模拟 fetch
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: true }),
            })
        );

        await createInterestCircle();

        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/circles', expect.any(Object));
    });

    test('should alert on failure', async () => {
        // 模拟 fetch 失败
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ success: false, message: 'Error message' }),
            })
        );

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await createInterestCircle();

        expect(alertMock).toHaveBeenCalledWith('兴趣圈创建失败: Error message');
        alertMock.mockRestore();
    });
});

describe('loadInterestCircles', () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="circleList"></div>`;
    });

    test('should load interest circles successfully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([{ name: 'Circle 1', description: 'Description 1', _id: '1' }]),
            })
        );

        await loadInterestCircles();

        const circleList = document.getElementById('circleList');
        expect(circleList.innerHTML).toContain('Circle 1');
    });

    test('should alert when no circles found', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        );

        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

        await loadInterestCircles();

        expect(alertMock).toHaveBeenCalledWith('没有找到兴趣圈');
        alertMock.mockRestore();
    });
});