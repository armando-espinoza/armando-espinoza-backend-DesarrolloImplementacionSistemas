const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const CierreDia = sequelize.define('cierre_dia', {
  idCierre: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_cierre'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  idSucursal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_sucursal'
  },
  inicioEfectivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'inicio_efectivo'
  },
  inicioCuenta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'inicio_cuenta'
  },
  fondoCaja: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'fondo_caja'
  },
  finalEfectivo: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'final_efectivo'
  },
  finalCuenta: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'final_cuenta'
  },
  ingresosTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'ingresos_total'
  },
  egresosTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'egresos_total'
  }
}, {
  tableName: 'cierres_dia',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['fecha', 'id_sucursal']
    }
  ]
});

module.exports = CierreDia;

