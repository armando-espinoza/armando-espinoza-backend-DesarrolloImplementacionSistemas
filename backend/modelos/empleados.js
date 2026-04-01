const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const empleados = sequelize.define('empleados',{
  idEmpleado:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_empleado'
  },
  nombre:{
    type: DataTypes.STRING,
    allowNull: false
  },
  puesto:{
    type: DataTypes.STRING,
    allowNull: false
  },
  sueldoBase:{
    type: DataTypes.FLOAT,
    field: 'sueldo_base'
  }
}, {
  tableName:'empleados',
  timestamps: false
});
module.exports = empleados;



