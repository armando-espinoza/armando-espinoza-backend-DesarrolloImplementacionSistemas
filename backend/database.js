const { Sequelize } = require('sequelize');

require('dotenv').config(); 
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  }
);
async function conectar(){
  try{
    await sequelize.authenticate();
    console.log('Conexión éxitosa a la base de datos.');
  }catch(error){
    console.error('Error de conexión',error);
  }
}

conectar();

module.exports =  sequelize ;

