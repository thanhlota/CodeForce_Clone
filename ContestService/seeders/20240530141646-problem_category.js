'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('categories', [
      { type: 'Dynamic Programming', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Graph Theory', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Sorting and Searching', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Data Structures', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Greedy Algorithms', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Backtracking', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Divide and Conquer', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Mathematics', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Number Theory', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Bit Manipulation', createdAt: new Date(), updatedAt: new Date() },
      { type: 'String Manipulation', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Recursion', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Tree Traversal', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Hashing', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Geometry', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Combinatorics', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Game Theory', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Network Flow', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Computational Geometry', createdAt: new Date(), updatedAt: new Date() },
      { type: 'Machine Learning', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Categories', null, {});
  }
};
