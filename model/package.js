const mongoose = require('mongoose');

const PackageSchema = mongoose.Schema({
    packageid: { type: String },
    packagename: { type: String, unique: true, required: true },
    type: { type: String }, 
    class: { type: String },
    versionname: { type: String },
    group: { type: String },
    price: { type: Number }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create an index on packagename to enforce uniqueness
PackageSchema.index({ packagename: 1 }, { unique: true });

module.exports = mongoose.model('xpackages', PackageSchema);
