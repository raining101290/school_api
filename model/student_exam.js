const mongoose = require('mongoose');

const NewstudentSchema = mongoose.Schema({
    studentid: { type: String, required: true },
    examid: { type: String },
    examname: { type: String },
    status: { type: String },
    enteredby: { type: String },
    updateby: { type: String },
    enteredtime: { type: String },
    updatetime: { type: String }
   
});

module.exports = mongoose.model('student_exam', NewstudentSchema); 