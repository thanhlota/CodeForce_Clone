"use strict";

module.exports = (sequelize, DataTypes) => {
    const Language = sequelize.define('languages', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        timeLimited: {
            type: DataTypes.INTEGER,
        },
        memoryLimited: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false,
    });
    return Language;
}