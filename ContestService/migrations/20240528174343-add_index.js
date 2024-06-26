'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('contests', ['name']);
    await queryInterface.addIndex('problems', ['title']);
    await queryInterface.addIndex('user_contest', ['username']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('user_contest', ['username']);
    await queryInterface.removeIndex('contests', ['name']);
    await queryInterface.removeIndex('problems', ['title']);
  }
};
