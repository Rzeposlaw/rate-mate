var express = require('express');
var router = express.Router();
var db = require('../db');
var mongoose = db.mongoose;
var roles = require('../roles.json');
var utils = require('../utils');

/* GET users listing. */
var User = mongoose.model('User');
router.use(utils.preRouterErrorHandler);
router.get('/', function (req, res, next) {
    User.find({}, function (err, users) {
        console.log(users);
        res.render('users', {users: users});
    });
});

module.exports = router;
