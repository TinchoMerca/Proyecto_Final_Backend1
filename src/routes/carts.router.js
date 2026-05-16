
const { Router } = require('express');
const CartManagerMongo = require('../dao/CartManagerMongo');

const router = Router();
const cartManager = new CartManagerMongo();

// Crear un carrito nuevo
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: "success", payload: newCart });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al crear el carrito" });
    }
});

// Listar productos de un carrito
router.get('/:cid', async (req, res) => {
    try {
        const cId = req.params.cid;
        const cart = await cartManager.getCartById(cId);
        
        res.json({ status: "success", payload: cart.products });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cId = req.params.cid;
        const pId = req.params.pid; 
        
        const updatedCart = await cartManager.addProductToCart(cId, pId);
        res.json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

module.exports = router;