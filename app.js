var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var products = require('./routes/products');
var new_product = require('./routes/new-product');
var product = require('./routes/product');
var utils = require('./utils');
var search = require('./routes/search');
var ratings = require('./routes/ratings');
var edit_product = require('./routes/edit-product');


var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
    secret: '/7PaL/6TFrwHxV?)',
    resave: false,
    saveUninitialized: true,
}));
app.use(flash());

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/product', express.static(path.join(__dirname, 'public')));
app.use('/search', express.static(path.join(__dirname, 'public')));
app.use('/product/:productID', express.static(path.join(__dirname, 'public')));
app.use('/edit-product/:productID', express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    if (req.session.role === undefined) {
        req.session.role = "unauthorized";
        req.session.authenticated = false;
    }
    next();
});
app.use(function (req, res, next) {
    res.locals.user = {
        authenticated: req.session.authenticated,
        role: req.session.role,
        username: req.session.username
    };
    next();
});
app.use('/', index);
app.use('/users', users, utils.postRouterErrorHandler);
app.use('/register', register);
app.use('/login', login);
app.use('/logout', logout);
app.use('/products', products, utils.postRouterErrorHandler);
app.use('/product', product);
app.use('/new-product', new_product, utils.postRouterErrorHandler);
app.use('/search', search);
app.use('/ratings', ratings, utils.postRouterErrorHandler);
app.use('/edit-product', edit_product, utils.postRouterErrorHandler);



app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;