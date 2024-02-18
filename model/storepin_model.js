const mongoose = require('mongoose');

const SotepinSchema = mongoose.Schema({
    mobileno: { type : String, required : true},
    email: { type : String, required : true },
    pinno: { type : String, required : true },
    signupdate: { type : Date, default: Date.now },
    status : { type : String },
    UpdateTime: { type : Date, default: Date.now },

    });

module.exports = mongoose.model('storepins', SotepinSchema);