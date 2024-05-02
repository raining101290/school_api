const mongoose = require('mongoose');

const BkashTokenSchema = mongoose.Schema({
    token: { type: String},
    expires: { type: Number },
    refresh_token: { type: String },
    type: { type: String }
});

module.exports = mongoose.model('bkashtokens', BkashTokenSchema); 