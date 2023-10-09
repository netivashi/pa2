const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const Register = mongoose.model('Register', userSchema);

module.exports = Register;