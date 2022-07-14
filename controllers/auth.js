const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');

const login = async( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son ºcorrectos - correo'
            });
        }

        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado: false'
            });
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });            
        }

        const token = await generarJWT( usuario.id );
        
        res.json({
            msg: 'Login ok',
            token
        });

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }

}

module.exports = login;