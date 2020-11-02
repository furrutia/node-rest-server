const express = require('express');
const _ = require('underscore');

let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categoria');


//===================================
//Mostrar todas las categorías
//===================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            })

        });

});

//===================================
//Mostrar una categoría por ID
//===================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'estado']);

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//===================================
//Crear nueva categoría
//===================================
app.post('/categoria', verificaToken, (req, res) => {
    //REGRESA NUEVA CATEGORIA
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });



});

//===================================
//Actualizar una categoría
//===================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //REGRESA LA CATEGORIA ACTUALIZADA

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'estado']);
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

//===================================
//Borra una categoría por ID
//===================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //SOLO UN ADMINISTRADOR PUEDE BORRAR CATEGORIAS
    let id = req.params.id;

    // let cambiaEstado = {
    //     estado: false
    // };

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        //Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err: `Error: ${err}`
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada/Id no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });


});

module.exports = app;