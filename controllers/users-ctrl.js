const bcrypt = require('../managers/bcrypt');
const Users = require('../models/users');
const AppError = require('../managers/app_error');


class UsersCtrl {
    async getAll(data) {
        const { search, currentUserId } = data;
        const options = {
            $and: [
                { _id: { $ne: currentUserId } },
                { $or: [{ name: { $in: search } }, { surname: { $in: search } }] }
            ]
        }
        return await Users.find(options);
    }
    async add(data) {
        const { name, surname, email, password, image } = data;
        if (await Users.exists({ email })) {
            throw new AppError('user exist', 404);
        }
        return new Users({
            name,
            surname,
            email,
            password: await bcrypt.hash(password),
            image: image?.imagename
        }).save();
    }
    async update(options) {
        const { name, surname, id } = options;

        if (!await Users.exists({ _id: id })) {
            throw new Apperror('user not found', 403);
        }
        const user = await Users.findById(id);
        user.name = name;
        user.surname = surname;

        user.save();
        return user;
    }
    async getById(id) {
        if (!await Users.exists({ _id: id })) {
            throw new AppError('user not found', 403);
        }
        return Users.findById(id);
    }
    async getOne(email) {
        if (!await Users.exists({ email: email })) {
            throw new AppError('this email not registered', 404);
        }
        return Users.findOne({ email: email });
    }
    async delete(id) {
        if (!await Users.exists({ _id: id })) {
            throw new AppError('user not found', 403);
        }
        return Users.findById(id).remove();
    }
    async frinedRequest(data) {
        const { currentUserId, userId } = data;
        const [currentUser, user] = await Promise.all([Users.findById(currentUserId), Users.findById(userId)]);
        if (!currentUser || !user) {
            throw new AppError('bad request', 403);
        }
        // sent friend request
        if (
            !currentUser.sentFriendRequest.includes(userId)
            && !currentUser.friendRequest.includes(userId)
            && !currentUser.friends.some(friend => friend.friendId == userId)
        ) {
            currentUser.sentFriendRequest.push(userId);
            user.friendRequest.push(currentUserId);
            return { data: Promise.all([currentUser.save(), user.save()]), message: 'Requested' };
        }
        // cansel send request
        if (currentUser.sentFriendRequest.includes(userId) && user.friendRequest.includes(currentUserId)) {
            currentUser.sentFriendRequest.splice(currentUser.sentFriendRequest.indexOf(userId), 1);
            user.friendRequest.splice(user.friendRequest.indexOf(currentUserId), 1);
            return { data: Promise.all([currentUser.save(), user.save()]), message: 'Add Friend' };
        }
        // add friend
        if (currentUser.friendRequest.includes(userId) && user.sentFriendRequest.includes(currentUserId)) {
            currentUser.friends.push({
                friendId: userId,
                name: user.name,
                surname: user.surname,
                image: user.image
            });
            user.friends.push({
                friendId: currentUserId,
                name: currentUser.name,
                surname: currentUser.surname,
                image: currentUser.image
            });
            const addFriend = await Promise.all([currentUser.save(), user.save()]);

            currentUser.friendRequest.splice(currentUser.friendRequest.indexOf(userId), 1);
            user.sentFriendRequest.splice(user.sentFriendRequest.indexOf(currentUserId), 1);
            await Promise.all([currentUser.save(), user.save()]);
            return { data: addFriend, message: 'Unfriend' };
        }
        // unfriend
        if (currentUser.friends.some(friend => friend.friendId == userId) && user.friends.some(friend => friend.friendId == currentUserId)) {

            currentUser.friends.splice(currentUser.friends.findIndex(friend => friend.friendId == userId), 1);
            user.friends.splice(user.friends.findIndex(friend => friend.friendId == currentUserId), 1);

            const removeFriend = await Promise.all([currentUser.save(), user.save()]);
            return { data: removeFriend, message: "Add Friend" }
        }
        throw new AppError('bad request', 403);
    }
}


module.exports = new UsersCtrl;
