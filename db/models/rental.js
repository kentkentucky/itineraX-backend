"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rental extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, { foreignKey: "userID" });
    }
  }
  Rental.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      cost: DataTypes.FLOAT,
      image: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      userID: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Rental",
    }
  );
  return Rental;
};
