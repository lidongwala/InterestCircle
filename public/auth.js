// 处理用户注册和登录相关的功能

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    const data = { username, password };

    fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('注册成功');
            showLoginForm();
        } else {
            alert('注册失败：' + data.message);
        }
    })
    .catch(error => {
        console.error('错误：', error);
    });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = {
        username: username,
        password: password
    };

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
            localStorage.setItem('userId', data.user._id);
            document.querySelector('.container').style.display = 'none'; 
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            loadInterestCircles();
            loadNotifications();
        } else {
            alert('登录失败：' + data.message);
        }
    })
    .catch(error => {
        console.error('错误：', error);
        alert('错误：' + error.message);
    });
}
