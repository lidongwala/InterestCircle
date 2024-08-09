function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 构建请求数据
    const data = {
        username: username,
        password: password
    };

    // 发送请求到后端API
    fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Login successful');
            // 可以重定向到其他页面或进行其他操作
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}