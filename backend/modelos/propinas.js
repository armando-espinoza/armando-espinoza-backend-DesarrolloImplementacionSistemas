const { DataTypes } = require('sequelize');
const { sequelize } = require('../database.js');

const propinas = sequelize.define('Propina',{
  idPropina:{
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idEmpleado:{
    type: DataTypes.INTEGER,
    field: 'id_empleado',
    allowNull: false
  },
  diasLaborados:{
    type: DataTypes.INTEGER,
    field: 'dias_laborados',
    allowNull: false
  },
  monto:{
    type: DataTypes.FLOAT,
    allowNull: false
  },
  fecha:{
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW
  }
},{
  tableName: 'propinas',
  timestamps: false
});

module.exports = propinas;
