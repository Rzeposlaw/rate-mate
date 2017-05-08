var express = require('express');
var router = express.Router();
var session = require('express-session')
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var path = require('path');
var db = require('../db');
var mongoose = db.mongoose;
var roles = require('../roles.json');
var Product = mongoose.model('Product');
var utils = require('../utils');

router.use(utils.preRouterErrorHandler);

router.get('/', function (req, res, next) {
    res.render('new-product');
});

router.post('/', multipartMiddleware, function (req, res, next) {
    fs.readFile(req.files.productImage.path, function (err, data) {
        var newPath = path.join(__dirname, "..", "public", "uploads", req.body.name + ".png");
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
            console.log(err);
            new Product({
                name: req.body.name,
                description: req.body.description,
                imagePath: path.join("uploads", req.body.name + ".png"),
                rating: 1,
                numberOfRatings: 0
            }).save(function (err) {
                console.log(err);
                res.redirect('/');
            });
        });
    });
});

module.exports = router;
