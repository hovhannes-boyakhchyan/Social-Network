const express = require('express');
const validateToken = require('../middleware/validateToken');
const responseHandler = require('../middleware/responseHandler');
const AppError = require('../managers/app_error');
const UserCtrl = require('../controllers/users-ctrl');


const router = express.Router();

router.route('/:id')
    .get(
        responseHandler,
        validateToken,
        async (req, res) => {
            try {
                const user = await UserCtrl.getById(req.params.id);
                res.onSuccess(user);
            } catch (e) {
                res.onError(e);
            }
        }
    )

module.exports = router;