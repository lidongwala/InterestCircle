const { createInterestCircle } = require('../public/circle.js');

jest.spyOn(window, 'alert').mockImplementation(() => {});

describe('createInterestCircle', () => {
    beforeEach(() => {
        jest.spyOn(window, 'alert').mockImplementation(() => {});
        document.body.innerHTML = `
            <input id="circleName" value="Test Circle" />
            <input id="circleDescription" value="This is a test description." />
            <div id="circleList"></div>
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
});