const express = require('express'); 
const bodyParser = require('body-parser'); 
const cors = require('cors'); 
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sequelize = require('./database'); 
const port = 1919;
const app = express();
const Empleado = require ('./modelos/empleados');
const Nomina = require ('./modelos/Nomina');
const gastos = require ('./modelos/gastos');
const ingresos = require('./modelos/ingresos');
const CierreDia = require('./modelos/cierreDia');
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

Sucursal.hasMany(CierreDia, { foreignKey: 'idSucursal', as: 'cierres' });
CierreDia.belongsTo(Sucursal, { foreignKey: 'idSucursal', as: 'sucursal' });

app.use(bodyParser.json());
app.use(cors());

const logger = (req, res, next) => {
  try{
    const urlObj = new URL(req.originalUrl, `http://${req.headers.host || 'localhost'}`);
    urlObj.searchParams.delete('key');
    const safeUrl = urlObj.pathname + (urlObj.search ? urlObj.search : '');
    const log = `${new Date().toLocaleString()} - ${req.method} ${safeUrl}\n`;
    const ruta = path.join(__dirname, 'log.txt');
    fs.writeFileSync(ruta, log, { flag: 'a' });
  }catch(_e){
  }
  next();
};

const validarApiKey = (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  if (!process.env.API_KEY) {
    return res.status(500).json({
      error: 'Configuración faltante',
      message: 'API_KEY no está configurada en el servidor'
    });
  }

  const apiKey = req.query.key || req.get('x-api-key');
  if (apiKey && apiKey === process.env.API_KEY) return next();

  return res.status(403).json({
    error: 'Acceso prohibido',
    message: 'Se require una API KEY válida'
  });
};

app.use(logger);
app.use('/API', validarApiKey);

