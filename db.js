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

mongoose.model('User', userSchema);
mongoose.connect(config.url);

module.exports.mongoose = mongoose;
module.exports.salt = salt;