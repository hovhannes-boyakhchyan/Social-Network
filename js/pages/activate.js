import { activate } from "../api/authFetch.js";


window.addEventListener('load', async () => {
    let searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    const activateStatus = document.querySelector('.activateStatus');
    const response = await activate(token);
    if (response.success) {
        activateStatus.innerHTML = 'Profile activate';
        location.href = '/login.html';
    } else {
        activateStatus.innerHTML = response.message;
    }
});

