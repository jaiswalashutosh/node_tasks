const userService = require('../services/UserService');
const { successHandler, errorHandler } = require('../helper/responseHandler');

module.exports = {
    postUser: async (req, res, next) => {
        try {
            const data = req.body;
            if (data !== undefined && data !== null && Object.keys(data).length > 0) {
                const userData = await userService.addUser(data);
                if (userData) {
                    successHandler(res, 200, "User added successfully!", userData);
                }
            }
            else {
                errorHandler(res, 400, 'user_addition_error', 'Form data missing');
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
            const userData = await userService.fetchUser();
            if (userData) {
                successHandler(res, 200, "Users data fetched successfully!", userData);
            }
        } catch (error) {
            // res.status(500).json({ error: error })
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else if (error.code === 'ENOENT') {
                errorHandler(res, 404, 'file_not_found', error.message)
            } else {
                errorHandler(res, 404, 'users_not_found', error.message);
            }
        }
    },

    getUserWithId: async (req, res, next) => {
        try {
            const { id } = req.params;
            console.log(id);
            if (id) {
                const userData = await userService.fetchUserWithId(id);
                if (userData) {
                    successHandler(res, 200, "User fetched successfully!", userData);
                }
            } else {
                errorHandler(res, 400, 'user_not_found', 'User id missing')
            }
        } catch (error) {
            if (error.code === 500) {
                errorHandler(res, 500, 'server_error', error.message);
            } else if (error.code === 'ENOENT') {
                errorHandler(res, 404, 'file_not_found', error.message)
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
            console.log(id);
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

    // paginateUser: async (req, res, next) => {
    //     try {

    //     } catch (error) {

    //     }
    // }
}