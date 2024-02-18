const mongoose = require('mongoose');

const NewstudentSchema = mongoose.Schema({
    studentid: { type: String, required: true },
    studentname: { type: String },
    password: { type: String },
    examid: { type: String },
    exam: { 
            subexamid: { type: String },
            subexamname : { type: String },
            subexamdate : { type: String },
            subexamtime : { type: String }
        
     },
    examname: { type: String },
    classname: { type: String },
    groupname: { type: String },
    sectionname: { type: String },
    versionname: { type: String },
    mobileno: {type: String},
    email: {type: String},
    status: { type: String },
    expairdate: { type: String },
    enteredby: { type: String },
    updateby: { type: String },
    enteredtime: { type: String },
    updatetime: { type: String }
   
});

module.exports = mongoose.model('newstudent', NewstudentSchema); 