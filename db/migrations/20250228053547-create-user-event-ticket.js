"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserEventTickets", {
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
      eventID: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Events",
          },
          key: "id",
        },
      },
      ticketID: {
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: "Tickets",
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
    await queryInterface.dropTable("UserEventTickets");
  },
};
