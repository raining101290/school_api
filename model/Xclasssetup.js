const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({

    inistuteid: { type: String, required: true },
    schoolcollegename: { type: String },
    xclassname: { type: String },
    inistutetype: { type: String },
    enteredby: { type: String },
    updateby: { type: String }
});

module.exports = mongoose.model('xclass', SubjectSchema); 