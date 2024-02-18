const { Double } = require('mongodb');
const mongoose = require('mongoose');

const UserprofileSchema = mongoose.Schema({
    email:{ type: String },
    profileImg: {
        type: String
    }
    });

module.exports = mongoose.model('Uploadprofile', UserprofileSchema); 