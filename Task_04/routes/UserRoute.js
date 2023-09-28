const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController')


router.route('/postUser')
    .post(userController.postUser);

router.route('/getUser')
    .get(userController.getUser);

router.route('/getUser/:id')
    .get(userController.getUserWithId);

router.route('/updateUser/:id')
    .patch(userController.updateUser);

router.route('/deleteUser/:id')
    .delete(userController.deleteUser);

router.route('/paginateUser')
    .get(userController.paginateUser)


module.exports = router;