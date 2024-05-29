"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProblemLanguage = sequelize.define('problem_language', {
        problem_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'problems',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
        },
        language_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'languages',
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
        timestamps: false,
    });
    return ProblemLanguage;
}