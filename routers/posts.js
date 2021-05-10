const express = require('express');
const responseHandler = require('../middleware/responseHandler');
const { body } = require('express-validator');
const validationResult = require('../middleware/validationResult');
const PostCtrl = require('../controllers/posts-ctrl');
const upload = require('../middleware/upload');
const validateToken = require('../middleware/validateToken');

const router = express.Router();

router.route('/')
    .get(
        responseHandler,
        validateToken,
        async (req, res) => {
            const posts = await PostCtrl.get();
            res.onSuccess(posts);
        }
    )
    .post(
        responseHandler,
        validateToken,
        upload.single('postImage'),
        body('title').isLength({ min: 1 }),
        body('body').isLength({ min: 1 }),
        validationResult,
        async (req, res) => {
            try {
                const post = await PostCtrl.add({
                    author: req.decode.userId,
                    title: req.body.title,
                    body: req.body.body,
                    image: req.file?.filename
                });
                res.onSuccess(post, "post created");
            } catch (e) {
                res.onError(e);
            }
        }
    )

router.route('/:id')
    .get(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const post = await PostCtrl.getById(req.params.id);
                res.onSuccess(post);
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .put(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const post = await PostCtrl.update({ ...req.body, id: req.params.id });
                res.onSuccess(post, 'post is update');
            } catch (e) {
                res.onError(e);
            }
        }
    )
    .delete(
        validateToken,
        responseHandler,
        async (req, res) => {
            try {
                const post = await PostCtrl.delete(req.params.id);
                res.onSuccess(post, 'post deleited');
            } catch (e) {
                res.onError(e);
            }
        }
    )


module.exports = router;