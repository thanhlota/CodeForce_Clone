"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProblemCategory = sequelize.define('problem_category', {
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
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'categories',
                key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
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
    return ProblemCategory;
}