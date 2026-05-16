
const Cart = require('../models/cart.model');

class CartManagerMongo {
    
    // 1. Crear carrito vacío
    async createCart() {
        return await Cart.create({ products: [] });
    }

    // 2. Obtener carrito por ID con POPULATE
    async getCartById(id) {
        const cart = await Cart.findById(id).populate('products.product').lean();
        
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }
        return cart;
    }

    // 3. Agregar producto al carrito
    async addProductToCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        return cart;
    }
}

module.exports = CartManagerMongo;