var express = require('express');
var router = express.Router();
var db = require('../db');
var bcrypt = require('bcrypt');
var mongoose = db.mongoose;
var User = mongoose.model('User');

router.get('/', function (req, res, next) {
    res.render('register', {message: req.flash('notMatchingPasswords')[0]});
});

router.post('/', function (req, res, next) {
    console.log(req.body);
    var salt = bcrypt.genSaltSync(10);
    if (req.body.confirmPassword == req.body.password) {
        new User({
            username: req.body.username,
            passwordHash: bcrypt.hashSync(req.body.password, salt),
            email: req.body.email,
            salt: salt,
            role: req.body.role
        }).save(function () {
            res.redirect('login');
        });
    } else {
        req.flash("notMatchingPasswords", "Password doesn't match confirmation.");
        res.redirect('register');
    }
});

module.exports = router;