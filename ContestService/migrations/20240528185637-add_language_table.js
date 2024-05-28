'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable("languages", {
          id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false
          },
          timeLimited: {
            type: Sequelize.INTEGER,
          },
          memoryLimited: {
            type: Sequelize.INTEGER,
          }
        }, {
          transaction: t
        }),
        queryInterface.createTable("problem_language", {
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
          language_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'languages',
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
    await queryInterface.dropTable("languages");
  }
};
