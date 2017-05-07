var express = require('express');
var router = express.Router();
var session = require('express-session');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {user: {authenticated: req.session.authenticated}});
});

module.exports = router;
