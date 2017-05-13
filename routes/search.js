var express = require('express');
var router = express.Router();
var db = require('../db');
var mongoose = require('mongoose');

var Product = mongoose.model('Product');

router.get('/', function (req, res, next) {
    res.render('search', {products: [], searchPhrase: ""});
});

router.get('/:name', function (req, res, next) {
    Product.find({name: new RegExp(req.params.name, 'i')}, function (err, products) {
        res.render('search', {products: products, searchPhrase: req.params.name});
    });
});

router.post('/', function (req, res, next) {
    res.redirect('search/' + req.body.name);
});

module.exports = router;