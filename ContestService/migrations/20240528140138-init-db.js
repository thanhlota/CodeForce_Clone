'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable("contests", {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          start_time: {
            type: Sequelize.DATE,
            allowNull: false
          },
          end_time: {
            type: Sequelize.DATE,
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        },
          {
            transaction: t
          }),
        queryInterface.createTable("problems", {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          contest_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'contests',
              key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE'
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          guide_input: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          guide_output: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          difficulty: {
            type: Sequelize.ENUM('easy', 'medium', 'hard'),
            allowNull: false
          },
          time_limit: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          memory_limit: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        }, {
          transaction: t
        }),
        queryInterface.createTable("testcases", {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          problem_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'problems',
              key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE'
          },
          input: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          expected_output: {
            type: Sequelize.TEXT,
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        }, {
          transaction: t
        }),
        queryInterface.createTable("categories", {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        }),
        queryInterface.createTable("problem_category", {
          problem_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'problems',
              key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
          },
          category_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'categories',
              key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          }
        }),
        queryInterface.createTable("user_contest",{
          user_id: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
          },
          username:{
            type: Sequelize.STRING,
            allowNull: false
          },
          contest_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'contests',
              key: 'id'
            },
            onDelete: 'CASCADE',
            allowNull: false,
            primaryKey: true
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
          },
        })
      ])
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
          queryInterface.dropTable("contests", {
              transaction: t,
          }),
          queryInterface.dropTable("problems", {
              transaction: t,
          }),
          queryInterface.dropTable("testcases", {
              transaction: t,
          }),
          queryInterface.createTable("categories", {
              transaction: t,
          }),
          queryInterface.createTable("problem_category", {
              transaction: t,
          }),
          queryInterface.createTable("user_contest", {
              transaction: t,
          }),
      ]);
  });
  }
};
