
const Product = require('../models/product.model'); // Importamos el modelo estricto que creamos

class ProductManagerMongo {
    
    // Obtener todos los productos 
    async getProducts(filter = {}, options = {}) {
        // filter: las condiciones de búsqueda (ej: category: "Suplementos")
        // options: página, límite, ordenamiento, etc.
        const result = await Product.paginate(filter, options);
        return result;
    }

    // Obtener un producto por ID
    async getProductById(id) {
        const product = await Product.findById(id).lean();
        if (!product) {
            throw new Error("Producto no encontrado en la base de datos");
        }
        return product;
    }

    // Agregar un producto nuevo
    async addProduct(productData) {
        const newProduct = await Product.create(productData);
        return newProduct;
    }

    // Actualizar un producto
    async updateProduct(id, updatedFields) {
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true }).lean();
        
        if (!updatedProduct) {
            throw new Error("Producto no encontrado para actualizar");
        }
        return updatedProduct;
    }

    // Eliminar un producto
    async deleteProduct(id) {
        const deletedProduct = await Product.findByIdAndDelete(id).lean();
        
        if (!deletedProduct) {
            throw new Error("Producto no encontrado para eliminar");
        }
        return deletedProduct;
    }
}

module.exports = ProductManagerMongo;