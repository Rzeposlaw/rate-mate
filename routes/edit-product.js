/**
 * Created by robertt240 on 5/13/17.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var multipart = require('connect-multiparty');
var fs = require('fs');
var path = require('path');

var utils = require('../utils');

var db = require('../db');
var mongoose = db.mongoose;
var Product = mongoose.model('Product');
var multipartMiddleware = multipart();

/* GET home page. */
router.get('/:productID', function (req, res, next) {
    Product.findOne({_id: req.params.productID}, function (err, product) {
        console.log(product);
        res.render('edit-product', {product: product});
    });
});

router.post('/:productID', multipartMiddleware, function (req, res, next) {
    if (req.session.role != 'admin') {
        Product.findOne({_id: req.params.productID}, function (err, product) {
            product.description = req.body.description;
            product.name = req.body.name;
            if (req.files.productImage.size > 0) {
                fs.readFile(req.files.productImage.path, function (err, data) {
                    var newPath = path.join(__dirname, "..", "public", product.imagePath);
                    fs.writeFile(newPath, data, function (err) {
                        console.log(err);
                        product.save(function (err) {
                            res.redirect('/product/' + req.params.productID)
                        })
                    });
                });
            } else {
                product.save(function (err) {
                    res.redirect('/product/' + req.params.productID)
                })
            }
        });
    }
    else {
        utils.postRouterErrorHandler(req, res);
    }
});

module.exports = router;
