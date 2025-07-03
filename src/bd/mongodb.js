const mongoose = require('mongoose');

//Controla que ninguna de las 3 variables de entorno en el .env lleguen vacías
['MONGO_ROOT_USERNAME', 'MONGO_ROOT_PASSWORD', 'MONGO_DB_NAME'].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Falta la variable de entorno: ${key}`);
  }
});

//Construí la URI interpolando partes del .env no lo pude construir allí porque .env no reconoce el símbolo "?"
const MONGO_URI = `mongodb://${process.env.MONGO_ROOT_USERNAME}:${process.env.MONGO_ROOT_PASSWORD}@mongo:27017/${process.env.MONGO_DB_NAME}?authSource=admin`;

let isConnected;

const connectToDataBase = async () => {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI);
    console.log("Conexión con Mongo realizada con éxito");
    isConnected = true;
  }
};

module.exports = { mongoose, connectToDataBase };