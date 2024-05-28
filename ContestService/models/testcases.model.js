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
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.literal('CURRENT_TIMESTAMP')
        }
    }, {
        timestamps: false,
    });
    return Testcase;
}