async function iniciarServidor(){
  try {
    const forceSync = String(process.env.DB_FORCE_SYNC ?? '').toLowerCase() === 'true';
    await sequelize.sync({ force: forceSync });
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
    const { fecha, monto, concepto, idSucursal, metodoPago } = req.body;
    const nuevoGasto = await gastos.create({
      fecha: fecha,
      monto: monto,
      concepto: concepto,
      idSucursal: idSucursal,
      metodoPago: metodoPago ?? 'efectivo'
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
    const {
      fecha,
      montoEfectivo,
      montoTarjeta,
      montoTransferencia,
      // compat: payload viejo
      montoCuenta,
      idSucursal
    } = req.body;

    const efectivo = Number(montoEfectivo ?? 0);
    const tarjeta = Number(montoTarjeta ?? 0);
    const transferencia = Number(montoTransferencia ?? montoCuenta ?? 0);
    const total = efectivo + tarjeta + transferencia;

    const nuevoIngreso = await ingresos.create({
      fecha: fecha,
      montoEfectivo: efectivo,
      montoTarjeta: tarjeta,
      montoTransferencia: transferencia,
      total,
      idSucursal: idSucursal
    });
    res.status(201).json(nuevoIngreso);
  }catch(error){
    res.status(500).json({ mensaje: 'no se logró registrar el ingreso', detalle: error.message });
  }
});

app.get('/API/CorteDia', async (req, res) => {
  try{
    const {
      fecha,
      idSucursal,
      inicioEfectivo,
      inicioCuenta,
      fondoCaja
    } = req.query;

    if (!fecha) return res.status(400).json({ mensaje: 'Falta el parámetro fecha (YYYY-MM-DD)' });
    if (!idSucursal) return res.status(400).json({ mensaje: 'Falta el parámetro idSucursal' });

    const saldoInicialEfectivo = Number(inicioEfectivo ?? 0);
    const saldoInicialCuenta = Number(inicioCuenta ?? 0);
    const fondo = Number(fondoCaja ?? 0);

    const [ing, eg] = await Promise.all([
      ingresos.findAll({ where: { fecha, idSucursal } }),
      gastos.findAll({ where: { fecha, idSucursal } })
    ]);

    const ingresosDesglose = ing.reduce((acc, i) => {
      acc.efectivo += Number(i.montoEfectivo ?? 0);
      acc.tarjeta += Number(i.montoTarjeta ?? 0);
      acc.transferencia += Number(i.montoTransferencia ?? 0);
      return acc;
    }, { efectivo: 0, tarjeta: 0, transferencia: 0 });
    ingresosDesglose.total = ingresosDesglose.efectivo + ingresosDesglose.tarjeta + ingresosDesglose.transferencia;

    const egresosDesglose = eg.reduce((acc, g) => {
      const metodo = (g.metodoPago ?? 'efectivo');
      const monto = Number(g.monto ?? 0);
      if (metodo === 'tarjeta') acc.tarjeta += monto;
      else acc.efectivo += monto;
      return acc;
    }, { efectivo: 0, tarjeta: 0 });
    egresosDesglose.total = egresosDesglose.efectivo + egresosDesglose.tarjeta;

    const saldoFinalEfectivo = saldoInicialEfectivo + ingresosDesglose.efectivo - egresosDesglose.efectivo;
    const saldoFinalCuenta = saldoInicialCuenta + ingresosDesglose.tarjeta + ingresosDesglose.transferencia - egresosDesglose.tarjeta;

    res.json({
      fecha,
      idSucursal: Number(idSucursal),
      inicio: { efectivo: saldoInicialEfectivo, cuenta: saldoInicialCuenta },
      fondoCaja: fondo,
      ingresos: ingresosDesglose,
      egresos: egresosDesglose,
      final: {
        efectivo: saldoFinalEfectivo,
        cuenta: saldoFinalCuenta,
        efectivoDisponible: saldoFinalEfectivo - fondo
      }
    });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al generar el corte', detalle: error.message });
  }
});

app.get('/API/CorteDia/Inicio', async (req, res) => {
  try{
    const { fecha, idSucursal } = req.query;
    if (!fecha) return res.status(400).json({ mensaje: 'Falta el parámetro fecha (YYYY-MM-DD)' });
    if (!idSucursal) return res.status(400).json({ mensaje: 'Falta el parámetro idSucursal' });

    const d = new Date(`${fecha}T00:00:00`);
    if (Number.isNaN(d.getTime())) return res.status(400).json({ mensaje: 'Fecha inválida' });
    d.setDate(d.getDate() - 1);
    const prev = d.toISOString().slice(0, 10);

    const cierrePrev = await CierreDia.findOne({ where: { fecha: prev, idSucursal } });
    if (!cierrePrev) {
      return res.json({
        fecha,
        idSucursal: Number(idSucursal),
        sugerido: { inicioEfectivo: 0, inicioCuenta: 0 },
        basadoEn: null
      });
    }

    return res.json({
      fecha,
      idSucursal: Number(idSucursal),
      sugerido: {
        inicioEfectivo: Number(cierrePrev.fondoCaja ?? 0),
        inicioCuenta: Number(cierrePrev.finalCuenta ?? 0)
      },
      basadoEn: { fecha: prev, idCierre: cierrePrev.idCierre }
    });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al obtener inicio sugerido', detalle: error.message });
  }
});

app.post('/API/CorteDia', async (req, res) => {
  try{
    const { fecha, idSucursal, inicioEfectivo, inicioCuenta, fondoCaja } = req.body;
    if (!fecha) return res.status(400).json({ mensaje: 'Falta fecha (YYYY-MM-DD)' });
    if (!idSucursal) return res.status(400).json({ mensaje: 'Falta idSucursal' });

    const saldoInicialEfectivo = Number(inicioEfectivo ?? 0);
    const saldoInicialCuenta = Number(inicioCuenta ?? 0);
    const fondo = Number(fondoCaja ?? 0);

    const [ing, eg] = await Promise.all([
      ingresos.findAll({ where: { fecha, idSucursal } }),
      gastos.findAll({ where: { fecha, idSucursal } })
    ]);

    const ingresosDesglose = ing.reduce((acc, i) => {
      acc.efectivo += Number(i.montoEfectivo ?? 0);
      acc.tarjeta += Number(i.montoTarjeta ?? 0);
      acc.transferencia += Number(i.montoTransferencia ?? 0);
      return acc;
    }, { efectivo: 0, tarjeta: 0, transferencia: 0 });
    const ingresosTotal = ingresosDesglose.efectivo + ingresosDesglose.tarjeta + ingresosDesglose.transferencia;

    const egresosDesglose = eg.reduce((acc, g) => {
      const metodo = (g.metodoPago ?? 'efectivo');
      const monto = Number(g.monto ?? 0);
      if (metodo === 'tarjeta') acc.tarjeta += monto;
      else acc.efectivo += monto;
      return acc;
    }, { efectivo: 0, tarjeta: 0 });
    const egresosTotal = egresosDesglose.efectivo + egresosDesglose.tarjeta;

    const saldoFinalEfectivo = saldoInicialEfectivo + ingresosDesglose.efectivo - egresosDesglose.efectivo;
    const saldoFinalCuenta = saldoInicialCuenta + ingresosDesglose.tarjeta + ingresosDesglose.transferencia - egresosDesglose.tarjeta;

    if (fondo > saldoFinalEfectivo) {
      return res.status(400).json({ mensaje: 'fondoCaja no puede ser mayor al efectivo final' });
    }

    const [registro, created] = await CierreDia.findOrCreate({
      where: { fecha, idSucursal },
      defaults: {
        inicioEfectivo: saldoInicialEfectivo,
        inicioCuenta: saldoInicialCuenta,
        fondoCaja: fondo,
        finalEfectivo: saldoFinalEfectivo,
        finalCuenta: saldoFinalCuenta,
        ingresosTotal,
        egresosTotal
      }
    });

    if (!created) {
      await registro.update({
        inicioEfectivo: saldoInicialEfectivo,
        inicioCuenta: saldoInicialCuenta,
        fondoCaja: fondo,
        finalEfectivo: saldoFinalEfectivo,
        finalCuenta: saldoFinalCuenta,
        ingresosTotal,
        egresosTotal
      });
    }

    res.status(created ? 201 : 200).json({
      mensaje: created ? 'Cierre creado' : 'Cierre actualizado',
      data: registro
    });
  }catch(error){
    res.status(500).json({ mensaje: 'Error al guardar el cierre', detalle: error.message });
  }
});

app.get('/API/Validacion/Sucursal', async (req, res) => {
  try{
    const { fecha, inicio, fin, idSucursal } = req.query;
    if (!idSucursal) return res.status(400).json({ mensaje: 'Falta idSucursal' });
    if (!fecha && (!inicio || !fin)) {
      return res.status(400).json({ mensaje: 'Manda fecha (YYYY-MM-DD) o inicio/fin (YYYY-MM-DD)' });
    }

    const whereBase = { idSucursal };
    const whereFechas = fecha ? { fecha } : { fecha: { [Op.between]: [inicio, fin] } };

    const [ing, eg] = await Promise.all([
      ingresos.findAll({ where: { ...whereBase, ...whereFechas } }),
      gastos.findAll({ where: { ...whereBase, ...whereFechas } })
    ]);

    const ingresosTotales = ing.reduce((acc, i) => {
      acc.efectivo += Number(i.montoEfectivo ?? 0);
      acc.tarjeta += Number(i.montoTarjeta ?? 0);
      acc.transferencia += Number(i.montoTransferencia ?? 0);
      return acc;
    }, { efectivo: 0, tarjeta: 0, transferencia: 0 });
    ingresosTotales.total = ingresosTotales.efectivo + ingresosTotales.tarjeta + ingresosTotales.transferencia;

    const egresosTotales = eg.reduce((acc, g) => {
      const metodo = (g.metodoPago ?? 'efectivo');
      const monto = Number(g.monto ?? 0);
      if (metodo === 'tarjeta') acc.tarjeta += monto;
      else acc.efectivo += monto;
      return acc;
    }, { efectivo: 0, tarjeta: 0 });
    egresosTotales.total = egresosTotales.efectivo + egresosTotales.tarjeta;

    res.json({
      idSucursal: Number(idSucursal),
      filtro: fecha ? { fecha } : { inicio, fin },
      conteo: { ingresos: ing.length, gastos: eg.length },
      ingresos: ingresosTotales,
      egresos: egresosTotales,
      registros: {
        ingresos: ing,
        gastos: eg
      }
    });
  }catch(error){
    res.status(500).json({ mensaje: 'Error en validación', detalle: error.message });
  }
});

iniciarServidor();



