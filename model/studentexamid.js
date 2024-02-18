const mongoose = require('mongoose');

const HasnSchema = mongoose.Schema({

    uid: { type: String, required: true, unique: true },
    examid: { type: String },
    studentexamid: { type: String },
    examstatus: { type: String },
    examdate: { type: Date }
});

module.exports = mongoose.model('studentexamid', HasnSchema); 