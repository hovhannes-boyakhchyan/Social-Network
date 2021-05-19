const TokenManager = require('../managers/token_manager');
const MessageCtrl = require('../controllers/messages-ctrl');

const onlineUsers = new Map();
module.exports = (server) => {
    const io = require('socket.io')(server, {
        cors: {
            origin: '*'
        }
    });

    io.use((client, next) => {
        if (client.handshake.auth.token) {
            try {
                const decode = TokenManager.decode(client.handshake.auth.token);
                if (decode.userId && decode.action === 'login') {
                    client.userId = decode.userId;
                    next();
                } else {
                    client.disconnect();
                }
            } catch (e) {
                client.disconnect();
            }
        } else {
            client.disconnect();
        }
    });

    io.on('connection', client => {
        onlineUsers.set(client.userId, client);

        client.on('new message', async data => {
            const message = await MessageCtrl.send({
                currentUser: client.userId,
                userTo: data.to,
                message: data.message
            });
            if (onlineUsers.has(data.to)) {
                const user = onlineUsers.get(data.to);
                user.emit('new message', message);
            }
        });

        client.on('get all messages', async (userId) => {
            const messages = await MessageCtrl.getMessages({
                currentUser: client.userId,
                userTo: userId
            });
            client.emit('get all messages', messages);
        });

        client.on('getUsersChatList', async (currentUserId) => {
            const inChatUsers = new Set();
            const usersId = await MessageCtrl.getUsersFromMessages(currentUserId);
            usersId.forEach(user => {
                if (user.from['_id'] != currentUserId) {
                    inChatUsers.add(JSON.stringify(user.from));
                } else if (user.to['_id'] != currentUserId) {
                    inChatUsers.add(JSON.stringify(user.to));
                }
            });
            client.emit('getUsersChatList', [...inChatUsers]);
        });

        client.on('disconnect', () => {
            onlineUsers.delete(client.userId);
        });
    });
}