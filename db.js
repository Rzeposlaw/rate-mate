var mongoose = require('mongoose');
var config = require('./secret.json');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var userSchema = new mongoose.Schema({
    username: String,
    passwordHash: String,
    salt: String,
    email: String,
    role: String
}, {collection: "users"});

var productsSchema = new mongoose.Schema({
    id: Number,
    name: String,
    description: String,
    imagePath: String,
    rating: Number
}, {collection: "products"});

mongoose.model('User', userSchema);
mongoose.model('Product', productsSchema);

mongoose.connect(config.url);

module.exports.mongoose = mongoose;
module.exports.salt = salt;