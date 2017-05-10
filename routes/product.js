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
    console.log(req.body);
    Product.findOne({_id: req.params.productID}, function (err, product) {
        res.render('product', {product: product});
    });
});

module.exports = router;
