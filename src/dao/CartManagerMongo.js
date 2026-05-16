
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

    // 4. Eliminar un producto específico del carrito
    async deleteProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        await cart.save();
        return cart;
    }

    // 5. Actualizar el carrito completo con un array nuevo
    async updateCart(cartId, productsArray) {
        // FindByIdAndUpdate pisa el array viejo con el nuevo directamente
        const cart = await Cart.findByIdAndUpdate(cartId, { products: productsArray }, { new: true });
        if (!cart) throw new Error("Carrito no encontrado");
        return cart;
    }

    // 6. Actualizar solo la cantidad de un producto
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return cart;
        } else {
            throw new Error("El producto no está en el carrito");
        }
    }

    // 7. Vaciar el carrito por completo
    async clearCart(cartId) {
        // Le pasamos un array vacío para resetearlo
        const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        if (!cart) throw new Error("Carrito no encontrado");
        return cart;
    }
}

module.exports = CartManagerMongo;