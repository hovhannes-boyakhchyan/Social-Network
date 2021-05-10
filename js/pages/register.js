import { registerFetch } from "../api/authFetch.js";

const token = localStorage.getItem('token');
if (token) {
    location.href = '/index.html';
}

const inputs = [...document.querySelectorAll('.registerBlock input')];

const registerValues = {};

document.querySelector('.btnRegister').addEventListener('click', async () => {

    inputs.forEach(input => {
        registerValues[input['name']] = input.value;;
    });

    const response = await registerFetch(registerValues);

    document.querySelector('.statusRegister').innerHTML = response.message;

    if (response.success) {
        location.href = '/login.html';
    } else {

    }
});

document.querySelector('.login').addEventListener('click', async () => {
    location.href = '/login.html';
});
