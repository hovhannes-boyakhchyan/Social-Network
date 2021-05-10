import { newPass } from "../api/authFetch.js";


document.querySelector('.saveNewPass').addEventListener('click', async () => {
    const URLParams = new URLSearchParams(window.location.search);
    const token = URLParams.get('token');

    const password = document.querySelector('.password').value;
    const repeatPass = document.querySelector('.repeatPass').value;
    const info = document.querySelector('.info');

    if (password && password === repeatPass) {
        const response = await newPass({ password, token });

        if (response.success) {
            info.innerHTML = 'Password changed';
            location.href = '/login.html';
        } else {
            info.innerHTML = response.message;
        }

    } else {
        info.innerHTML = 'You entered different passwords';
    }
});