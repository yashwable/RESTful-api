const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');


app.use('/products' , productRoutes) ;
app.use('/order' , orderRoutes) ;

module.exports = app ;
