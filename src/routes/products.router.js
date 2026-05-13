
const { Router } = require('express');
const ProductManager = require('../dao/ProductManager');
const router = Router();

const productManager = new ProductManager('productos.json');

// Endpoint GET: Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({ status: "success", payload: products });
        
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los productos" });

    }
});

// Endpoint POST: Agregar un producto nuevo
router.post('/', async (req, res) => {
    try {
        const productInfo = req.body; 

        if (!productInfo.title || !productInfo.price || !productInfo.code) {
            return res.status(400).json({ status: "error", message: "Faltan campos obligatorios (title, price, code)" });
        }

        const newProduct = await productManager.addProduct(productInfo);

        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al guardar el producto" });
    }
});

// Endpoint GET: Obtener un producto específico por ID 
router.get('/:pid', async (req, res) => {
    try {
        const pId = parseInt(req.params.pid); 
        const product = await productManager.getProductById(pId);
        res.json({ status: "success", payload: product });

    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Endpoint PUT: Actualizar un producto 
router.put('/:pid', async (req, res) => {
    try {
        const pId = parseInt(req.params.pid);
        const productInfo = req.body; 
        
        const updatedProduct = await productManager.updateProduct(pId, productInfo);
        res.json({ status: "success", payload: updatedProduct });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Endpoint DELETE: Eliminar un producto 
router.delete('/:pid', async (req, res) => {
    try {
        const pId = parseInt(req.params.pid);
        await productManager.deleteProduct(pId);
        res.json({ status: "success", message: "Producto eliminado correctamente de MuscleStore" });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

module.exports = router;