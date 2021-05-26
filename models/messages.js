const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const Message = new Schema({
    from: { type: ObjectId, ref: 'users' },
    to: { type: ObjectId, ref: 'users' },
    message: String,
    image: String
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Messages', Message);