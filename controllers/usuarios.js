const { response, request } = require('express');

const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async(req = request, res = response) => {
    
    const { limite = 5, desde = 0 } = req.body;
    const filter = { estado: true };

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(filter),
        Usuario.find(filter)
            .skip( Number(desde) )
            .limit( Number(limite) )
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password, rol } = req.body;

    const usuario = new Usuario({
        nombre,
        correo, 
        password,
        rol
    });

    // ENCRIPTAR LA CONTRASEÑA
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync( password, salt );

    //GUARDAR EN BD
    await usuario.save();

    res.json({usuario})
}

const usuariosPut = async(req = request, res = response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
   
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }
    
    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json(usuario);
}
 
const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - Controlador'
    })
}

const usuariosDelete = async(req = request, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    res.json({
        usuario
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}