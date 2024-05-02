const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    parentid: { type: String, required: true },
    schoolcollegename: { type: String },
    name: { type: String },
    inistute: { type: String },
    enteredby: { type: String },
    updateby: { type: String }
});

module.exports = mongoose.model('xsubjects', SubjectSchema); 