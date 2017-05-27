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
    tasteRating: {type: Number, min: 1, max: 5},
    powerRating: {type: Number, min: 1, max: 5},
    dustRating: {type: Number, min: 1, max: 5},
    numberOfRatings: Number
}, {collection: "products"});

var commentSchema = new mongoose.Schema({
    username: String,
    productID: String,
    comment: String,
    date: Date
}, {collection: "comments"});

var ratingSchema = new mongoose.Schema({
    username: String,
    productID: String,
    tasteRating: Number,
    powerRating: Number,
    dustRating: Number,
}, {collection: "ratings"});

mongoose.model('User', userSchema);
mongoose.model('Product', productSchema);
mongoose.model('Comment', commentSchema);
mongoose.model('Rating', ratingSchema);

mongoose.connect(config.url);

module.exports.mongoose = mongoose;