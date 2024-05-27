"use strict";
const ROLE  =require("../enum/role");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM(ROLE.ADMIN, ROLE.USER),
      allowNull: false,
      defaultValue: ROLE.USER
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    indexes: [
      {
        fields: ['username']
      }
    ],
    timestamps: false,
    tableName: 'users',
  });
  return User;
}
