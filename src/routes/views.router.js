
const { Router } = require('express');
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const CartManagerMongo = require('../dao/CartManagerMongo');
const cartManager = new CartManagerMongo();

const router = Router();
const productManager = new ProductManagerMongo();

router.get('/products', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;

        const result = await productManager.getProducts({}, { limit, page, lean: true });

        res.render('products', {
            productos: result.docs,
            titulo: "Catálogo de Suplementos",
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista");
    }
});

// Ruta para ver el detalle de un solo producto
router.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const producto = await productManager.getProductById(pid);

        res.render('productDetail', { producto });
    } catch (error) {
        res.status(404).send("Producto no encontrado");
    }
});

// Ruta para ver un carrito específico
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const carrito = await cartManager.getCartById(cid);
        
        res.render('cart', { 
            carrito: carrito,
            titulo: "Tu Carrito de Compras" 
        });
    } catch (error) {
        res.status(404).send("Carrito no encontrado");
    }
});

module.exports = router;