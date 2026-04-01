//id_gast
//concepto
//monto
//fecha
//pagado sí o no
//metodo_pago

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
  fecha:{
    type: DataTypes.DATEONLY,
    allowNull: false
  }
}, {
  tableName:'gastos',
  timestamps: false
});

module.exports = gastos;
