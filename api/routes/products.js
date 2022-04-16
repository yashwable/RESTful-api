 const express = require ("express");
 const router = express.Router();
 const Product = require('../models/product');
 const mongoose = require ('mongoose');


 router.get ('/', (req, res ,next) => {
     res.status(200).json({
         message: 'Handling GET requst to /products'
     });
 });

 router.post ('/', (req, res ,next) => {
     const product = new Product({
         _id : new mongoose.Types.ObjectId(),
         name : req.body.name,
         price : req.body.price
     });
     product
     .save()
     .then(result => {
         console.log(result);
     })
     .catch(err => console.log(err));
     
     res.status(200).json({
         message: 'Handling POST requst to /products',
         createdProduct : product
    });
});

router.get('/:productId',(req,res,next) => {
     const id = req.params.productId;
     if (id === 'special'){
        res.status(200).json({
             message : 'you discovered a special id',
             id: id
        });
     }else{
        res.status(200).json({
             message : 'you discovered id'
        });
    }
});

router.patch ('/:product',(req,res,next) => {
     res.status(200).json({
         message : 'update product!'
    });
});

router.delete ('/:product',(req,res,next) => {
     res.status(200).json({
         message : 'deleted product!'
    });
});

module.exports = router;