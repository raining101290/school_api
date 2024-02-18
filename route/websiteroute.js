const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");
//const uuidv4  = require('uuid/v4');
const multer = require('multer');
//npm install uuidv4
// import module
const reg = require('../model/user_model');
const Storepin = require('../model/storepin_model');
const Post = require('../model/Post');
const xdist = require('../model/Dist_model');
const Foodcategories = require('../model/food_category');
const xcategory = require('../model/category_model');

const xcategoryfood = require('../model/categoryfood_model');

const Uploadprofile = require('../model/uploadimage_model');
const Addnewproduct = require('../model/addnewproduct_model');
const Adminmodel = require('../model/admin_model');
const xsubcategory = require('../model/subcategories_model');

const xorder = require('../model/orderinsert_model');
const gascategories = require('../model/gascategory_model');




///update image
const DIR = './public/'; // upload image here

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, Date.now() + '-' + fileName)
  }
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});
//end update image


router.get('/website', (req, res) => {
  res.send('Welcome to your api');
})





module.exports = router;