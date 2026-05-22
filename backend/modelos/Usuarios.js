const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Usuario = sequelize.define('Usuario', {
  idUsuario: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'idUsuario' 
  },
  nombreUsuario: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contrasnaUsuario: { 
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;
