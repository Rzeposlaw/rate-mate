var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');

var Product = mongoose.model('Product');

router.get('/', function (req, res, next) {
    Product.find({}, function (err, products) {
        res.render('products', {products: products});
    });
});


module.exports = router;
