const mongoose = require('mongoose');

const SectionSchema = mongoose.Schema({

    schoolid: { type: String },
    schoolname: { type: String },
    sectionname: { type: String },
    inistutetype: { type: String },
    enteredby: { type: String },
    updateby: { type: String }
});

module.exports = mongoose.model('xsection', SectionSchema); 