var mongoose = require('mongoose');
var config = require('./secret.json');

var userSchema = new mongoose.Schema({
    userName: String,
    passwordHash: String,
    email: String,
    role: String
}, {collection: "users"});

mongoose.model('User', userSchema);
mongoose.connect(config.url);
module.exports = mongoose;