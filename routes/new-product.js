var express = require('express');
var router = express.Router();
var session = require('express-session')
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

var db = require('../db');
var mongoose = db.mongoose;
var roles = require('../roles.json');
var Product = mongoose.model('Product');

router.use(function (req, res, next) {
        if (roles[req.session.role].indexOf("/new-product") != -1) {
            next();
        } else {
            next('router');
        }
    }
)
;
router.get('/', function (req, res, next) {
    res.render('new-product');
});

router.post('/', multipartMiddleware, function (req, res, next) {
    fs.readFile(req.files.productImage.path, function (err, data) {
        var newPath = __dirname + "/../public/uploads/" + req.body.name + ".png";
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
            console.log(err);
            new Product({
                name: req.body.name,
                description: req.body.description,
                imagePath: newPath,
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
