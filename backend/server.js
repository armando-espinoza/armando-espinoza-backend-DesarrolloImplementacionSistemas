const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const sequelize = require('./database'); 
const port = 1919;
const app = express();
const Empleado = require ('./modelos/empleados');
const Nomina = require ('./modelos/Nomina');
const gastos = require ('./modelos/gastos');
const ingresos = require('./modelos/ingresos');
const Sucursal = require('./modelos/Sucursales');

Empleado.hasMany(Nomina,{ foreignKey: 'idEmpleado', as: 'nominas' });
Nomina.belongsTo(Empleado,{ foreignKey: 'idEmpleado', as: 'empleado' });

Sucursal.hasMany(Empleado,{ foreignKey: 'idSucursal', as: 'empleados' });
Empleado.belongsTo(Sucursal,{ foreignKey: 'idSucursal', as: 'sucursal' });

Sucursal.hasMany(gastos,{ foreignKey: 'idSucursal', as: 'gastos' });
gastos.belongsTo(Sucursal, { foreignKey: 'idSucursal', as: 'sucursal' });

Sucursal.hasMany(ingresos,{ foreignKey: 'idSucursal', as: 'ingresos' });
ingresos.belongsTo(Sucursal,{ foreignKey: 'idSucursal', as: 'sucursal' });

app.use(bodyParser.json());
app.use(cors());

async function iniciarServidor(){
  try {
    await sequelize.sync({ force: false });
    console.log(' Base de datos conectada y sincronizada');
    
    app.listen(port, () => {
      console.log(`Servidor iniciado en el puerto ${ port }`);
    });
  } catch(error) {
    console.error(' Se ha presentado un error:', error);
  }
}
app.get('/API/Nominas', async(req,res)=>{
  try{
    const listarNomina = await Nomina.findAll({
      include:[{
        model: Empleado,
        attributes: ['nombre','puesto']
      }]
    });
    res.json(listarNomina);
  } catch(error){
  console.error(error);
  res.status(500).json({
    mensaje: 'Error al obtener los datos',
    causa: error.message
  });
  }
});

app.post('/API/Nominas', async(req,res)=>{
  try{
    const { idEmpleado,diasLaborados,pagoDiario,fecha } = req.body;
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body completo:', req.body); 
    const total = pagoDiario * diasLaborados;
    const nuevaNomina = await Nomina.create({
      idEmpleado: idEmpleado,
      diasLaborados: diasLaborados,
      pagoDiario: pagoDiario,
      total,
      fecha: fecha
    });

    res.status(201).json({ mensaje:'Nomina guardada con éxito', data: nuevaNomina });
  } catch(error){
    res.status(500).json({ mensaje: 'Error al guardar', detalle: error.message });
  }
});

app.get('/API/Empleados', async (req,res) =>{
  try{
   const listarEmpleados = await Empleado.findAll();
   res.json(listarEmpleados); 
  }catch(error){
   res.status(500).json({ mensaje: 'Error al consultar', detalle: error.message });
  }
});

app.post('/API/Empleados', async (req,res) =>{
  try{
    const { nombre,puesto,sueldoBase } = req.body;
    console.log({'Body Completo': req.body });
    const nuevoEmpleado = await Empleado.create({
      nombre: nombre,
      puesto: puesto,
      sueldoBase: sueldoBase
    });
    res.status(201).json({ mensaje: 'Empleado guardado con éxito', data: nuevoEmpleado });
  }catch(error){
    res.status(500).json({ mensaje: 'No se ha podido guardar el empleado solicitado', detalle: error.message });
  }
});



iniciarServidor();
