const Post = require('../models/posts');
const User = require('../models/users');
const AppError = require('../managers/app_error');

class PostCtrl {
    async get() {
        return Post.find().populate({
            path: 'author',
            select: '-_id name surname email'
        });
    }
    async add(data) {
        if (!await User.exists({ '_id': data.author })) {
            throw new AppError('user id invalide', 403);
        }
        return new Post({ ...data }).save();
    }
    async getById(id) {
        if (!await Post.exists({ '_id': id })) {
            throw new AppError('user not found', 401);
        }
        return Post.findById(id).populate({
            path: 'author',
            select: '-_id name surname email'
        });
    }
    async update(data) {
        const { title, body, id } = data;
        if (!await Post.exists({ '_id': id })) {
            throw new AppError('user not found', 403);
        }
        const post = await Post.findById(id);
        if (title) {
            post.title = title;
        }
        if (body) {
            post.body = body;
        }
        return post.save();
    }
    async delete(id) {
        if (!await Post.exists({ '_id': id })) {
            throw new AppError('user not found', 403);
        }
        const post = await Post.findById(id);
        return post.remove();
    }
}

module.exports = new PostCtrl;