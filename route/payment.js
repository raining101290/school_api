const express = require('express')
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require('path');
const bcrypt = require("bcrypt");
//var bcrypt = require('bcryptjs');
//const config = require('./config');
const jwtSecret = 'SUPERSECRETE20220';
//npm install jsonwebtoken --save
//npm install bcryptjs --save
const { unlinkSync } = require('fs');
//const uuidv4  = require('uuid/v4');
const multer = require('multer');

const bkash_model = require('../model/bkash_model');
const auth = require('../middleware/auth'); // authorized token
