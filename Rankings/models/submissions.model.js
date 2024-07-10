"use strict";
const Verdict = require("../enum/Verdict");

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
      type: DataTypes.ENUM(
        Verdict.AC,
        Verdict.WA,
        Verdict.TLE,
        Verdict.MLE,
        Verdict.RE,
        Verdict.CE,
        Verdict.SE,
      ),
      allowNull: true
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
