const mongoose = require('../utils/db');

const userSchema = new mongoose.Schema({
    img: String,
    name: String,
    birthday: String,
    email: String,
    courseYear: String,
    username: String,
    password: String,
    admin: Boolean,
    idNumber: String,
},{
    versionKey: false,
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;