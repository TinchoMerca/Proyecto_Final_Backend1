
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const { Server } = require('socket.io'); 

const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');
const viewsRouter  = require('./routes/views.router')

const app = express();
const PORT = process.env.PORT || 8080

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

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a la base de datos MongoDB'))
    .catch((error) => console.error('Error al conectar a MongoDB:', error));

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);

app.set('io', io);

// Escuchamos cuando un cliente se conecta
io.on('connection', (socket) => {
    console.log('Un nuevo cliente se ha conectado:', socket.id);
    
    // Si el cliente se desconecta (cierra la pestaña)
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});