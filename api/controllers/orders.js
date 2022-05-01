const mongoose = require ('mongoose');

const Order = require ('../models/order');
const Product = require ('../models/product');


exports.orders_get_all = (req, res ,next) => {
    Order.find()
    .populate('product','name')
    .select('product quantity _id')
    .exec()
    .then(docs => {
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc => {
                return {
                    id : doc._id,
                    product : doc.product,
                    quantity : doc.quantity,
                    require : {
                        type : 'GET',
                        url : 'http://localhost:3000/orders/'+doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}

exports.orders_create_order = (req, res ,next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product){
            res.status(404).json({
                message : 'product not found'
            });
        }
        const order = new Order({
            _id : mongoose.Types.ObjectId(),
            quantity : req.body.quantity,
            product : req.body.productId
        });
        return order.save()   
    })
    .then(result => {
        console.log(result),
        res.status(201).json({
            message: 'order stored',
            order : {
                id : result._id,
                product: result.product,
                quantity: result.quantity
            },
            require : { 
                type : 'GET',
                url : 'http://localhost:3000/orders/'+result._id
            }
        })
    })
    .catch(err => {
        console.log('err');
        res.status(500).json({
            error : err
        });
    });
}

exports.orders_get_order = (req,res,next)=>{
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if (!order){
            return res.status(404).json({
                message: 'order not found'
            });
        }
        res.status(200).json({
            order : order,
            require : {
                type : 'GET',
                url : 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}

exports.orders_delete_order = (req,res,next)=>{
    Order.remove ({_id : req.params.orderId})
    .exec()
    .then(order => {
        res.status(200).json({
            message:'object deleted',
            require : {
                type : 'POST',
                url : 'http://localhost:3000/',
                body : {productId: 'ID' , quantity:'Number'}
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    });
}