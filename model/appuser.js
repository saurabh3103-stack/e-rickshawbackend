const mongoose = require('mongoose');

const appuserSchema = new mongoose.Schema({
      name: {
        type: String, 
      },
      email: {
        type: String,
      },
      phone:{
        type:Number,
      },
      photo:{
        type:String,
      },
      user_id:{
        type:String,
      },
      password:{
        type:String,
      },
      isactive:{
        type:Number,
        default:1
      },
      status: {
        type: Number,
        default:1 
      },
      createdAt: {
        type: Date,
        default: Date.now 
      }
});

const AppUser = mongoose.model('AppUser', appuserSchema);
module.exports = AppUser;