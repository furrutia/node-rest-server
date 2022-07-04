const mongoose = require('mongoose');
const uri = process.env.MONGODB_CNN; 

const dbConnection = async() => {

    try {
        
        await mongoose.connect(uri);
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD');
    }

}

module.exports = {
    dbConnection
}
