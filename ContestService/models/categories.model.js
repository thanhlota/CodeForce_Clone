"use strict";

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('categories', {
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        timestamps: false,
    });
    return Category;
}