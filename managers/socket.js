const TokenManager = require('../managers/token_manager');
const Messages = require('../models/messages');

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
        client.on('new message', async data => {
            // const message = await new Messages({
            //     from: client.userId,
            //     to: data.to,
            //     message: data.message
            // }).save();
        });
        client.on('disconnect', () => {
            console.log('disconnect');
        });
    });
}