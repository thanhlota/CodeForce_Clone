"use strict";

module.exports = (sequelize, DataTypes) => {
  const Ranking = sequelize.define('rankings', {
    contest_id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_score: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  });
  return Ranking;
}
