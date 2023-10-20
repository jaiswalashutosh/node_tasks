const User = require('../models/User');
const { Op } = require('sequelize');
const bycrypt = require('bcryptjs');
const { generateAccessToken } = require('../helper/generateAccessToken');
const emailService = require('../helper/emailService');

module.exports = {
    addUser: async (data) => {
        try {
            let { first_name, last_name, email, phone, address, role, password } = data;
            if (!first_name && !last_name && !email && !phone && !address && !role && !password) {
                throw new Error('Bad request: Some data fields missing');
            }
            // email = email.toLowerCase();
            const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
            if (existingUser) {
                throw new Error('Email already exists.')
            }
            const hashedPassword = await bycrypt.hash(password, 10);

            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                phone,
                address,
                role,
                password: hashedPassword,
            });
            await emailService.sendEmailOnRegistration(email, first_name);
            return user;
        } catch (error) {
            console.log(`Could not register user: ${error.message}`);
            throw error;
        }
    },

    fetchUser: async (page, limit, sort, order, search) => {
        try {
            if (page <= 0 || limit <= 0) {
                throw new Error('Invalid page or limit.');
            }
            const offset = (page - 1) * limit;
            const orderDirection = order === 'desc' ? 'DESC' : 'ASC';
            const whereClause = {
                is_active: 'true',
                is_deleted: 'false',
                [Op.or]: [
                    { first_name: { [Op.iLike]: `%${search}%` } },
                    { last_name: { [Op.iLike]: `%${search}%` } },
                    { email: { [Op.iLike]: `%${search}%` } },
                    { phone: { [Op.iLike]: `%${search}%` } }
                ]
            }
            const users = await User.findAll({
                where: whereClause,
                offset,
                limit,
                order: [[sort, orderDirection]],
            });
            if (!users || users.length === 0) {
                throw new Error('No users found.')
            }
            return users;
        } catch (error) {
            console.log(`Could not fetch user: ${error.message}`)
            throw error;
        }
    },

    fetchUserWithId: async (id) => {
        try {
            console.log(id)
            const user = await User.findOne({
                where: {
                    id,
                    is_active: 'true',
                    is_deleted: 'false',
                }
            });
            if (!user) {
                throw new Error("User not found.")
            }
            return user;
        } catch (error) {
            console.log(`Could not fetch user: ${error.message}`);
            throw error;
        }
    },

    fetchAccount: async (id) => {
        try {
            const user = await User.findOne({
                where: {
                    id,
                    is_active: 'true',
                    is_deleted: 'false',
                }
            });
            if (!user) {
                throw new Error("Account not found.")
            }
            return user;
        } catch (error) {
            console.log(`Could not fetch account: ${error.message}`);
            throw error;
        }

    },

    modifyUser: async (id, data) => {
        try {
            let { first_name, last_name, email, phone, address, role, password } = data;
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found.');
            }
            console.log(user.is_active);
            console.log(user.is_deleted)
            if (user.is_active === 'true') {
                if (email && email.toLowerCase() !== user.email) {
                    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
                    if (existingUser) {
                        throw new Error('Email already exists.')
                    }
                    user.email = email.toLowerCase();
                }
                if (password) {
                    const hashedPassword = await bycrypt.hash(password, 10);
                    user.password = hashedPassword;
                }
                user.first_name = first_name;
                user.last_name = last_name;
                user.phone = phone;
                user.address = address;
                user.role = role;
                await user.save();
                return user;
            } else {
                throw new Error('User is not active and cannot be updated.')
            }
        } catch (error) {
            console.log(`Could not update user: ${error.message}`);
            throw error;
        }
    },

    removeUser: async (id) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found.');
            }
            if (user.is_active === 'true') {
                user.is_active = false;
                user.is_deleted = true;
                await user.save();
                return user.toJSON();
            } else {
                throw new Error('User not active or already deleted.');
            }
            // return user.toJSON();
        } catch (error) {
            console.log(`Could not delete user: ${error.message}`);
            throw error;
        }
    },

    authUser: async (data) => {
        try {
            let { email, password } = data;
            if (!email && !password) {
                throw new Error('Bad request: Email or password missing')
            }
            let user = await User.findOne({
                where: {
                    email: email.toLowerCase(),
                    is_active: 'true',
                    is_deleted: 'false',
                }
            });
            if (!user) {
                throw new Error('User does not exist.')
            }
            if (user && (await bycrypt.compare(password, user.password))) {
                console.log(user.role);
                console.log(user.id);
                const tokenData = { email: email.toLowerCase(), role: user.role, id: user.id };
                console.log('TOKEN DATA', tokenData);
                const tokenResult = await generateAccessToken(tokenData);
                user.access_token = tokenResult.access_token;
                console.log(user);
                return { access_token: tokenResult.access_token, user };
            } else {
                throw new Error('Invalid Credentials')
            }
        } catch (error) {
            console.log(`Could not login user: ${error.message}`);
            throw error;
        }
    },

    uploadImage: async (fileRequestData, id) => {
        try {
            console.log(id);
            console.log(fileRequestData);
            const user = await User.findByPk(id);
            if (!user) {
                throw new Error('User not found.');
            }
            if (user.is_active === 'true') {
                user.image_name = fileRequestData.filename;
                user.image_address = fileRequestData.destination;
                await user.save();
                return user
            } else {
                throw new Error('User is not active and cannot be updated.')
            }
        } catch (error) {
            console.log(`Could not upload picture: ${error.message}`);
            throw error;
        }
    },

    // resetPassword: async (id, email) => {
    //     try {

    //     } catch (error) {

    //     }
    // }
}