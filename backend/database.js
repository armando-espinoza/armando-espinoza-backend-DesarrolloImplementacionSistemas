const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('proyectogladys','postgres','123',{
  host: 'localhost',
  dialect: 'postgres'
});

async function conectar(){
  try{
    await sequelize.authenticate();
    console.log('Conexión éxitosa a la base de datos.');
  }catch(error){
    console.error('Error de conexión',error);
  }
}

conectar();

module.exports = sequelize;

