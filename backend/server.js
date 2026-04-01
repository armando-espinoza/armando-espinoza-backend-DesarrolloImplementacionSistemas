const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
const sequelize = require('./database'); 
const port = 1919;
const app = express();
const Nomina = require('./modelos/Nomina'); 
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
//Rutas para la API
//Nominas
app.get('/API/Nominas', async(req,res)=>{
  try{
    const listarNomina = await Nomina.findAll();
    res.json(listarNomina);
  } catch(error){
    res.status(500).json({ mensaje: 'error al obtener los datos', error });
  }
});

app.post('/API/Nominas', async(req,res)=>{
  try{
    const { idEmpleado,diasLaborados,pagoDiario,total,fecha } = req.body;
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body completo:', req.body);  
    const nuevaNomina = await Nomina.create({
      idEmpleado: idEmpleado,
      diasLaborados: diasLaborados,
      pagoDiario: pagoDiario,
      total: total,
      fecha: fecha
    });

    res.status(201).json({ mensaje:'Nomina guardada con éxito', data: nuevaNomina });
  } catch(error){
    res.status(500).json({ mensaje: 'Error al guardar', datelle: error.message });
  }
});

//empleados


iniciarServidor();
