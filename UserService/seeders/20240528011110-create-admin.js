'use strict';
const hashPassword = require("../utils/hashPassword");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const password = await hashPassword("thanhdz");
    await queryInterface.bulkInsert("users", [
      {
        email: "borntobeagymer7@gmail.com",
        password: password,
        role: "admin",
        username: "admin",
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  }
};

