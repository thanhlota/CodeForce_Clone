"use strict"
const CodeStatus = require("../enum/CodeStatus");

module.exports = (sequelize, DataTypes) => {
    const Result = sequelize.define('results', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        submission_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'submissions',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        testcase_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        verdict: {
            type: DataTypes.ENUM(
                CodeStatus.AC,
                CodeStatus.WA,
                CodeStatus.TLE,
                CodeStatus.MLE,
                CodeStatus.RE,
                CodeStatus.CE,
                CodeStatus.SE,
                CodeStatus.TT
            ),
            allowNull: false,
            defaultValue: CodeStatus.TT
        },
        time: {
            type: DataTypes.STRING,
            allowNull: false
        },
        memory: {
            type: DataTypes.STRING,
            allowNull: false
        },
        output: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            default: DataTypes.NOW
        }
    }, {
        timestamps: false,
    });
    return Result;
}