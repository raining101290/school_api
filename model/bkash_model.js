const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    studentid: { type: String, required: true },
    packageid: { type: String },
    packagename: { type: String },
    classname: { type: String },
    groupname: { type: String },
    purchasedate: { type: String },
    type: {type: String},
    amount: { type: String },
    currency: { type: String },
    status: { type: String },
    version: {type: String },
    invNo: {type: String },
    reference: {type: String },
    mobileno: { type: String },
    trxID: { type: String },
    paymentID: { type: String },
    bkashObject: {type: Object}
});

module.exports = mongoose.model('bkashpayment', ExamSchema); 