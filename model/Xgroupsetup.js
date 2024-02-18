const mongoose = require('mongoose');

const GroupSchema = mongoose.Schema({

    xgroupname: { type: String, required: true },
    inistutetype: {type: String},
    schoolid: { type: String },
    schoolname: { type: String },
    enteredby: { type: String },
    updateby: { type: String }
});

module.exports = mongoose.model('xgroup', GroupSchema); 