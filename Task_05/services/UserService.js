const { generateAccessToken } = require('../helper/generateAccessToken');
const User = require('../models/User');
const bycrypt = require('bcryptjs')

module.exports = {
    addUser: async (data) => {
        try {
            let { first_name, last_name, email, phone, address, role, password } = data;
            if (!first_name && !last_name && !email && !phone && !address && !role && !password) {
                throw new Error('Bad request: Some data fields missing');
            }
            email = email.toLowerCase();
            const existingUser = await User.findOne({ where: { email } });
            console.log(existingUser)
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

            return user;
        } catch (error) {
            console.log(`Could not register user: ${error.message}`);
            throw error;
        }
    },

    fetchUser: async () => {
        try {
            const users = await User.findAll();
            if (!users) {
                throw new Error('No users found.');
            }

            return users;
        } catch (error) {
            console.log(`Could not fetch user: ${error.message}`);
            throw error;
        }
    },

    fetchUserWithId: async (id) => {
        try {
            const user = await User.findOne({ where: { id } });
            if (!user) {
                throw new Error("User not found.")
            }

            return user;
        } catch (error) {
            console.log(`Could not fetch user: ${error.message}`);
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
            const deletedUser = { ...user.toJSON() }
            await user.destroy();

            return deletedUser;
        } catch (error) {
            console.log(`Could not delete user: ${error.message}`);
            throw error;
        }
    },

    paginateUser: async (page, limit) => {
        try {
            if (page <= 0 || limit <= 0) {
                throw new Error('Invalid page or limit.');
            }
            const offset = (page - 1) * limit;
            const users = User.findAll({
                offset,
                limit,
            });
            if (!users) {
                throw new Error('Data not found')
            }

            return users;
        } catch (error) {
            console.log(`Could not paginate users: ${error.message}`);
            throw error;
        }
    },

    authUser: async (data) => {
        try {
            let { email, password } = data;
            if (!email && !password) {
                throw new Error('Bad request: Email or password missing')
            }
            let user = await User.findOne({ where: { email: email.toLowerCase() } });
            if (!user) {
                throw new Error('User does not exist.')
            }
            if (user && (await bycrypt.compare(password, user.password))) {
                console.log(user.role);
                console.log(user.id);
                const tokenData = { email: email.toLowerCase(), role: user.role, id: user.id };
                console.log('TOKEN DATA', tokenData)
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
    }
}