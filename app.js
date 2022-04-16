const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');
mongoose.connect('mongodb+srv://rest-api:' + process.env.MONGO_ATLAS_PW + '@cluster0.fqk5z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useMongoClient : true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-control-Allow-Headers','Origin,X-Requested-With,content-Type,Accept,Authorisation');
    if (req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH');
        return res.status(200).json({});
    }
    next();
});

//adding changes
app.use('/products' , productRoutes) ;
app.use('/order' , orderRoutes) ;

app.use ((req,res,next)=> {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error :{
            message : error.message
        }
    });
});



module.exports = app ;
