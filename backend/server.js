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
const { Op } = require('sequelize');


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
    await sequelize.sync({ force: true });
    console.log(' Base de datos conectada y sincronizada');
    app.listen(port, () => {
      console.log(`Servidor iniciado en el puerto ${ port }`);
    });
  } catch(error) {
    console.error(' Se ha presentado un error:', error);
  }
}

app.get('/API/Nominas/Periodo', async (req, res) => {
  try{
    const { inicio, fin } = req.query;
    if (!inicio || !fin)
      return res.status(400).json({ mensaje: 'Faltan las fechas inicio y fin' });

    const resultados = await Nomina.findAll({
      where: { fecha: { [Op.between]: [inicio, fin] } },
      include: [{ model: Empleado, as: 'empleado', attributes: ['nombre', 'puesto'] }]
    });
    res.json(resultados);
  } catch(error){
    res.status(500).json({ mensaje: 'Error en la consulta', detalle: error.message });
  }
});

app.get('/API/Nominas/Comparar', async (req, res) => {
  try{
    const { mes } = req.query;
    if (!mes)
      return res.status(400).json({ mensaje: 'Falta el parámetro mes (YYYY-MM)' });

    const [anio, numMes] = mes.split('-').map(Number);
    const inicioActual   = new Date(anio, numMes - 1, 1);
    const finActual      = new Date(anio, numMes, 0);
    const inicioAnterior = new Date(anio, numMes - 2, 1);
    const finAnterior    = new Date(anio, numMes - 1, 0);

    const [actual, anterior] = await Promise.all([
      Nomina.findAll({ where: { fecha: { [Op.between]: [inicioActual, finActual] } } }),
      Nomina.findAll({ where: { fecha: { [Op.between]: [inicioAnterior, finAnterior] } } })
    ]);

    const sumar = (lista) => lista.reduce((acc, n) => acc + Number(n.total), 0);
    const totalActual   = sumar(actual);
    const totalAnterior = sumar(anterior);
    const diferencia    = totalActual - totalAnterior;
    const porcentaje    = totalAnterior > 0 ? ((diferencia / totalAnterior) * 100).toFixed(2) : null;

    res.json({
      mesActual:   { periodo: mes, registros: actual.length, total: totalActual },
      mesAnterior: { registros: anterior.length, total: totalAnterior },
      diferencia,
      variacion: porcentaje ? `${porcentaje}%` : 'Sin datos del mes anterior'
    });
  } catch(error){
    res.status(500).json({ mensaje: 'Error al comparar', detalle: error.message });
  }
});

app.get('/API/Nominas/:id', async (req, res) => {
  try{
    const nomina = await Nomina.findByPk(req.params.id, {
      include: [{ model: Empleado, as: 'empleado', attributes: ['nombre', 'puesto'] }]
    });
    if (!nomina) return res.status(404).json({ mensaje: 'Nómina no encontrada' });
    res.json(nomina);
  } catch(error){
    res.status(500).json({ mensaje: 'Error al consultar', detalle: error.message });
  }
});

app.delete('/API/Nominas/:id', async (req, res) => {
  try{
    const filasBorradas = await Nomina.destroy({ where: { idNomina: req.params.id } });
    if (filasBorradas === 0) return res.status(404).json({ mensaje: 'No se encontró la nómina' });
    res.json({ mensaje: 'Eliminado con éxito' });
  } catch(error){
    res.status(500).json({ mensaje: 'Error al eliminar', detalle: error.message });
  }
});

