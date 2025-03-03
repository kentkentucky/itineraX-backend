"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invitation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "senderID",
        as: "sender",
      });
      this.belongsTo(models.User, {
        foreignKey: "receiverID",
        as: "receiver",
      });
      this.belongsTo(models.Itinerary, {
        foreignKey: "itineraryID",
      });
    }
  }
  Invitation.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      itineraryID: DataTypes.UUID,
      senderID: DataTypes.UUID,
      receiverID: DataTypes.UUID,
      status: DataTypes.ENUM("Pending", "Accepted", "Declined"),
    },
    {
      sequelize,
      modelName: "Invitation",
    }
  );
  return Invitation;
};
