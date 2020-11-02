let verificarExtension = (req, res, next) => {

    // Extensiones permitidas
    let extensiones = ['png', 'jpg', 'jpeg', 'gif'];

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;

    let partesNombreArchivo = archivo.name.split('.');
    let ext = partesNombreArchivo[partesNombreArchivo.length - 1];

    evaluar(req, res, next, extensiones, ext, "Las extensiones permitidas son", ext);
}

let verificarTipo = (req, res, next) => {
    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    let tipo = req.params.tipo;
    evaluar(req, res, next, tiposValidos, tipo, "Los tipos permitidos son");
}

let evaluar = (req, res, next, arrValidos, valor, msj, ext) => {
    if (arrValidos.indexOf(valor) < 0) {
        return res.status(400).json({
            ok: false,
            message: `${msj}: ${arrValidos.join(', ')}`,
            valor
        });
    } else {
        req.extArchivo = ext
        next();
    }
}

module.exports = {
    verificarExtension,
    verificarTipo
}