'use strict';

const { query } = require('express');

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
          problem_id: {
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
            type: Sequelize.DATE
          },
          status:{

          } 
        }, { transaction: t }),
      queryInterface.createTable("results", {

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
