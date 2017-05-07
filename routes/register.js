var express = require('express');
var router = express.Router();
var mongoose = require('../db');
var bcrypt = require('bcrypt');

var User = mongoose.model('User');
var salt = bcrypt.genSaltSync(10);

router.get('/', function (req, res, next) {
    res.render('register');
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    new User({
        userName: req.body.userName,
        passwordHash: bcrypt.hashSync(req.body.password, salt),
        email: req.body.email,
        role: req.body.role
    }).save(function () {
        res.redirect('login');
    });
});

module.exports = router;