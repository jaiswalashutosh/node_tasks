const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');
const { authenticateToken } = require('../helper/authenticateToken');


router.route('/postUser')
    .post(authenticateToken, userController.postUser);

router.route('/getUser')
    .get(authenticateToken, userController.getUser);

router.route('/getUser/:id')
    .get(authenticateToken, userController.getUserWithId);

router.route('/updateUser/:id')
    .patch(authenticateToken, userController.updateUser);

router.route('/deleteUser/:id')
    .delete(authenticateToken, userController.deleteUser);

router.route('/login')
    .post(userController.login);

router.route('/paginateUser')
    .get(authenticateToken, userController.paginateUser)


module.exports = router;