import { getUser } from "../api/profileFetch.js";
import { getCurrentUser } from "../api/getCurrentUser.js";
import { sentFriendRequest } from "../api/home.js";


window.addEventListener('load', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const userId = searchParams.get('user');

    const currentUser = await getCurrentUser();

    const user = await getUser(userId);
    if (user.success) {
        document.querySelector('.user_block h4').innerHTML = `${user.data.name} ${user.data.surname}`;
        const friendRequestBtn = document.querySelector('.friendRequestBtn');

        if (user.data.friendRequest.includes(currentUser.data['_id'])) {
            friendRequestBtn.innerHTML = 'Requested';
        } else if (user.data.sentFriendRequest.includes(currentUser.data['_id'])) {
            friendRequestBtn.innerHTML = 'Confirm';
        } else if (user.data.friends.some(friend => friend.friendId === currentUser.data['_id'])) {
            friendRequestBtn.innerHTML = 'Unfriend';
        } else {
            friendRequestBtn.innerHTML = 'Add Friend';
        }

        friendRequestBtn.addEventListener('click', async () => {
            const response = await sentFriendRequest(userId);
            if (response.success) {
                friendRequestBtn.innerHTML = response.message;
            }
        });
    } else {
        logaut();
    }


});

document.querySelector('.logOutBtn').addEventListener('click', logaut);
function logaut() {
    localStorage.removeItem('token');
    location.href = '/login.html';
}

document.querySelector('.homePageBtn').addEventListener('click', () => {
    location.href = '/index.html';
});
