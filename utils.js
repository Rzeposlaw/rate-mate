var express = require('express');
var roles = require('./roles.json');
var session = require('express-session');

module.exports = {
    postRouterErrorHandler: function (req, res) {
        var status;
        if (req.session.authenticated) {
            status = 403;
        } else {
            status = 401;
        }

        res.status(status);
        res.render("error", {
            message: "You need to be logged in.",
            error: {
                status: status
            }
        });
    },
    preRouterErrorHandler: function (req, res, next) {
        if (roles[req.session.role].indexOf("/new-product") != -1) {
            next();
        } else {
            next('router');
        }
    }
};