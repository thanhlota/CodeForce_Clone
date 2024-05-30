'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('languages', [
      { name: 'C++' },
      { name: 'JAVA' },
      { name: 'C' },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('languages', null, {});
  }
};
