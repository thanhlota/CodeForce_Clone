"use strict";

module.exports = (sequelize, DataTypes) => {
    const Testcase = sequelize.define('testcases', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        problem_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'problems',
                key: 'problem_id'
            },
            allowNull: false,
            onDelete: 'CASCADE'
        },
        isSample: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        input: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        expected_output: {
            type: DataTypes.TEXT,
            allowNull: false
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
    return Testcase;
}