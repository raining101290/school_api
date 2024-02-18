const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({

    id: { type: String, required: true, unique: true },
    name: { type: String },
    address: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    inistute: { type: String },
    enteredby: { type: String },
    updateby: { type: String }
});

module.exports = mongoose.model('schoolsetup', AdminSchema); 