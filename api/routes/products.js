 const express = require ("express");
 const router = express.Router();
 const Product = require('../models/product');
 const mongoose = require ('mongoose');
 const multer = require('multer');
 const path = require ('path');
 const checkAuth = require ('../middleware/check-auth');

const storage = multer.diskStorage({
    destination : (req , file , cb) => {
        cb (null , 'uploads/');
    },
    filename : (req , file , cb) => {
        cb (null , Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req,file,cb) => {
    if ( file.mimetype === 'image/jpeg' || file.mimtype === 'image/png') {
        cb (null ,true);
    } else {
        cb (null ,false);
    }
};

 const upload = multer({
     storage : storage , 
     limits : {
        fileSize : 1024 * 1024 * 5
 },
     fileFilter : fileFilter
});


 router.get ('/', (req, res ,next) => {
     Product.find()
     .select('name price _id productImage')
     .exec()
     .then(docs => {
         const response = {
            count : docs.length ,
            product : docs.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price ,
                    ProductImage : doc.productImage,
                    _id : doc._id,
                    
                    request : {
                        type : 'GET',
                        url : 'http://localhost:3000/products/'+ doc._id
                    }
                }
            })
         };
         console.log(docs);
         res.status(200).json(response);
     })
     .catch(err => {
         console.log (err);
         res.status(500).json({
             error : err
         })
     });
 });

 router.post ('/', checkAuth , upload.single('productImage'), (req, res ,next) => {
     console.log(req.file)
     const product = new Product({
         _id : new mongoose.Types.ObjectId(),
         name : req.body.name,
         price : req.body.price,
         productImage: req.file.path
     });
     product
     .save()
     .then(result => {
         console.log(result);
         res.status(200).json({
            message: 'Created product successfully!',
            createdProduct : {
                name : result.name ,
                price : result.price,
                _id : result._id,
                request : {
                    type : 'GET',
                    url : 'http://localhost:3000/products/'+ result._id
                }
            }
       });
     })
     .catch(err => {
         console.log(err);
         res.status(500).json ({
             error:err
         });
     });
     
     
});

router.get('/:productId',(req,res,next) => {
     const id = req.params.productId;
     Product.findById(id)
     .select('name price _id productImage')
     .exec()
     .then(doc => {
         console.log("From database",doc);
         if (doc){
            res.status(200).json({
                product: doc,
                request : {
                    type : 'GET',
                    descreption : 'get all data ',
                    url : 'http://localhost:3000/products'
                }
            });
         }else{
             res.status(404).json({
                 message : 'no valid entry found for provided ID'
             });
         }
     })
     .catch(err => {
        console.log(err);
        res.status(500).json({error : err});
     });
});

router.patch ('/:productId',(req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id:id},{$set : updateOps})
    .exec()
    .then(result => {
        res.status(200).json({
            message : 'Product updated',
            request : {
                type : 'GET',
                url : 'http://localhost:3000/products/'+id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

router.delete ('/:productId',(req,res,next) => {
    const id = req.params.productId;
    Product.remove({_id:id})
    .exec()
    .then(result => {
        res.status(200).json({ 
            message : 'product deleted ',
            request : {
                type : 'POST', 
                url : 'http://localhost:3000/products',
                body : {name : 'String', price : 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error : err
        });
    });
});

module.exports = router;