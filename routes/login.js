var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
var mongoose = db.mongoose;
var User = mongoose.model('User');
var session = require('express-session');
var utils = require('../utils');

var backUrl = utils.backUrl;

router.get('/', function (req, res, next) {
    backUrl = req.header('Referer');
    res.render('login', {message: req.flash('wrongPassword')[0]});
});

router.post('/', function (req, res, next) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (user != null && bcrypt.hashSync(req.body.password, user.salt) === user.passwordHash) {
            req.session.authenticated = true;
            req.session.username = user.username;
            req.session.role = user.role;
            if (backUrl.split('/')[3] == 'login' || backUrl.split('/')[3] == 'register') {
                backUrl = '/';
            }
            res.redirect(backUrl);
        } else {
            req.flash('wrongPassword', 'Login or password are incorrect.')
            res.redirect('login');
        }
    })
});

module.exports = router;