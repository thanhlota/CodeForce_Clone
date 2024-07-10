'use strict';
const Verdict = require("../enum/Verdict");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rankings', {
      contest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      user_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_score: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.createTable('submissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      contest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      problem_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      verdict: {
        type: Sequelize.ENUM(
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
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rankings');
    await queryInterface.dropTable('submissions');
  }
};