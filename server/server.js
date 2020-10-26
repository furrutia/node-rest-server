require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//CONFIGURACIÓN GLOBAL DE RUTAS
app.use(require('./routes/index'));

const connectDB = async(urlDB) => {

    const resp = await mongoose.connect(urlDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }, (err, resp) => {

        if (err) throw err;

        console.log(`resp=> base de datos ONLINE`);

    });

}

// connectDB(`mongodb://localhost:27017/cafe`);
connectDB(process.env.URLDB);



app.listen(port, () => {
    console.log(`Escuchando el puerto ${port}`);
});