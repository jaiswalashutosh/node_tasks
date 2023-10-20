const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        const id = req.user.id;
        cb(null, id + '-' + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
        const extname = path.extname(file.originalname).toLowerCase();

        const fileSize = parseInt(req.headers['content-length']);
        if (allowedFileTypes.includes(extname)) {
            if (fileSize <= 50 * 1024) {
                return cb(null, true);
            } else {
                return cb('Error: File size must be less than 50KB');
            }
        } else {
            return cb('Error: Only jpg, jpeg, png files are allowed');
        }
    },
});

module.exports = upload;