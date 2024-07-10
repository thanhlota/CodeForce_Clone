'use strict';

const CodeStatus = require("../enum/CodeStatus");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable("submissions", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          user_name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          problem_id: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          contest_id: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          code: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          language: {
            type: Sequelize.STRING,
            allowNull: false
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          verdict: {
            allowNull: false,
            type: Sequelize.STRING
          },
          time: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          memory: {
            type: Sequelize.INTEGER,
            allowNull: false
          }
        }, { transaction: t }),
        queryInterface.createTable("results", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          submission_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'submissions',
              key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false
          },
          testcase_id: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          verdict: {
            type: Sequelize.ENUM(
              CodeStatus.AC,
              CodeStatus.WA,
              CodeStatus.TLE,
              CodeStatus.MLE,
              CodeStatus.RE,
              CodeStatus.CE,
              CodeStatus.SE,
              CodeStatus.TT
            ),
            allowNull: false,
            defaultValue: CodeStatus.TT
          },
          time: {
            type: Sequelize.STRING,
            allowNull: false
          },
          memory: {
            type: Sequelize.STRING,
            allowNull: false
          },
          input: {
            allowNull: false,
            type: Sequelize.TEXT
          },
          output: {
            allowNull: false,
            type: Sequelize.TEXT
          },
          expected_output: {
            allowNull: false,
            type: Sequelize.TEXT
          },
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        }, { transaction: t })
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable("results", {
        transaction: t
      });
      await queryInterface.dropTable("submissions", {
        transaction: t
      })
    })
  }
};
