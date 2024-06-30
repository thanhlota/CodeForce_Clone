"use strict";

module.exports = (sequelize, DataTypes) => {
  const Submission = sequelize.define('submissions', {
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
    problem_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    verdict: {
      type: DataTypes.ENUM('not_score', 'pass', 'fail'),
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
  return Submission;
}
