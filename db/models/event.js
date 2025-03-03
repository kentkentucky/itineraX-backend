"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Itinerary, { foreignKey: "itineraryID" });

      this.belongsToMany(models.User, {
        through: { model: models.UserEventTicket },
      });
      this.belongsToMany(models.Ticket, {
        through: { model: models.UserEventTicket },
      });

      this.hasMany(models.UserEventTicket, { foreignKey: "eventID" });
    }
  }
  Event.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      location: DataTypes.STRING,
      itineraryID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
