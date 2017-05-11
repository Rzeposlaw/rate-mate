var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');
var utils = require('../utils');

var Product = mongoose.model('Product');
var Comment = mongoose.model('Comment');

var Rating = mongoose.model('Rating');


router.get('/:productID', function (req, res, next) {
    Product.findOne({_id: req.params.productID}, function (err, product) {
        Comment.find({productID: product._id}, function (err, comments) {
            res.render('product', {product: product, comments: comments});
        });
    });
});

router.post('/:productID', function (req, res, next) {
    if (!req.session.authenticated) {
        utils.postRouterErrorHandler(req, res);
    } else {
        console.log("body " + req.body.star);
        Rating.findOne({username: req.session.username, productID: req.params.productID}, function (err, rating) {
            console.log(rating);
            if (rating === null) {
                new Rating({
                    username: req.session.username,
                    productID: req.params.productID,
                    rating: parseInt(req.body.star)
                }).save(function (err) {
                    Product.findOne({_id: req.params.productID}, function (err, product) {
                        var newRating = (product.rating * product.numberOfRatings + parseInt(req.body.star)) / (product.numberOfRatings + 1);
                        product.rating = newRating;
                        product.numberOfRatings += 1;
                        product.save(function (err) {
                            console.log(product);
                            res.redirect('/product/' + req.params.productID);
                        })
                    });
                });
            } else {
                var oldRating = rating.rating;
                rating.rating = parseInt(req.body.star);
                rating.rating.save(function (err) {
                    Product.findOne({_id: req.params.productID}, function (err, product) {
                        var newRating = (product.rating * product.numberOfRatings + parseInt(req.body.star) - oldRating) / (product.numberOfRatings);
                        product.rating = newRating;
                        product.save(function (err) {
                            console.log(product);
                            res.redirect('/product/' + req.params.productID);
                        })
                    });
                })
            }
        });
    }
});

module.exports = router;
