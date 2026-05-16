
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

productSchema.plugin(mongoosePaginate);

// Exportamos el modelo 'Product' es el nombre de la colección en la base de datos
module.exports = mongoose.model('Product', productSchema);
