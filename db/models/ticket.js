"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Type, { foreignKey: "typeID" });

      this.belongsToMany(models.User, {
        through: { model: models.UserEventTicket },
        foreignKey: "ticketID",
      });
      this.belongsToMany(models.Event, {
        through: { model: models.UserEventTicket },
        foreignKey: "ticketID",
      });

      this.hasMany(models.UserEventTicket, { foreignKey: "ticketID" });
    }
  }
  Ticket.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
      image: DataTypes.STRING,
      cost: DataTypes.FLOAT,
      typeID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );
  return Ticket;
};
