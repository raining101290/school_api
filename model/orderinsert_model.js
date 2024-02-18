const { Double } = require('mongodb');
const mongoose = require('mongoose');

const OrderSchema = mongoose.Schema({
      orderid : { type : String, required : true },
      productid : { type : String, required : true },
      productname : { type : String, required : true },
      productdescription: { type : String, required : true },
      price: { type : String },
      discount: { type : String },
      quantity: { type : String },
      serviceholderid: { type : String},
      fromuser:{ type : String},
      promocode: { type : String },
      date: { type : String },
      xtime: { type : Date, default: Date.now }


    });

module.exports = mongoose.model('xorder', OrderSchema); 