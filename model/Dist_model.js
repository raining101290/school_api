const mongoose = require('mongoose');

const DistSchema = mongoose.Schema({
    distid: {
        type: String,
        unique: true, // primary key
        index: true, // this is for auto increment
        required: true,
      },
    distname_eng : { type : String, required : true, unique: true },
    distname_ban: { type : String, required : true, unique: true },
    status:  { type : String, required : true },
    enteredby: { type : Date, default: Date.now },
    UpdateTime: { type : Date, default: Date.now }

    });

module.exports = mongoose.model('xdist', DistSchema); 