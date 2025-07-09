require("dotenv").config();
const express = require ('express');
const {connectToDataBase} = require('./bd/mongodb');
const cors = require ('cors');
const app = express(); 
const path = require('path');


const PORT = process.env.PORT || 3009;
const morgan = require("morgan");

app.use(morgan("tiny"));

///Swagger
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

//Ruta del swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const { userRoute, postRoute, postImageRoute, tagRoute, commentRoute } = require('./routes'); 

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(cors());

// Usa las rutas de post con el prefijo /post
app.use('/post', postRoute);
app.use('/user', userRoute);
app.use('/post-image', postImageRoute);
app.use('/comment', commentRoute);
app.use('/tag', tagRoute);

// Importamos Redis
const redisClient = require('./redis/redis');

(async () => {
  try {
    await redisClient.connect();
    console.log("Redis conectado correctamente");

    await connectToDataBase();
    console.log("Mongo conectado correctamente");

    app.listen(PORT, () => {
      console.log(`La app se inició en el puerto http://0.0.0.0:${PORT}`);
    });

  } catch (err) {
    console.error("Error iniciando la app:", err);
    process.exit(1);
  }
})();
