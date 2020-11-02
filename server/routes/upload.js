const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const { verificarExtension, verificarTipo } = require('../middlewares/upload');
const fs = require('fs');
const path = require('path');
const modelos = {
    usuarios: require('../models/usuario'),
    productos: require('../models/producto')
}

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', [verificarTipo, verificarExtension], function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    let archivo = req.files.archivo;
    let extension = req.extArchivo;
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds }.${ extension }` // Cambiar nombre al archivo

    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se ha seleccionado ningún archivo'
                }
            });
    }

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        manejarImagen(id, res, nombreArchivo, tipo);

    });
});

const manejarImagen = (id, res, nombre, tipo) => {

    modelos[tipo].findById(id, (err, registroBD) => {

        if (err) {
            borraArchivo(nombre, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!registroBD) {
            borraArchivo(nombre, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: `${ tipo } no existe`
                }
            });
        }

        borraArchivo(registroBD.img, tipo);

        registroBD.img = nombre;

        registroBD.save((err, registroGuardado) => {
            res.json({
                ok: true,
                usuario: registroGuardado,
                img: nombre
            });
        });

    });

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}


module.exports = app;