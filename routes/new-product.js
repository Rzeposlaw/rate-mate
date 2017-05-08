var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');
var fs = require('fs');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

/* GET home page. */
var Product = mongoose.model('Product');


router.get('/', function (req, res, next) {
    res.render('new-product');
});

router.post('/', multipartMiddleware, function (req, res, next) {
    fs.readFile(req.files.productImage.path, function (err, data) {
        var newPath = __dirname + "/../public/uploads/" + req.body.name + ".png";
        console.log(newPath);
        fs.writeFile(newPath, data, function (err) {
            console.log(err);
            res.redirect("/");
        });
    });
});

module.exports = router;
