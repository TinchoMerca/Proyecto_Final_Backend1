
const { Router } = require('express');
const router = Router();
/* const ProductManager = require('../dao/ProductManager');
const productManager = new ProductManager('productos.json'); */
const ProductManagerMongo = require('../dao/ProductManagerMongo');
const productManager = new ProductManagerMongo();

// Endpoint GET: Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            if (query === 'true' || query === 'false') {
                filter.status = query === 'true';
            } else {
                filter.category = query;
            }
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            lean: true
        };

        if (sort === 'asc') {
            options.sort = { price: 1 };
        } else if (sort === 'desc') {
            options.sort = { price: -1 };
        }

        const result = await productManager.getProducts(filter, options);

        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl.split('?')[0];

        const prevLink = result.hasPrevPage
            ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
            : null;

        const nextLink = result.hasNextPage
            ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
            : null;

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        });

    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al obtener los productos" });
    }
});

// Endpoint POST: Agregar un producto nuevo
router.post('/', async (req, res) => {
    try {
        const productInfo = req.body;

        if (!productInfo.title || !productInfo.price || !productInfo.code) {
            return res.status(400).json({ status: "error", message: "Faltan campos obligatorios" });
        }

        const newProduct = await productManager.addProduct(productInfo);

        const io = req.app.get('io');
        io.emit('productoAgregado', newProduct);
        res.status(201).json({ status: "success", payload: newProduct });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Error al guardar el producto" });
    }
});

// Endpoint GET: Obtener un producto específico por ID 
router.get('/:pid', async (req, res) => {
    try {
        const pId = req.params.pid;
        const product = await productManager.getProductById(pId);
        res.json({ status: "success", payload: product });

    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

// Endpoint PUT: Actualizar un producto 
router.put('/:pid', async (req, res) => {
    try {
        const pId = req.params.pid;
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
        const pId = req.params.pid;
        await productManager.deleteProduct(pId);
        res.json({ status: "success", message: "Producto eliminado correctamente de MuscleStore" });
    } catch (error) {
        res.status(404).json({ status: "error", message: error.message });
    }
});

module.exports = router;