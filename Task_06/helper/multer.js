const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});


const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
        const extname = path.extname(file.originalname).toLowerCase();
        console.log(file)
        const fileSize = parseInt(req.headers['content-length']);
        if (allowedFileTypes.includes(extname)) {
            if (fileSize >= 102400 && fileSize <= 1024000) {
                return cb(null, true);
            }
            else {
                return cb('Error: File size must be in-between 100KB and 1MB');
            }
        }
        else {
            return cb('Error: Only jpg, jpeg, png, or pdf files are allowed');
        }
    },
});


module.exports = upload;