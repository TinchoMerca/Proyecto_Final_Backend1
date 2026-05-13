
const { Router } = require('express');
const CartManager = require('../dao/CartManager');

const router = Router();
const cartManager = new CartManager('carritos.json');

// Endpoint POST: Crear un carrito nuevo (/api/carts)
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: "success", payload: newCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el carrito" });
    }
});

// Endpoint GET: Listar productos de un carrito específico (/api/carts/:cid)
router.get('/:cid', async (req, res) => {
    try {
        const cId = parseInt(req.params.cid);
        const cart = await cartManager.getCartById(cId);
        
        res.json({ status: "success", payload: cart.products });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Endpoint POST: Agregar un producto a un carrito (/api/carts/:cid/products/:pid)
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cId = parseInt(req.params.cid);
        const pId = parseInt(req.params.pid);
        
        const updatedCart = await cartManager.addProductToCart(cId, pId);
        res.json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

module.exports = router;