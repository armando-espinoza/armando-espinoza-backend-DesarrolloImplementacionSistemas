//id_ingreso
//fecha_inicio
//hoy
//cuenta
//efectivo
//tarjeta
//total

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
  MontoCuenta:{
    type: DataTypes.FLOAT,
    field: 'cuenta'
  },
  MontoEfectivo:{
    type: DataTypes.FLOAT,
    field: 'efectivo'
  },
  Total:{
    type: DataTypes.FLOAT
  }
}, {
  tableName: 'ingresos_semanales',
  timestamps: false
});

module.exports = ingresos;

