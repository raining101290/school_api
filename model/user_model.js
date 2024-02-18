 const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name : { type : String },
    email: { type : String, required : true },
    password:  { type : String, required : true },
    mobileno: { type : String, required : true },
    signupdate: { type : Date, default: Date.now },
    xtime: { type : Date, default: Date.now }
    });

module.exports = mongoose.model('reg', UserSchema); 

/* const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    username: { type: String },
    phone: { type: String },
    email: { type: String },
    password: { type: String },
    firstname: { type: String },
    lastname: { type: String },
    createdby: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema); */
