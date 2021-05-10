import { loginFatch } from "../api/authFetch.js";

const token = localStorage.getItem('token');
if (token) {
    location.href = '/index.html';
}

document.querySelector('.loginBtn').addEventListener('click', async () => {
    const email = document.querySelector('.loginBlock input[name=email]').value;
    const password = document.querySelector('.loginBlock input[name=password]').value;

    const response = await loginFatch({ email, password });

    if (response.success) {
        localStorage.setItem('token', response.data);
        location.href = '/index.html';
    } else {
        document.querySelector('.statuslogin').innerHTML = response.message;
    }
});

document.querySelector('.register').addEventListener('click', async () => {
    location.href = '/register.html';
});


