const { Double } = require('mongodb');
const mongoose = require('mongoose');

const AddnewproductSchema = mongoose.Schema({
    productname:{ type: String },
    description:{ type: String },
    price:{ type: String },
    discount:{ type: String },
    email:{ type: String },
    serviceholderid: { type : String},
    worker_categoryid: { type : String},
    Vat: { type : String},
    profileImg: {
        type: String
    },
    ownerid: { type : String},
    subcategory: { type : String},
    status:{ type: String},
    sku: { type : String},
    vedio: { type : String},
    tag: { type : String},
    solditem: { type : String}
    });

module.exports = mongoose.model('Addnewproduct', AddnewproductSchema); 

