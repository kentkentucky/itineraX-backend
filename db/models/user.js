"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Accomodation);
      this.hasMany(models.Flight);
      this.hasMany(models.Insurance);
      this.hasMany(models.Rental);
      this.hasMany(models.UserEventTicket, { foreignKey: "userID" });
      this.hasMany(models.Invitation, { foreignKey: "senderID" });
      this.hasMany(models.Invitation, { foreignKey: "receiverID" });

      this.belongsToMany(models.Itinerary, {
        through: { model: models.UserItinerary },
      });
      this.belongsToMany(models.Ticket, {
        through: { model: models.UserEventTicket },
        foreignKey: "userID",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      username: DataTypes.STRING,
      email: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
