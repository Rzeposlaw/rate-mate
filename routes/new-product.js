/**
 * Created by robertt240 on 5/8/17.
 */
/**
 * Created by robertt240 on 5/8/17.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');
var mongoose = require('mongoose');

/* GET home page. */
var Product = mongoose.model('Product');

router.get('/', function (req, res, next) {
    res.render('new-product');
});

module.exports = router;
