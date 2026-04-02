const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Nomina = sequelize.define('Nomina', {
  idNomina: {
    type: DataTypes.INTEGER,
    field: 'id_nomina',
    primaryKey: true,
    autoIncrement: true
  },
  idEmpleado: {
    type: DataTypes.INTEGER,
    field: 'id_empleado',
    allowNull: false,
  },
  diasLaborados: {
    type: DataTypes.FLOAT,
    field: 'dias_laborados',
    allowNull: false
  },
  pagoDiario: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'pago_por_dia',
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'total'
  },
  fecha: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'nominas',
  timestamps: false
});





module.exports = Nomina;
