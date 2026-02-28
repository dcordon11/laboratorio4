var Sequelize = require('sequelize');
var sequelize = require('../db');

//para que jale el sqlize
var Song = sequelize.define(
  'Song',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    artista: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
  },
  {
    tableName: 'songs',
    timestamps: false,
  }
);

module.exports = Song;
