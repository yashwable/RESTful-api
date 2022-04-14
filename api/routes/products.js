 const express = require ("express");
 const router = express.Router();

 router.get ('/', (req, res ,next) => {
     res.status(200).json({
         message: 'Handling GET requst to /products'
     });
 });

 router.post ('/', (req, res ,next) => {
    res.status(200).json({
        message: 'Handling POST requst to /products'
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