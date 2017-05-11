var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
var mongoose = db.mongoose;
var User = mongoose.model('User');
var session = require('express-session');

var backUrl = '/';
router.get('/', function (req, res, next) {
    backURL=req.header('Referer');
    res.render('login');
});

router.post('/', function (req, res, next) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (bcrypt.hashSync(req.body.password, user.salt) === user.passwordHash) {
            req.session.authenticated = true;
            req.session.username = user.username;
            req.session.role = user.role;
            res.redirect(backURL);
        } else {
            res.redirect('login');
        }
    })
});

module.exports = router;