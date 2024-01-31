const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        alphanumeric: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100,
        alphanumeric: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 100,
        alphanumeric: true
    },
    role: {
        type: String,
        default : "Basic",
        required: true
    }
});

module.exports = mongoose.model('Users', UserSchema)