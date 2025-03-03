"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserItinerary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Itinerary, { foreignKey: "itineraryID" });
    }
  }
  UserItinerary.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      userID: DataTypes.UUID,
      itineraryID: DataTypes.UUID,
      isArchived: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "UserItinerary",
    }
  );
  return UserItinerary;
};
