
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const ingresos = sequelize.define('ingresos',{
  idIngreso:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_ingreso'
  },
  fechaInicio:{
    type: DataTypes.DATEONLY,
    field: 'fecha_inicio'
  },
  fechaFin:{
    type: DataTypes.DATEONLY,
    field: 'fecha_fin'
  },
  montoCuenta:{
    type: DataTypes.DECIMAL(10,2),
    field: 'cuenta'
  },
  montoEfectivo:{
    type: DataTypes.DECIMAL(10,2),
    field: 'efectivo'
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

