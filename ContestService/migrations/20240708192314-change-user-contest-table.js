'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Xoá bảng user_contest nếu nó tồn tại
    await queryInterface.dropTable('user_contest');

    // Tạo bảng user_contests
    await queryInterface.createTable('user_contests', {
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true
      },
      username: {
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Xoá bảng user_contests
    await queryInterface.dropTable('user_contests');

    // Tạo lại bảng user_contest
    await queryInterface.createTable('user_contest', {
      user_id: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        primaryKey: true
      },
      username: {
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
    });
  },
};