app.get('/API/Nominas', async(req,res)=>{
  try{
    const listarNomina = await Nomina.findAll({
      include:[{
        model: Empleado,
        as: 'empleado',
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
    console.error("Error:", error);
    res.status(500).json({ mensaje: 'Error al consultar', detalle: error.message });
  }
});

app.post('/API/Empleados', async (req,res) =>{
  try {
    const { nombre, puesto, sueldoBase, idSucursal } = req.body; 
    const nuevoEmpleado = await Empleado.create({
      nombre,
      puesto,
      sueldoBase,
      idSucursal 
    });
    res.status(201).json({ mensaje: 'Empleado guardado con éxito', data: nuevoEmpleado });
  } catch(error) {
    res.status(500).json({ mensaje: 'Error al guardar', detalle: error.message });
  }
});

app.get('/API/Empleados/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ mensaje: 'No encontrado' });
    res.json(empleado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al consultar', detalle: error.message });
  }
});

app.delete('/API/Empleados/:id', async (req, res) => {
  try {
    const filasBorradas = await Empleado.destroy({ where: { idEmpleado: req.params.id } });
    if (filasBorradas === 0) return res.status(404).json({ mensaje: 'No se encontró el registro' });
    res.json({ mensaje: 'Eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar', detalle: error.message });
  }
});



app.get('/API/Sucursales', async (req,res) =>{
  try{
    const listarSucursales = await Sucursal.findAll();
    res.json(listarSucursales);
  }catch(error){
    res.status(500).json({ mensaje: 'No se pudo mostrar las sucursales', detalle: error.message });
  }
});

app.post('/API/Sucursales', async (req,res) => {
  try{
    const { nombre, direccion } = req.body;
    const nuevaSucursal = await Sucursal.create({
      nombre:  nombre,
      direccion: direccion
    });
    res.status(201).json(nuevaSucursal);
  }catch(error){
    res.status(500).json({ mensaje: 'No se pudo crear la sucursa solicitada', detalle: error.message });
  }
});

app.get('/API/Sucursales/:id', async (req, res) => {
  try{
    const sucursal = await Sucursal.findByPk(req.params.id);
    if (!sucursal) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
    res.json(sucursal);
  }catch(error){
    res.status(500).json({ mensaje: 'No se pudo mostrar la sucursal', detalle: error.message });
  }
});

app.delete('/API/Sucursales/:id', async (req, res) => {
  try{
    const filasBorradas = await Sucursal.destroy({ where: { idSucursal: req.params.id } });
    if (filasBorradas === 0) return res.status(404).json({ mensaje: 'No se encontró la sucursal' });
    res.json({ mensaje: 'Eliminado con éxito' });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al eliminar', detalle: error.message });
  }
});



app.get('/API/Gastos/Comparar', async (req, res) => {
  try{
    const { mes } = req.query;
    if (!mes)
      return res.status(400).json({ mensaje: 'Falta el parámetro mes (YYYY-MM)' });

    const [anio, numMes] = mes.split('-').map(Number);
    const inicioActual   = new Date(anio, numMes - 1, 1);
    const finActual      = new Date(anio, numMes, 0);
    const inicioAnterior = new Date(anio, numMes - 2, 1);
    const finAnterior    = new Date(anio, numMes - 1, 0);

    const [actual, anterior] = await Promise.all([
      gastos.findAll({ where: { fecha: { [Op.between]: [inicioActual, finActual] } } }),
      gastos.findAll({ where: { fecha: { [Op.between]: [inicioAnterior, finAnterior] } } })
    ]);

    const sumar = (lista) => lista.reduce((acc, g) => acc + Number(g.monto ?? g.total ?? 0), 0);
    const totalActual   = sumar(actual);
    const totalAnterior = sumar(anterior);
    const diferencia    = totalActual - totalAnterior;
    const porcentaje    = totalAnterior > 0 ? ((diferencia / totalAnterior) * 100).toFixed(2) : null;

    res.json({
      mesActual:   { periodo: mes, registros: actual.length, total: totalActual },
      mesAnterior: { registros: anterior.length, total: totalAnterior },
      diferencia,
      variacion: porcentaje ? `${porcentaje}%` : 'Sin datos del mes anterior'
    });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al comparar', detalle: error.message });
  }
});

app.get('/API/Gastos/:id', async (req, res) => {
  try{
    const gasto = await gastos.findByPk(req.params.id);
    if (!gasto) return res.status(404).json({ mensaje: 'Gasto no encontrado' });
    res.json(gasto);
  }catch(error){
    res.status(500).json({ mensaje: 'Error al consultar', detalle: error.message });
  }
});





app.delete('/API/Gastos/:id', async (req, res) => {
  try{
    const filasBorradas = await gastos.destroy({ where: { idGasto: req.params.id } });
    if (filasBorradas === 0) return res.status(404).json({ mensaje: 'No se encontró el gasto' });
    res.json({ mensaje: 'Eliminado con éxito' });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al eliminar', detalle: error.message });
  }
});


app.post('/API/Gastos', async (req, res) => {
  try{
    const { fecha, monto, concepto, idSucursal } = req.body;
    const nuevoGasto = await gastos.create({
      fecha: fecha,
      monto: monto,
      concepto: concepto,
      idSucursal: idSucursal
    });
    res.status(201).json(nuevoGasto);
  }catch(error){
    res.status(500).json({ mensaje: 'No se pudo registrar el gasto', detalle: error.message });
  }
});
app.get('/API/Gastos', async (req,res) =>{
  try{
    const listarGastos = await gastos.findAll();
    res.send(listarGastos);
  }catch(error){
    res.status(500).json({ mensaje: 'No se pudieron listar los gastos', detalle: error.message });
  }
});

app.get('/API/Gastos/Periodo', async (req, res) => {
  try {
    const { inicio, fin } = req.query; 

    if (!inicio || !fin) {
      return res.status(400).json({ mensaje: "Faltan las fechas de inicio o fin" });
    }

    const resultados = await gastos.findAll({
      where: {
        fecha: {
          [Op.between]: [inicio, fin]
        }
      }
    });
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la consulta', detalle: error.message });
  }
});



app.get('/API/Ingresos/Periodo', async (req, res) => {
  try{
    const { inicio, fin } = req.query;
    if (!inicio || !fin)
      return res.status(400).json({ mensaje: 'Faltan las fechas inicio y fin' });

    const resultados = await ingresos.findAll({
      where: { fecha: { [Op.between]: [inicio, fin] } }
    });
    res.json(resultados);
  }catch(error){
    res.status(500).json({ mensaje: 'Error en la consulta', detalle: error.message });
  }
});

app.get('/API/Ingresos/Comparar', async (req, res) => {
  try{
    const { mes } = req.query;
    if (!mes)
      return res.status(400).json({ mensaje: 'Falta el parámetro mes (YYYY-MM)' });

    const [anio, numMes] = mes.split('-').map(Number);
    const inicioActual   = new Date(anio, numMes - 1, 1);
    const finActual      = new Date(anio, numMes, 0);
    const inicioAnterior = new Date(anio, numMes - 2, 1);
    const finAnterior    = new Date(anio, numMes - 1, 0);

    const [actual, anterior] = await Promise.all([
      ingresos.findAll({ where: { fecha: { [Op.between]: [inicioActual, finActual] } } }),
      ingresos.findAll({ where: { fecha: { [Op.between]: [inicioAnterior, finAnterior] } } })
    ]);

    const sumar = (lista) => lista.reduce((acc, i) => acc + Number(i.total), 0);
    const totalActual   = sumar(actual);
    const totalAnterior = sumar(anterior);
    const diferencia    = totalActual - totalAnterior;
    const porcentaje    = totalAnterior > 0 ? ((diferencia / totalAnterior) * 100).toFixed(2) : null;

    res.json({
      mesActual:   { periodo: mes, registros: actual.length, total: totalActual },
      mesAnterior: { registros: anterior.length, total: totalAnterior },
      diferencia,
      variacion: porcentaje ? `${porcentaje}%` : 'Sin datos del mes anterior'
    });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al comparar', detalle: error.message });
  }
});

app.get('/API/Ingresos/:id', async (req, res) => {
  try{
    const ingreso = await ingresos.findByPk(req.params.id);
    if (!ingreso) return res.status(404).json({ mensaje: 'Ingreso no encontrado' });
    res.json(ingreso);
  }catch(error){
    res.status(500).json({ mensaje: 'Error al consultar', detalle: error.message });
  }
});

app.delete('/API/Ingresos/:id', async (req, res) => {
  try{
    const filasBorradas = await ingresos.destroy({ where: { idIngreso: req.params.id } });
    if (filasBorradas === 0) return res.status(404).json({ mensaje: 'No se encontró el ingreso' });
    res.json({ mensaje: 'Eliminado con éxito' });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al eliminar', detalle: error.message });
  }
});

app.get('/API/Ingresos', async (req,res) =>{
  try{
    const ingreso = await ingresos.findAll();
    res.send(ingreso);
  }catch(error){
    res.status(500).json({ mensaje: 'No se logró mostrar todos los ingresos', detalle: error.message });
  }
});

app.post('/API/Ingresos', async (req,res) =>{
  try{
    const { fecha, montoCuenta, montoEfectivo, idSucursal } = req.body;
    const total = montoEfectivo + montoCuenta;
    const nuevoIngreso = await ingresos.create({
      fecha: fecha,
      montoCuenta: montoCuenta,
      montoEfectivo: montoEfectivo,
      total,
      idSucursal: idSucursal
    });
    res.status(201).json(nuevoIngreso);
  }catch(error){
    res.status(500).json({ mensaje: 'no se logró registrar el ingreso', detalle: error.message });
  }
});

iniciarServidor();
