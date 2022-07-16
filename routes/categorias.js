const { Router } = require('express');
const { check } = require('express-validator');
const { categoriasGet, categoriasPost, categoriasGetById, categoriasPut, categoriasDelete } = require('../controllers/categorias');

const { 
    validarCampos,
    validarJWT,
    esAdminRole
} = require('../middlewares');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */
router.get('/', [
    //validarJWT
],categoriasGet);

// Obtener una categoría por ID público
 router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validarCampos
],categoriasGetById);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
],categoriasPost);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),    
    validarCampos
],categoriasPut);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),    
    validarCampos
],categoriasDelete);

module.exports = router;