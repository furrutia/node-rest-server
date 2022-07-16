const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const { Usuario } = require('../models');

const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
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
            usuario,
            token
        });

    } catch (error) {

        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el Administrador'
        });
    }

}

const googleSignIn = async( req = request, res = response ) => {

    const { id_token } = req.body;

    try {
        
        const { nombre, img, correo } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            //TENGO QUE CREARLO
            const data = { 
                nombre,
                correo,
                password: 'passwordGenerica', //No importa el valor de este campo.
                img,
                google: true,
                rol: 'USER_ROLE'
            };

            usuario = new Usuario ( data );
            await usuario.save();
        }

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        });

    } catch (error) {
        console.log(error);

        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

}

module.exports = { 
    login,
    googleSignIn
};