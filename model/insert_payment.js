const { Double } = require('mongodb');
const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
      orderid : { type : String, required : true },
      paymentid : { type : String, required : true },
      paymenttype : { type : String },
      receivestatus : { type : String },
      price: { type : String },
      email: { type : String },
      date: { type : String },
      xtime: { type : Date, default: Date.now }


    });

module.exports = mongoose.model('xpayment', OrderSchema); 