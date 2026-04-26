
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ingresos = sequelize.define('ingresos',{
  idIngreso:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_ingreso'
  },
  fecha:{
    type: DataTypes.DATEONLY,
    field: 'fecha'
  },
  montoEfectivo:{
    type: DataTypes.DECIMAL(10,2),
    field: 'efectivo'
  },
  montoTarjeta:{
    type: DataTypes.DECIMAL(10,2),
    field: 'tarjeta'
  },
  montoTransferencia:{
    type: DataTypes.DECIMAL(10,2),
    field: 'transferencia'
  },
  total:{
    type: DataTypes.DECIMAL(10,2)
  },
  idSucursal:{
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_sucursal'
  }
}, {
  tableName: 'ingresos_semanales',
  timestamps: false
});

module.exports = ingresos;

