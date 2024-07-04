const mongoose = require('mongoose');

const ExamSchema = mongoose.Schema({
    examname: { type: String, required: true },
    chapter: { type: String },
    examtype: { type: String },
    quizType: { type: String },
    examdate: { type: String },
    examtime: { type: String },
    schoolcollegid: { type: String },
    schoolcollegename: { type: String },
    classname: { type: String },
    xgroup: { type: String },
    subjectname: { type: String },
    xsection: { type: String },
    versionname: { type: String },
    paymenttype: { type: String },
    examfees: {type: Number},
    noofstudent: {type: Number},
    examstatus: { type: String },
    image:{type: String},
    enteredby: { type: String },
    updateby: { type: String },
    enteredtime: { type: String },
    updatetime: { type: String }
   
});

module.exports = mongoose.model('xexams', ExamSchema); 