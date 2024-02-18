const mongoose = require('mongoose');

const FoodSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true, // primary key
        index: true, // this is for auto increment
        required: true,
      },
    name_eng : { type : String, required : true, unique: true },
    name_ban: { type : String, required : true, unique: true },
    status:  { type : String, required : true },
    enteredby: { type : Date, default: Date.now },
    UpdateTime: { type : Date, default: Date.now }

    });

module.exports = mongoose.model('Foodcategories', FoodSchema); 