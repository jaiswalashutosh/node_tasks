const express = require('express');
const router = express.Router();
const { logRequestBody } = require('../helper/logger');
const { authenticateToken } = require('../helper/authenticateToken');
const userController = require('../controller/UserController');
const upload = require('../helper/multer');
const path = require('path');


router.route('/postUser')
    .post(logRequestBody, authenticateToken, userController.postUser);

router.route('/getUser')
    .get(logRequestBody, authenticateToken, userController.getUser);

router.route('/getUser/:id')
    .get(logRequestBody, authenticateToken, userController.getUserWithId);

router.route('/account-details')
    .get(logRequestBody, authenticateToken, userController.accountDetails)

router.route('/updateUser/:id')
    .patch(logRequestBody, authenticateToken, userController.updateUser);

router.route('/deleteUser/:id')
    .delete(logRequestBody, authenticateToken, userController.deleteUser);

router.route('/login')
    .post(logRequestBody, userController.login);

router.route('/uploadPicture')
    .post(logRequestBody, authenticateToken, upload.single('image'), userController.uploadPicture);

router.route('/forgot-password')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../public/forgotPassword.html'))
    })

router.route('/forgot-password')
    .post(logRequestBody, userController.forgotPassword);

router.route('/reset-password')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../public/resetPassword.html'));
    })

router.route('/reset-password')
    .post(logRequestBody, userController.resetPassword);



module.exports = router;

