const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const { authenticateToken } = require('../helper/authenticateToken');
const { logRequestBody } = require('../helper/logger');


router.route('/postUser')
    .post(logRequestBody, authenticateToken, userController.postUser);

router.route('/getUser')
    .get(logRequestBody, authenticateToken, userController.getUser);

router.route('/getUser/:id')
    .get(logRequestBody, authenticateToken, userController.getUserWithId);

router.route('/updateUser/:id')
    .patch(logRequestBody, authenticateToken, userController.updateUser);

router.route('/deleteUser/:id')
    .delete(logRequestBody, authenticateToken, userController.deleteUser);

router.route('/login')
    .post(logRequestBody, userController.login);

router.route('/paginateUser')
    .get(logRequestBody, authenticateToken, userController.paginateUser)


module.exports = router;