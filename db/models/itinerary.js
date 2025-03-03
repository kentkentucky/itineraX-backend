"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Itinerary extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.User, {
        through: { model: models.UserItinerary },
      });

      this.hasMany(models.Event);
      this.hasMany(models.Invitation, { foreignKey: "itineraryID" });
    }
  }
  Itinerary.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
      creatorID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Itinerary",
    }
  );
  return Itinerary;
};
