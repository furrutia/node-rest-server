const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'El nombre es obligatorio']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
}, {
    versionKey: false // You should be aware of the outcome after set to false 
});


module.exports = mongoose.model('Categoria', categoriaSchema);