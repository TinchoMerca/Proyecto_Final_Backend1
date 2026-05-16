
const mongoose = require('mongoose');

// Definimos las reglas estrcitas de nuestro documento
const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnails: { type: Array, default: [] }
});

// Exportamos el modelo 'Product' es el nombre de la colección en la base de datos
module.exports = mongoose.model('Product', productSchema);
