const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({

    email: { type: String, required: true, unique: true },
    password: { type: String },
    usersrole: { type: String },
    schoolcollegetype: { type: String },
    schoolid: { type: String },
    schoolcollegename: { type: String },
    fullname: { type: String },
    userstatus: { type: String },
    enteredby: { type: String },
    updateby: { type: String },
    enteredtime: { type: String },
    updatetime: { type: String }
   
});

module.exports = mongoose.model('xadmin', AdminSchema); 