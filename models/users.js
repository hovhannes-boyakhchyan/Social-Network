const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const User = new Schema({
    name: String,
    surname: String,
    image: String,
    email: String,
    password: String,

    verify: { type: Boolean, default: true },
    forgotPass: String,

    friends: [{
        friendId: { type: Schema.Types.ObjectId, ref: 'users' },
        name: String,
        surname: String,
        image: String
    }],
    sentFriendRequest: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    friendRequest: [{ type: Schema.Types.ObjectId, ref: 'users' }]

}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('users', User);