const { DataTypes } = require ('sequelize');
const sequelize = require ('../database');

const Sucursal = sequelize.define('Sucursal',{
  idSucursal:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_sucursal'
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'sucursales',
  timestamps: false
});

module.exports = Sucursal;
