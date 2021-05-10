const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "users" },
    title: String,
    body: String,
    image: String
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model("posts", Post);