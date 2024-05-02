const mongoose = require('mongoose');

const PackageSchema = mongoose.Schema({
    packagename: { type: String },
    type: { type: String },
    class: { type: String },
    versionname: { type: String },
    group: { type: String },
    price:{type: Number}
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

module.exports = mongoose.model('xpackages', PackageSchema); 