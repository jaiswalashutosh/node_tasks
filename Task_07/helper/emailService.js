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

const sendEmailOnRegistration = async (email, first_name) => {
    const message = `Hello ${first_name},\n\nThank you for registering with our service. Your registration is successful!`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Registration successful!',
        text: message,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email error: ', error);
            throw new Error("Could not send mail");
        } else {
            console.log('Email sent: ' + info.response);
            return info.response;
        }
    });
};

const sendResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.APP_URL}/user/reset-password?token=${resetToken}&email=${user.email}`;
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Email error: ', error);
            throw new Error("Could not send mail");
        } else {
            console.log('Email sent: ' + info.response);
            return info.response;
        }
    });
}
module.exports = { sendEmailOnRegistration, sendResetEmail }