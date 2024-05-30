"use strict";

module.exports = (sequelize, DataTypes) => {
    const ProblemCategories = sequelize.define('problem_categories', {
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
        category_type: {
            type: DataTypes.STRING,
            references: {
                model: 'categories',
                key: 'type'
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
    return ProblemCategories;
}