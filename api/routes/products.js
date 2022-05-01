 const express = require ("express");
 const router = express.Router();
 const Product = require('../models/product');
 const mongoose = require ('mongoose');
 const multer = require('multer');
 const path = require ('path');
 const checkAuth = require ('../middleware/check-auth');
 const ProductsController = require ('../controllers/products');

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


 router.get ('/', ProductsController.products_get_all );

 router.post ('/', checkAuth , upload.single('productImage'), ProductsController.products_create_product );

router.get('/:productId', ProductsController.products_get_product);

router.patch ('/:productId',checkAuth ,ProductsController.product_update_product);

router.delete ('/:productId',checkAuth , ProductsController.product_delete );

module.exports = router;