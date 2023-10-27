const { successHandler, errorHandler } = require('../helper/responseHandler');
const userService = require('../services/UserService');
const User = require('../models/User');
const Token = require('../models/Token')
const jwt = require('jsonwebtoken');
const emailService = require('../helper/emailService');
const { Sequelize } = require('sequelize');
const bycrypt = require('bcryptjs');
const { generateAccessToken } = require('../helper/generateAccessToken');


module.exports = {
    postUser: async (req, res, next) => {
        try {
            const data = req.body;
            // console.log(req.user.id)
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const userData = await userService.addUser(data);
                if (userData) {
                    successHandler(res, 200, "User added successfully!", userData);
                }
            } else {
                errorHandler(res, 400, 'user_addition_error', 'Form data missing.');
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'user_addition_error', error.message);
            }
        }
    },

    getUser: async (req, res, next) => {
        try {
            let page = parseInt(req.query.page);
            let limit = parseInt(req.query.limit);
            console.log(page, limit);
            const sort = req.query.sort || 'first_name';
            const order = req.query.order || 'asc';
            const search = req.query.search || '';
            if (page && limit) {
                const userData = await userService.fetchUser(page, limit, sort, order, search);
                if (userData && userData.length > 0) {
                    successHandler(res, 200, "Users data fetched successfully!", userData);
                }
            } else {
                errorHandler(res, 401, 'pagination_error', 'Page or Limit missing.');
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 404, 'users_not_found', error.message);
            }
        }
    },

    getUserWithId: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (id) {
                const userData = await userService.fetchUserWithId(id);
                if (userData) {
                    successHandler(res, 200, "User fetched successfully!", userData);
                } else {
                    errorHandler(res, 400, 'user_not_found', 'User id missing')
                }
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 400, 'user_not_found', error.message);
            }
        }
    },

    accountDetails: async (req, res, next) => {
        try {
            const id = req.user.id;
            if (id) {
                const userData = await userService.fetchAccount(id);
                if (userData) {
                    successHandler(res, 200, "Account fetched successfully!", userData);
                } else {
                    errorHandler(res, 400, 'user_not_found', 'User id missing')
                }
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 400, 'user_not_found', error.message);
            }
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            const data = req.body;
            if (id && (data !== undefined && data != null && Object.keys(data).length > 0)) {
                const userData = await userService.modifyUser(id, data);
                if (userData) {
                    successHandler(res, 200, "User updated successfully!", userData);
                }
            } else {
                errorHandler(res, 400, 'user_updation_error', 'Update data missing');
            }

        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 400, 'user_updation_error', error.message);
            }
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (id) {
                const userData = await userService.removeUser(id);
                if (userData) {
                    successHandler(res, 200, "User deleted successfully!", userData);
                }
            } else {
                errorHandler(res, 400, 'user_deletion_error', 'User id missing')
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 400, 'user_deletion_error', error.message);
            }
        }
    },

    login: async (req, res, next) => {
        try {
            const data = req.body;
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const userData = await userService.authUser(data);
                if (userData) {
                    successHandler(res, 200, "Login successfull", userData);
                }
            } else {
                errorHandler(res, 400, 'login_error', 'Email or password missing.')
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else {
                errorHandler(res, 409, 'login_error', error.message);
            }
        }
    },

    uploadPicture: async (req, res, next) => {
        try {
            const fileRequestData = req.file;
            const id = req.user.id;
            console.log(fileRequestData);
            const fileData = await userService.uploadImage(fileRequestData, id);
            if (fileData) {
                successHandler(res, 200, "Profile picture uploaded successfully!", fileData);
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

    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await User.findOne({
                where: {
                    email,
                    is_active: 'true',
                    is_deleted: 'false',
                }
            })
            if (!user) {
                throw new error('User not found.')
            }
            const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            user.resetToken = resetToken;
            // user.resetTokenExpiry = new Date() + 3600000;
            const resetTokenExpiry = new Date();
            resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Add 1 hour
            user.resetTokenExpiry = resetTokenExpiry;
            await user.save();

            await emailService.sendResetEmail(user, resetToken);

            successHandler(res, 200, "Email sent", user);
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else if (error.name === 'SequelizeValidationError') {
                errorHandler(res, 400, 'Sequelize_validation_error', error.message);
            } else {
                errorHandler(res, 409, 'forgot_password_error', error.message);
            }
        }
    },

    resetPassword: async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            const user = await User.findOne({
                where: {
                    resetToken: token,
                    resetTokenExpiry: { [Sequelize.Op.gt]: new Date() }
                }
            })
            if (!user) {
                throw new Error('Token is invalid or has expired');
            }
            // console.log(user.access_token);

            const isPasswordMatch = await bycrypt.compare(newPassword, user.password);
            if (isPasswordMatch) {
                throw new Error('New password cannot be the same as the old password');
            }
            const hashedPassword = await bycrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
            await Token.destroy({
                where: { user_id: user.id }
            });
            successHandler(res, 200, "Password reset successful!", user);
            console.log(user)
            // successHandler(res, 200, "Password reset successful!", { access_token: tokenResult.access_token, user });

        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else if (error.name === 'SequelizeValidationError') {
                errorHandler(res, 400, 'Sequelize_validation_error', error.message);
            } else {
                errorHandler(res, 409, 'reset_password_error', error.message);
            }
        }
    },

}