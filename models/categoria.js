const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    }
});

//ESTE METODO SIRVE PARA QUE CUANDO SE HAGA UN SELECT DEL USUARIO, VENGA SIN LA PASSWORD
CategoriaSchema.methods.toJSON = function () {
    const { __v, _id, estado, ...categoria } = this.toObject();
    return { uid: _id, ...categoria };
}

module.exports = model( 'Categoria', CategoriaSchema );