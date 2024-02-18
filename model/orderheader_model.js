const { Double } = require('mongodb');
const mongoose = require('mongoose');

const OrderheaderSchema = mongoose.Schema({
      orderid : { type : String, required : true },
      cname : { type : String, required : true },
      cfirstname : { type : String, required : true },
      clastname: { type : String, required : true },
      caddress: { type : String },
      capartment: { type : String },
      ccity: { type : String },
      date: { type : String },
      xtime: { type : Date, default: Date.now }


    });

module.exports = mongoose.model('xordeheader', OrderheaderSchema); 