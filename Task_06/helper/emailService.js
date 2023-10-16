const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PWD
    }
});

const sendFileAsAttachment = (file) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'contact.ashutoshj@gmail.com',
        subject: 'File Attachment',
        text: 'Check this out...',
        attachments: [
            {
                filename: file.filename,
                path: path.join(__dirname, '../public/uploads', file.filename),
            },
        ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email error: ', error);
            throw new Error("Could not send mail");
        } else {
            console.log('Email sent: ' + info.response);
            return info.response;
        }
    });
};

module.exports = { sendFileAsAttachment }