"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserEventTicket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserEventTicket.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userID: DataTypes.UUID,
      eventID: DataTypes.UUID,
      ticketID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "UserEventTicket",
    }
  );
  return UserEventTicket;
};
