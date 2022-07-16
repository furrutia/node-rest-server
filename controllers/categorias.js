const { response } = require("express");

const { Categoria } = require('../models');

const categoriasGet = async( req = request, res = esponse ) => {

    const { limite=5, desde=0 } = req.query;
    const filter = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(filter),
        Categoria.find(filter)
            .populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.status(200).json({
        total,
        categorias
    });

}

const categoriasGetById = async( req = request, res = response ) => {

    const id = req.params.id;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    });

}

const categoriasPost = async ( req = request, res = response ) => {

    try {

        console.log('req', req);
        const { estado } = req.body;
        const nombre = req.body.nombre.toUpperCase();
    
        const categoriaDB = await Categoria.findOne({ nombre });
    
        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoría ${ categoriaDB.nombre } ya existe`
            });
        }
    
        const categoria = new Categoria({
            nombre,
            estado,
            usuario: req.usuario._id
        });
    
        //GUARDAR EN BD
        await categoria.save();
        return res.status(201).json({categoria});
        
    } catch (error) {
        return res.status(500).json({
            msg: 'Erro al intentar dar de alta una categoría',
            error
        })
    }

}

const categoriasPut = async( req = request, res = response ) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });
    
    return res.status(201).json({
        msg: 'Categoria Modificada correctamente',
        categoria
    });
}

const categoriasDelete = async( req = request, res = response ) => {

    const { id } = req.params;

    const data = { 
        estado: false,
        usuario: {
            _id: req.usuario._id
        }
    };

    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
        msg: 'Categoria Elminada correctamente',
        categoria
    });

}

module.exports = {
    categoriasGet,
    categoriasGetById,
    categoriasPost,
    categoriasPut,
    categoriasDelete
}