"use strict";

module.exports = (sequelize, DataTypes) => {
  const Contest = sequelize.define('contests', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false
      }
  }, {
    indexes: [
      {
        fields: ['name']
      }
    ],
    timestamps: false,
  });
  return Contest;
}