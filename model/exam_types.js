const mongoose = require('mongoose');

const examCategoriesSchema = mongoose.Schema({
    id: {type: String},
    title: { type: String},
    status: { type: Number }
});

module.exports = mongoose.model('exam_categories', examCategoriesSchema); 