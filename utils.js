var express = require('express');
var roles = require('./roles.json');
var session = require('express-session');

var backUrl = '/';

module.exports = {
    postRouterErrorHandler: function (req, res) {
        var status;
        var message;
        if (req.session.authenticated) {
            status = 403;
            message = "You don't have suitable permission to perform this action."
        } else {
            message = "You need to be logged in.";
            status = 401;
        }

        res.status(status);
        res.render("error", {
            message: message,
            error: {
                status: status
            }
        });
    },
    preRouterErrorHandler: function (req, res, next) {
        if (roles[req.session.role].indexOf(req.originalUrl.split('/')[1]) != -1) {
            next();
        } else {
            next('router');
        }
    },
    backUrl: backUrl
};