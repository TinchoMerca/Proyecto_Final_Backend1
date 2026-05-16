
const { Router } = require('express');
const ProductManagerMongo = require('../dao/ProductManagerMongo');

const router = Router();
const productManager = new ProductManagerMongo();

router.get('/products', async (req, res) => {
    try {
        const result = await productManager.getProducts({}, { limit: 10, lean: true });
        
        res.render('products', { 
            productos: result.docs,
            titulo: "Catálogo de Suplementos"
        });
    } catch (error) {
        res.status(500).send("Error al cargar la vista");
    }
});

module.exports = router;