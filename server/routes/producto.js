const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();
let Producto = require('../models/producto');



//===================================
//Mostrar todos los productos
//===================================
app.get('/productos', verificaToken, (req, res) => {

    //trae todos los productos
    //populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);


    Producto.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });

});

//===================================
//Mostrar un producto por ID
//===================================
app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre', 'estado']);

    //populate: usuario categoria
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });


});

//===================================
//Buscar productos
//===================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    //trae todos los productos
    //populate: usuario categoria
    //paginado

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ nombre: regex })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })

        });

});


//===================================
//Crear nuevo producto
//===================================
app.post('/productos', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    });

});

//===================================
//Actualizar un producto
//===================================
app.put('/productos/:id', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;
    let productoUpdate = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    };

    Producto.findByIdAndUpdate(id, productoUpdate, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });



});

//===================================
//Borrar un producto
//===================================
app.delete('/productos/:id', verificaToken, (req, res) => {

    //disponible: false
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        })

    });


});


module.exports = app;