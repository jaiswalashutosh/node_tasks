const { successHandler, errorHandler } = require('../helper/responseHandler');
const fileService = require('../services/FileService');


module.exports = {
    postFile: async (req, res, next) => {
        try {
            const fileRequestData = req.file;
            console.log(fileRequestData);
            const fileData = await fileService.uploadFile(fileRequestData);
            if (fileData) {
                successHandler(res, 200, "File uploaded successfully!", fileData);
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else if (error.name === 'SequelizeValidationError') {
                errorHandler(res, 400, 'Sequelize_validation_error', error.message);
            } else {
                errorHandler(res, 409, 'file_upload_error', error.message);
            }
        }
    },

    // getFile: async (req, res, next) => {
    //     try {
    //         console.log("Here")
    //         const data = ["Tony", "Lisa", "Michael", "Ginger", "Food"]
    //         successHandler(res, 200, "Data", data);
    //     } catch (error) {
    //         console.log(error)
    //     }
    // },
}