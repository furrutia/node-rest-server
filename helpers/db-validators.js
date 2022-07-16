const Role = require('../models/role');
const { Usuario, Categoria } = require('../models');

// VERIFICO SI EXISTE EL ROL
const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol){
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    };
}

// VERIFICAR SI EL CORREO EXISTE
const emailExiste = async(correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo ${ correo } ya se encuentra registrado en la BD`);
    };
}

// VERIFICAR SI EXISTE LA CATEGORIA
const existeUsuarioPorId = async( id ) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id ${ id } no existe`);
    };
}

const existeCategoriaPorId = async( id ) => {
    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`La categoría ${ id } no existe`);
    }
}

module.exports = { 
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId
};

