"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Invitations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
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
      senderID: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      receiverID: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM("Pending", "Accepted", "Declined"),
        defaultValue: "Pending",
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
    await queryInterface.dropTable("Invitations");
  },
};
