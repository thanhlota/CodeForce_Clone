"use strict";

module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define('categories', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        indexes: [
            {
                fields: ['name']
            }
        ],
        timestamps: false,
    });
    return Category;
}