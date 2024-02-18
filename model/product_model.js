const { Double } = require('mongodb');
const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
      productname : { type : String, required : true },
      productdescription: { type : String, required : true },
      price: { type : Double },
      discount: { type : Double },
      serviceholderid: { type : String},
      worker_categoryid:{ type : String},
      Vat:{ type : Double },
      imageupload: { type : String }, 
      ownerid: { type : String},
      status:{ type : String},
      enteredby: { type : Date, default: Date.now }
    });

module.exports = mongoose.model('xproduct', ProductSchema); 