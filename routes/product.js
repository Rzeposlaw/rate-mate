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
                    var powerStarsArray = [false, false, false, false, false];
                    var tasteStarsArray = [false, false, false, false, false];
                    var dustStarsArray = [false, false, false, false, false];

                } else {
                    var starsArray = [];
                    var powerStarsArray = [];
                    var tasteStarsArray = [];
                    var dustStarsArray = [];
                    for (var i = 0; i < 5; i++) {
                        powerStarsArray.push(false);
                        tasteStarsArray.push(false);
                        dustStarsArray.push(false);
                    }
                    powerStarsArray[rating.powerRating - 1] = true;
                    tasteStarsArray[rating.tasteRating - 1] = true;
                    dustStarsArray[rating.dustRating - 1] = true;
                }
                res.render('product', {
                    product: product,
                    comments: comments,
                    powerStars: powerStarsArray,
                    tasteStars: tasteStarsArray,
                    dustStars: dustStarsArray,
                    powerRating: Math.round(product.powerRating * 100) / 100,
                    tasteRating: Math.round(product.tasteRating * 100) / 100,
                    dustRating: Math.round(product.dustRating * 100) / 100

                });

            });
        });
    });
});

router.post('/:productID', function (req, res, next) {
    if (!req.session.authenticated) {
        next('router');
    } else {
        console.log(req.body);
        if (req.body.tasteStar != undefined && req.body.powerStar != undefined && req.body.dustStar != undefined) {
            Rating.findOne({username: req.session.username, productID: req.params.productID}, function (err, rating) {
                if (rating === null) {
                    new Rating({
                        username: req.session.username,
                        productID: req.params.productID,
                        powerRating: parseInt(req.body.powerStar),
                        tasteRating: parseInt(req.body.tasteStar),
                        dustRating: parseInt(req.body.dustStar)
                    }).save(function (err) {
                        Product.findOne({_id: req.params.productID}, function (err, product) {
                            var newPowerRating = (product.powerRating * product.numberOfRatings + parseInt(req.body.powerStar)) / (product.numberOfRatings + 1);
                            var newDustRating = (product.dustRating * product.numberOfRatings + parseInt(req.body.dustStar)) / (product.numberOfRatings + 1);
                            var newTasteRating = (product.tasteRating * product.numberOfRatings + parseInt(req.body.tasteStar)) / (product.numberOfRatings + 1);

                            product.powerRating = newPowerRating;
                            product.tasteRating = newTasteRating;
                            product.dustRating = newDustRating;
                            console.log("number of ratings: " + product.numberOfRatings);
                            console.log("power star: " + parseInt(req.body.powerStar));
                            console.log("powerrating: " + newPowerRating);

                            product.numberOfRatings += 1;
                            product.save(function (err) {
                                console.log(product);
                                res.redirect('/product/' + req.params.productID);
                            })
                        });
                    });
                } else {
                    var oldPowerRating = rating.powerRating;
                    var oldDustRating = rating.dustRating;
                    var oldTasteRating = rating.tasteRating;

                    rating.powerRating = parseInt(req.body.powerStar);
                    rating.tasteRating = parseInt(req.body.tasteStar);
                    rating.dustRating = parseInt(req.body.dustStar);


                    rating.save(function (err) {
                        Product.findOne({_id: req.params.productID}, function (err, product) {
                            var newPowerRating = (product.powerRating * product.numberOfRatings + parseInt(req.body.powerStar) - oldPowerRating)
                                / (product.numberOfRatings);
                            var newDustRating = (product.dustRating * product.numberOfRatings + parseInt(req.body.dustStar) - oldDustRating)
                                / (product.numberOfRatings);
                            var newTasteRating = (product.tasteRating * product.numberOfRatings + parseInt(req.body.tasteStar) - oldTasteRating)
                                / (product.numberOfRatings);
                            product.powerRating = newPowerRating;
                            product.tasteRating = newTasteRating;
                            product.dustRating = newDustRating;
                            console.log(newDustRating);
                            product.save(function (err) {
                                console.log(product);
                                res.redirect('/product/' + req.params.productID);
                            })
                        });
                    })
                }
            });
        } else {
            res.redirect('/product/' + req.params.productID);
        }
    }
});


router.post('/:productID/comment', function (req, res, next) {
    if (req.session.authenticated) {
        if (req.body.comment != '') {
            new Comment({
                username: req.session.username,
                productID: req.params.productID,
                comment: req.body.comment,
                date: new Date()
            }).save(function (err) {
                res.redirect('/product/' + req.params.productID);
            })
        } else {
            res.redirect('/product/' + req.params.productID);
        }
    }
    else {
        next('router');
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
