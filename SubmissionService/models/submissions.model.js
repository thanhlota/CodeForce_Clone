"use strict";

module.exports = (sequelize, DataTypes) => {
    const Submission = sequelize.define('submissions', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        user_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        contest_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        code: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            default: DataTypes.NOW
        },
        verdict: {
            allowNull: false,
            type: DataTypes.STRING
        }
    },
        {
            timestamps: false,
        });
    return Submission;
}