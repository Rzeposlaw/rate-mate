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

            Rating.findOne({productID: product._id, username: req.session.username}, function (err, rating) {
                if (rating == null) {
                    starsArray = [false, false, false, false, false];
                } else {
                    var starsArray = [];
                    for (var i = 0; i < 5; i++) {
                        starsArray.push(false);
                    }
                    starsArray[rating.rating - 1] = true;
                    console.log(starsArray);
                }
                res.render('product', {product: product, comments: comments, stars: starsArray, rating: Math.round(product.rating * 100) / 100});

            });
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
                rating.save(function (err) {
                    Product.findOne({_id: req.params.productID}, function (err, product) {
                        var newRating = (product.rating * product.numberOfRatings + parseInt(req.body.star) - oldRating)
                            / (product.numberOfRatings);
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



router.post('/:productID/comment', function (req, res, next) {
    if (req.session.authenticated) {
        new Comment({
            username: req.session.username,
            productID: req.params.productID,
            comment: req.body.comment,
            date: new Date()
        }).save(function (err) {
            res.redirect('/product/' + req.params.productID);
        })
    }
    else {
        utils.postRouterErrorHandler(req, res);
    }

});

router.post('/:productID/remove', function (req, res, next) {
    if (req.session.role == 'admin') {
        Product.find({_id: req.params.productID}).remove().exec();
        res.redirect('/products');
    }
    else {
        utils.postRouterErrorHandler(req, res);
    }
});

router.post('/:productID/remove/:commentID', function (req, res, next) {
    if (req.session.role == 'admin') {
        Comment.find({_id: req.params.commentID}).remove().exec();
        res.redirect('/product/' + req.params.productID);
    }
    else {
        utils.postRouterErrorHandler(req, res);
    }
});

module.exports = router;
