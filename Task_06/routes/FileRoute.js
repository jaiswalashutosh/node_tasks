const express = require('express');
const router = express.Router();
const fileController = require('../controller/FileController');
const upload = require('../helper/multer');
const path = require('path');

router.route('/')
    .get((req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'))
    })

router.route('/postFile')
    .post(upload.single('file'), fileController.postFile);

// router.route('/getFile')
//     .get(fileController.getFile);

module.exports = router;