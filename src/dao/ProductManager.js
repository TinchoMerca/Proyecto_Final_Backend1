
const fs = require('fs').promises; 
const path = require('path');

class ProductManager {
    constructor(fileName) {
        this.path = path.join(__dirname, '..', 'data', fileName);
    }

    // 1. Método privado para leer el archivo (Reutilizable)
    async #readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data); 
        } catch (error) {
            return [];
        }
    }

    // 2. Método privado para escribir en el archivo (Reutilizable)
    async #writeFile(data) {
        
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    // --- MÉTODOS PÚBLICOS ---

    async getProducts() {
        return await this.#readFile();
    }

    async addProduct(product) {
        const products = await this.#readFile();

        let newId = 1;
        if (products.length > 0) {
            newId = products[products.length - 1].id + 1;
        }

        const newProduct = {
            id: newId,
            ...product,      
            status: true      
        };

        products.push(newProduct);
        await this.#writeFile(products);

        return newProduct; 
    }

    async getProductById(id) {
        const products = await this.#readFile();
        const product = products.find(p => p.id === id);
        
        if (!product) {
            throw new Error("Producto no encontrado");
        }

        return product;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        if (updatedFields.id) {
            delete updatedFields.id; 
        }

        products[index] = { ...products[index], ...updatedFields };
        
        await this.#writeFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        let products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        products = products.filter(p => p.id !== id);
        await this.#writeFile(products);
    }
}

module.exports = ProductManager;