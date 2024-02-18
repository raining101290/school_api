const mongoose = require('mongoose');

const FoodcategorySchema = mongoose.Schema({
    id: {
        type: String,
        unique: true, // primary key
        index: true, // this is for auto increment
      },
    english_name : { type : String, required : true, unique: true },
    bangla_name: { type : String, required : true, unique: true },
    status: { type : String },
    profileImg: { type : String }, 
    enteredby: { type : Date, default: Date.now }
    });

module.exports = mongoose.model('xcategoryfood', FoodcategorySchema); 