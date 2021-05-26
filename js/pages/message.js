import { getUser } from "../api/profileFetch.js";
import { getCurrentUser } from "../api/getCurrentUser.js";
// import { imageMessage } from "../api/uploadFetch.js";

let openMessengerBtn = document.querySelector(".openMessengerBtn");
let close__btn = document.querySelector(".close__btn");
let messenger = document.querySelector(".messenger");
let write_message = document.querySelector(".write_message");

let fileInput = document.querySelector("#file");
let chosen_picture = document.querySelector(".chosen_picture");
let show_picture = document.querySelector(".show_picture");
let delete_picture_btn = document.querySelector(".delete_picture");


// socket
const client = io.connect('http://localhost:3000', {
    auth: {
        token: localStorage.getItem('token')
    }
});


window.addEventListener('load', async () => {
    const searchParams = new URLSearchParams(window.location.search);
    const profileUserId = searchParams.get('user');

    const currentUser = await getCurrentUser();

    // ------------usersChatList------------
    function showUsersChatList(currentUser) {
        const chat_list = document.querySelector('.chat_list');
        client.on('getUsersChatList', data => {
            chat_list.innerHTML = '';
            data.forEach(item => {
                const user = JSON.parse(item);
                const div = document.createElement('div');
                div.className = 'chat_list_user';
                const p = document.createElement('p');
                p.className = 'chat_user_name';
                p.innerHTML = `${user.name} ${user.surname}`;
                div.append(p);
                chat_list.append(div);

                div.addEventListener('click', () => {
                    to_user_messages(user);
                });
            });
        });
        client.emit('getUsersChatList', currentUser.data['_id']);
    }
    showUsersChatList(currentUser);


    // ------------send massege-------------
    const sendMessageBtn = document.querySelector('.send__message');

    sendMessageBtn.addEventListener('click', to_send);
    async function to_send(e) {
        const write_message = document.querySelector('.write_message');
        const file = fileInput.files[0];

        if (write_message.value || file) {
            messenger.classList.add("_sending");
            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = e => {
                    client.emit(
                        "new message",
                        {
                            to: this.getAttribute('userId'),
                            message: write_message.value,
                            file: e.target.result
                        },
                        response => {
                            if (response.status === 'ok') {
                                to_chat();
                                messenger.classList.remove("_sending");
                            }
                        }
                    );
                }
                reader.onerror = () => {
                    alert("Տեղի է ունեցել սխալ, նկարը չի բեռնվել...");
                }
            } else {
                client.emit(
                    "new message",
                    {
                        to: this.getAttribute('userId'),
                        message: write_message.value,
                    },
                    response => {
                        if (response.status === 'ok') {
                            to_chat();
                            messenger.classList.remove("_sending");
                        }
                    }
                );
            }
        }
    }

    const chat = document.querySelector('.chat');
    client.on('new message', data => {
        if (data.to === currentUser.data['_id']) {
            if (data.image) {
                const div = document.createElement("div");
                const img = document.createElement("img");
                div.className = 'recipient_user';
                img.src = `http://localhost:3000/uploads/images/${data.image}`;
                div.append(img);
                chat.append(div);
                showUsersChatList(currentUser);
            }
            if (data.message) {
                const div = document.createElement("div");
                const p = document.createElement("p");
                div.className = 'recipient_user';
                p.innerHTML = data.message;
                div.append(p);
                chat.append(div);
                showUsersChatList(currentUser);
            }
            scrollDown();
        }
    });

    openMessengerBtn.addEventListener("click", async () => {
        if (profileUserId) {
            const user = await getUser(profileUserId);
            if (user.success) {
                to_user_messages(user.data);
            }
        }
        messenger.classList.add("active");
    });

    function to_user_messages(user) {
        client.emit('get all messages', user['_id']);

        document.querySelector('.chat_list').classList.add('hidden');
        document.querySelector('.back_to_chat_list_btn').classList.add('active');
        document.querySelector('.recipient_user_info').innerHTML = `${user.name} ${user.surname}`;
        sendMessageBtn.setAttribute('userId', user['_id']);
    }

    document.querySelector('.back_to_chat_list_btn').addEventListener('click', (e) => {
        document.querySelector('.chat_list').classList.remove('hidden');
        document.querySelector('.back_to_chat_list_btn').classList.remove('active');
        document.querySelector('.recipient_user_info').innerHTML = 'Messenger';
        chat.innerHTML = '';
        showUsersChatList(currentUser);
    });

    client.on('get all messages', data => {
        if (data.length > 0) {
            chat.innerHTML = '';
            data.forEach(data => {
                if (data.from === currentUser.data['_id']) {
                    if (data.image) {
                        const div = document.createElement("div");
                        const img = document.createElement("img");
                        div.className = 'sender_user';
                        img.src = `http://localhost:3000/uploads/images/${data.image}`;
                        div.append(img);
                        chat.append(div);
                    }
                    if (data.message) {
                        const div = document.createElement("div");
                        const p = document.createElement("p");
                        div.className = 'sender_user';
                        p.innerHTML = data.message;
                        div.append(p);
                        chat.append(div);
                    }
                } else if (data.to === currentUser.data['_id']) {
                    if (data.image) {
                        const div = document.createElement("div");
                        const img = document.createElement("img");
                        div.className = 'recipient_user';
                        img.src = `http://localhost:3000/uploads/images/${data.image}`;
                        div.append(img);
                        chat.append(div);
                    }
                    if (data.message) {
                        const div = document.createElement("div");
                        const p = document.createElement("p");
                        div.className = 'recipient_user';
                        p.innerHTML = data.message;
                        div.append(p);
                        chat.append(div);
                    }
                }
            });
            scrollDown();
        }
    });


    // -------functional mas------------

    close__btn.addEventListener("click", (e) => {
        messenger.classList.remove("active");
    });

    let message_body = document.querySelector(".message_body");

    function to_chat() {
        if (fileInput.files.length != 0) {
            const div = document.createElement("div");
            div.className = 'sender_user';
            div.append(document.querySelector(".chosen_picture img"));
            chat.append(div);
            delete_picture();
            scrollDown();
        }
        if (write_message.value.length != 0) {
            const div = document.createElement("div");
            const p = document.createElement("p");
            div.className = 'sender_user';
            p.innerHTML = write_message.value;
            div.append(p);
            chat.append(div);
            write_message.value = "";
            scrollDown();
        }
        write_message.focus();
    }

    let timer;
    let scrolled = message_body.scrollTop;
    function scrollDown() {
        if (scrolled < message_body.scrollHeight) {
            scrolled += 10;
            document.querySelector(".message_body").scrollTo(0, scrolled);
            timer = setTimeout(scrollDown, 3);
        } else {
            clearTimeout(timer);
            document.querySelector(".message_body").scrollTo(0, message_body.scrollHeight);
        }
    }


    // ------------------------file-----------------------------

    fileInput.addEventListener("change", readFile);

    async function readFile() {
        const file = this.files[0];
        if (!["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
            alert("Թույլատրվում է միյաին նկար");
            fileInput.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Նկարը պետկ է լինի 3-մբ ոչ ավել");
            return;
        }
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            chosen_picture.innerHTML = `<img src="${e.target.result}" alt="photo">`;
            show_picture.setAttribute("style", "transform: scale(1)");
        }
        reader.onerror = () => {
            alert("Տեղի է ունեցել սխալ, նկարը չի բեռնվել...");
        }

    }

    delete_picture_btn.addEventListener("click", delete_picture);

    function delete_picture() {
        show_picture.removeAttribute("style");
        chosen_picture.innerHTML = "";
        fileInput.value = "";
    }

});






