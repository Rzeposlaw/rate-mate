/**
 * Created by robertt240 on 5/11/17.
 */
var express = require('express');
var router = express.Router();
var db = require('../db');
var mongoose = db.mongoose;
var roles = require('../roles.json');
var utils = require('../utils');

/* GET users listing. */
var Rating = mongoose.model('Rating');
router.use(utils.preRouterErrorHandler);
router.get('/', function (req, res, next) {
    Rating.find({username: req.session.username}, function (err, ratings) {
        console.log(ratings);
        res.render('ratings', {ratings: ratings});
    });
});

module.exports = router;