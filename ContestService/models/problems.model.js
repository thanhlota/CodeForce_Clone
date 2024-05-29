"use strict";

module.exports = (sequelize, DataTypes) => {
    const Problem = sequelize.define('problems', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        contest_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'contests',
                key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE'
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        guide_input: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        guide_output: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        difficulty: {
            type: DataTypes.ENUM('easy', 'medium', 'hard'),
            allowNull: false
        },
        time_limit: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        memory_limit: {
            type: DataTypes.INTEGER,
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
        indexes: [
            {
                fields: ['title']
            }
        ],
        timestamps: false,
    });
    return Problem;
}