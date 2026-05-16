
const express = require('express');
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter  = require('./routes/views.router')

const app = express();
const PORT = 8080;

//Handlebars
app.engine('hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views'); 

// Middlewares base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

// Ruta de prueba (Health check)
app.get('/ping', (req, res) => {
    res.send('¡Servidor de MuscleStore funcionando!');
});

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Inicialización del servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});