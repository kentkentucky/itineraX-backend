"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Rentals", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      cost: {
        type: Sequelize.FLOAT,
      },
      image: {
        type: Sequelize.STRING,
      },
      start: {
        type: Sequelize.DATE,
      },
      end: {
        type: Sequelize.DATE,
      },
      userID: {
        type: Sequelize.UUID,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Rentals");
  },
};
