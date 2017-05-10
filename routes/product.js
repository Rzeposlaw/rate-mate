var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');

var Product = mongoose.model('Product');

router.get('/:productID', function (req, res, next) {
    Product.findOne({_id: req.params.productID}, function (err, product) {
        res.render('product', {product: product});
    });
});

router.post('/:productID', function (req, res, next) {
    console.log("body " + req.body.star);
    Product.findOne({_id: req.params.productID}, function (err, product) {
    });
    //return res.send("");
});

module.exports = router;
