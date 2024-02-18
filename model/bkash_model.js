const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({

    studentid: { type: String, required: true },
    packageid: { type: String },
    packagename: { type: String },
    classname: { type: String },
    groupname: { type: String },
    purchasedate: { type: String },
    mobileno: { type: String },
    transid: { type: String },
    examname: { type: String },
    amount: { type: String },
    currency: { type: String },
    status: { type: String },
    enteredby: { type: String },
    updateby: { type: String },
    enteredtime: { type: String },
    updatetime: { type: String }
   
});

module.exports = mongoose.model('bkashpayment', ExamSchema); 