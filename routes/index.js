var express = require('express');
var router = express.Router();
var session = require('express-session');

var db = require('../db');
var mongoose = db.mongoose;
var Product = mongoose.model('Product');

/* GET home page. */
router.get('/', function (req, res, next) {
    Product.find({}).sort({tasteRating: -1}).limit(5).exec(
        function (err, products) {
            res.render('index', {topProducts: products});
        }
    );
});

module.exports = router;
