const { DataTypes } = require('sequelize');
const  sequelize  = require('../database');

const Empleado = sequelize.define('Empleado',{
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
  idSucursal:{
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_sucursal'
  },
  sueldoBase:{
    type: DataTypes.DECIMAL(10,2),
    field: 'sueldo_base'
  }
}, {
  tableName:'empleados',
  timestamps: false
});



module.exports = Empleado;



