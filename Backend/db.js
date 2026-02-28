var Sequelize = require('sequelize');
require('dotenv').config();

var DB_NAME = process.env.DB_NAME || 'lab_canciones';
var DB_USER = process.env.DB_USER || 'root';
var DB_PASSWORD = process.env.DB_PASSWORD || 'root';
var DB_HOST = process.env.DB_HOST || 'localhost';
var DB_PORT = Number(process.env.DB_PORT || 3306);

var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});

module.exports = sequelize;
