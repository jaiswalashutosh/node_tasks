const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const User = require('./User');

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    // accessTokenExpiry: {
    //     type: DataTypes.DATE,
    // },
}, {
    tableName: 'access_tokens',
    timestamps: true,
});


module.exports = Token;