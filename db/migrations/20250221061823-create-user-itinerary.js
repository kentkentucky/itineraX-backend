"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserItineraries", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userID: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      itineraryID: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Itineraries",
          },
          key: "id",
        },
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
    await queryInterface.dropTable("UserItineraries");
  },
};
