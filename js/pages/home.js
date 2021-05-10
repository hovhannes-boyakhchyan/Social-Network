import { initSession } from "../api/authFetch.js";
import { addNewPost } from "../api/addNewPost.js";
import { search } from "../api/home.js";
import { sentFriendRequest } from "../api/home.js";


//initSession
let currentUser = null;
window.addEventListener('load', async () => {
    const token = localStorage.getItem('token');
    if (token) {
        const response = await initSession(token);

        if (response.success) {
            currentUser = response.data;
            document.querySelector('.userWelcome').innerHTML = `Hello ${response.data.name}`;
            showFriends(currentUser);
        } else {
            logaut();
        }

    } else {
        logaut();
    }
});
document.querySelector('.logout').addEventListener('click', logaut);
function logaut() {
    localStorage.removeItem('token');
    location.href = '/login.html';
}

// Post
document.querySelector('.postBtn').addEventListener('click', async () => {
    const title = document.querySelector('.postBlock input[name=title]').value;
    const body = document.querySelector('.postBlock input[name=body]').value;
    const image = document.querySelector('.postBlock input[name=image]').files[0];

    const formData = new FormData();

    formData.append('title', title);
    formData.append('body', body);
    formData.append('postImage', image);

    const response = await addNewPost(formData);

    if (!response.success && response.message === "invalid token") {
        logaut();
    }
    if (response.success) {
        document.querySelector('.postStatus').innerHTML = 'Post Created';
        document.querySelector('.postBlock input[name=title]').value = '';
        document.querySelector('.postBlock input[name=body]').value = '';
        document.querySelector('.postBlock input[name=image]').value = '';
    } else {
        document.querySelector('.postStatus').innerHTML = response.message;
    }
});

// search
let timeOut = null;
document.querySelector('.search').addEventListener('input', (e) => {
    const searchResulth = document.querySelector('.searchResult');

    if (timeOut) {
        clearTimeout(timeOut);
    }
    if (e.target.value) {
        timeOut = setTimeout(async () => {
            const response = await search(e.target.value.trim());
            if (response.success) {
                searchResulth.innerHTML = '';
                response.data.forEach(user => {

                    const div = document.createElement('div');
                    const a = document.createElement('a');
                    const btn = document.createElement('button');
                    btn.setAttribute('id', user['_id']);

                    if (user.friendRequest.includes(currentUser['_id'])) {
                        btn.innerHTML = 'Requested';
                    } else if (user.sentFriendRequest.includes(currentUser['_id'])) {
                        btn.innerHTML = 'Confirm';
                    } else if (user.friends.some(friend => friend.friendId === currentUser['_id'])) {
                        btn.innerHTML = 'Unfriend';
                    } else {
                        btn.innerHTML = 'Add Friend';
                    }

                    a.append(`${user.name} ${user.surname} `);
                    a.href = `http://127.0.0.1:5500/profile.html?user=${user['_id']}`;
                    div.append(a);
                    div.append(btn);
                    searchResulth.append(div);

                });

                document.querySelectorAll('.searchResult div button').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const response = await sentFriendRequest(e.target.getAttribute('id'));
                        if (response.success) {
                            e.target.innerHTML = response.message;
                        }
                    });
                });
            }
        }, 1000);
    } else {
        searchResulth.innerHTML = '';
    }
});

function showFriends(currentUser) {
    const friendsConteiner = document.querySelector('.friendsConteiner');
    currentUser.friends.forEach(friend => {
        const friendBlock = document.createElement('div');
        friendBlock.className = 'friendBlock';
        const friendItem = document.createElement('a');
        friendItem.href = `http://127.0.0.1:5500/profile.html?user=${friend.friendId}`;
        friendItem.className = 'friendItem';
        friendItem.innerHTML = `${friend.name} ${friend.surname}`;

        friendBlock.append(friendItem);
        friendsConteiner.append(friendBlock);
    });
}

// socket
const client = io.connect('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('token')
    }
});

client.emit("new message", {

});