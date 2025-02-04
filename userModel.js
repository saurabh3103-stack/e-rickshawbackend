// userModel.js
const mongoose = require('mongoose');

// Create a user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  // phone: {
  //   type: String,
  //   required: true,
  // },
  // company: {
  //   type: String,
  //   required: true,
  // },
  // address: {
  //   type: String,
  // },
  // province: {
  //   type: String,
  // },
  // industryType: {
  //   type: String,
  // },
  // postalCode: {
  //   type: String,
  // },
  // message: {
  //   type: String,
  // },
});

// Create a model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
