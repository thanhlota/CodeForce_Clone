"use strict";

module.exports = (sequelize, DataTypes) => {
  const Ranking = sequelize.define('rankings', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
