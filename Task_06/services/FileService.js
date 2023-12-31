const File = require('../models/File');
const emailService = require('../helper/emailService');

module.exports = {
    uploadFile: async (fileRequestData) => {
        try {
            const { filename, size, mimetype } = fileRequestData;
            console.log('Filename----', filename);
            console.log('File Size----', size);
            console.log('File Type----', mimetype);
            const file = await File.create({
                file_name: filename,
                file_size: size,
                file_type: mimetype,
            });
            console.log('ServiceFile',file)
            const emailInfo = await emailService.sendFileAsAttachment(fileRequestData);
            return file;
        } catch (error) {
            console.log(`Could not upload file: ${error.message}`);
            throw error;
        }
    },

    // fetchFile: async () => {
    //     try {

    //     } catch (error) {

    //     }
    // }
}