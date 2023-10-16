const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const File = sequelize.define('File', {
    file_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    file_size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    file_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'files',
    timestamps: true
});

File.addHook('beforeValidate', (file, options) => {
    if (!file.file_name) {
        throw new Error('Filename is required.')
    }
});

module.exports = File;