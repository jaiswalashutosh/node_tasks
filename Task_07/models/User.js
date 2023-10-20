const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.ENUM('true', 'false'),
        defaultValue: 'true',
    },
    is_deleted: {
        type: DataTypes.ENUM('true', 'false'),
        defaultValue: 'false',
    },
    image_name: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    image_address: {
        type: DataTypes.STRING,
        // allowNull: false,
    },
    resetToken: {
        type: DataTypes.STRING,
    },
    resetTokenExpiry: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'users_profile',
    timestamps: true,
});

module.exports = User;