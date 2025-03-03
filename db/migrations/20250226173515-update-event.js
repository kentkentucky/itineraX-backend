"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.removeColumn("Events", "date");
    await queryInterface.changeColumn("Events", "start", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn("Events", "end", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.addColumn("Events", "date", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.changeColumn("Events", "start", {
      type: Sequelize.TIME,
      allowNull: true,
    });
    await queryInterface.changeColumn("Events", "end", {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },
};
