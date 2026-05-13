
const fs = require('fs').promises;
const path = require('path');

class CartManager {
    constructor(fileName) {
        this.path = path.join(__dirname, '..', 'data', fileName);
    }

    // Métodos privados para leer y escribir
    async #readFile() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async #writeFile(data) {
        await fs.writeFile(this.path, JSON.stringify(data, null, 2));
    }

    // 1. Crear un carrito nuevo vacío
    async createCart() {
        const carts = await this.#readFile();
        
        let newId = 1;
        if (carts.length > 0) {
            newId = carts[carts.length - 1].id + 1;
        }

        const newCart = {
            id: newId,
            products: [] 
        };

        carts.push(newCart);
        await this.#writeFile(carts);
        
        return newCart;
    }

    // 2. Obtener un carrito por su ID
    async getCartById(id) {
        const carts = await this.#readFile();
        const cart = carts.find(c => c.id === id);
        
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

    // 3. Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        const carts = await this.#readFile();
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex === -1) {
            throw new Error("Carrito no encontrado");
        }

        const productIndex = carts[cartIndex].products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            carts[cartIndex].products[productIndex].quantity += 1;

        } else {
            carts[cartIndex].products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.#writeFile(carts);
        return carts[cartIndex];
    }
}

module.exports = CartManager;