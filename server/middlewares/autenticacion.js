const jwt = require('jsonwebtoken');

// ===================
// Verificar Token
// ===================
let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token inválido'
                }
            })
        }

        req.usuario = decoded.usuario;

        next();

    });
};

// ===================
// Verificar AdminRole
// ===================
let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    console.log('usuario', usuario);
    console.log('usuario.role', usuario.role);

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        })
    }

};


module.exports = {
    verificaToken,
    verificaAdminRole
};