var mongoose = require('mongoose');
var config = require('./secret.json');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    salt: String,
    email: String,
    role: String
}, {collection: "users"});

var productSchema = new mongoose.Schema({
    name: String,
    description: String,
    imagePath: String,
    rating: {type: Number, min: 1, max: 10},
    numberOfRatings: Number
}, {collection: "products"});

var commentSchema = new mongoose.Schema({
    userID: Number,
    productID: Number,
    comment: String,
    date: Date
}, {collection: "comments"});

mongoose.model('User', userSchema);
mongoose.model('Product', productSchema);
mongoose.model('Comment', commentSchema);

mongoose.connect(config.url);

module.exports.mongoose = mongoose;