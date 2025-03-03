require("dotenv").config();

module.exports = {
  development: {
    username: process.env.SQL_USERNAME,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    host: process.env.SQL_HOST,
    dialect: process.env.SQL_DIALECT,
    seederStorage: "sequelize",
  },
};
