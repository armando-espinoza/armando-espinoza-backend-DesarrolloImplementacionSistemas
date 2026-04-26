
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const gastos = sequelize.define('gastos',{
  idGasto:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: 'id_gasto'
  },
  concepto:{
    type: DataTypes.STRING,
    allowNull: false
  },
  monto:{
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  metodoPago:{
    type: DataTypes.ENUM('efectivo', 'tarjeta'),
    allowNull: false,
    defaultValue: 'efectivo',
    field: 'metodo_pago'
  },
  idSucursal:{
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_sucursal'
  },
  fecha:{
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName:'gastos',
  timestamps: false
});

module.exports = gastos;
