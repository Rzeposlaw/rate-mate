/**
 * Created by robertt240 on 5/8/17.
 */
var express = require('express');
var router = express.Router();
var session = require('express-session');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('products');
});

module.exports = router;
