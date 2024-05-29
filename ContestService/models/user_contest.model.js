"use strict";
const ROLE = require("../enum/role");
module.exports = (sequelize, DataTypes) => {
    const UserContest = sequelize.define('user_contest', {
        user_id: {
            type: DataTypes.INTEGER,
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contest_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'contests',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
    }, {
        indexes: [
            {
                fields: ['username']
            }
        ],
        timestamps: false,
    });
    return UserContest;
}