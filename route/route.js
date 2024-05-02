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
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Stripe_Key =
  "sk_test_51Imd3KJdRrXqreQh3z0UrTxa4vrGI4Ca2WfYvYsg5QI4Dx1oOAgDWv2gpNA13xXDUC9U33O3b1nUoLqwkdYqqz2S00agALdOC6";
const stripe = require("stripe")(Stripe_Key);
//npm install uuidv4
// import module
const reg = require('../model/user_model');
const Storepin = require('../model/storepin_model');
const Post = require('../model/Post');
const xdist = require('../model/Dist_model');
const Foodcategories = require('../model/food_category');
const xcategory = require('../model/category_model');
const xpayment = require('../model/insert_payment');
const xcategoryfood = require('../model/categoryfood_model');
const studentexamid = require('../model/studentexamid');

const Uploadprofile = require('../model/uploadimage_model');
const Addnewproduct = require('../model/addnewproduct_model');
const Adminmodel = require('../model/admin_model');
const xsubcategory = require('../model/subcategories_model');
const xorder = require('../model/orderinsert_model');
const xordeheader = require('../model/orderheader_model');
const gascategories = require('../model/gascategory_model');
const banner = require('../model/banner_model');
const schoolsetup = require('../model/schoolsetup');
const admin_model = require('../model/admin_model');
const subjectsetup = require('../model/subjectsetup');
const examsetup = require('../model/exam_model');
const classsetup = require('../model/Xclasssetup');
const groupsetup = require('../model/Xgroupsetup');
const newstudent = require('../model/newstudent_model');
const student_exam = require('../model/student_exam');
const quizsetup = require('../model/quizsetup');
const Sectionsetup = require('../model/Sectionsetup');
const answer = require('../model/answer')
const bkash_model = require('../model/bkash_model')
const matchanswer = require('../model/matchanswer')
const xsubjects = require('../model/subjectsetup')
const xpackages = require('../model/package')
const bkashtokens = require('../model/bkash_token')
const exam_categories = require('../model/exam_types')
const auth = require('../middleware/auth'); // authorized token
const axios = require('axios');
const { exit } = require('process');
const { generateInvoiceNumber } = require('../utils/functions');
//const fs = require('fs');
//const mime = require('mime');
const bkash_dev_url = {
  base_url: process.env.BK_DEV_BASE_URL,
  username: process.env.BK_DEV_USERNAME,
  password: process.env.BK_DEV_PASSWORD,
  app_key: process.env.BK_DEV_APP_KEY,
  app_secret: process.env.BK_DEV_APP_SECRET,
  callback: process.env.BK_DEV_CALLBACK
}
const bkash_prod_url = {
  base_url: process.env.BK_PROD_BASE_URL,
  username: process.env.BK_PROD_USERNAME,
  password: process.env.BK_PROD_PASSWORD,
  app_key: process.env.BK_PROD_APP_KEY,
  app_secret: process.env.BK_PROD_APP_SECRET,
  callback: process.env.BK_PROD_CALLBACK
}
const environment = bkash_prod_url
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

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




router.get('/updateps/:userid/:password', async (req, res, next) => {
  console.log(req.params.categorytype)

  if (!req.params.userid) {
    console.log('not found');
    return;
  }
  if (!req.params.password) {
    console.log('not found');
    return;
  }
  const hashedPassword = await bcrypt.hash(req.params.password, 10);
  admin_model.findOneAndUpdate({ email: req.params.userid },
    {
      password: hashedPassword
    },
    function (
      err,
      result
    ) {
      if (err) {
        console.log('error' + err);

        res.send(err);
      } else {
        console.log('save update password');
      }
    });

})

//admin user list
router.get(
  "/adminlist", async (req, res, next) => {
    console.log(req.params);
    const resp = await admin_model.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.post('/updatepassword', async (req, res, next) => {
  if (!req.body.autoid) {
    console.log('not found');
    return;
  }
  console.log(req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  admin_model.findOneAndUpdate({ _id: req.body.autoid },
    {
      password: hashedPassword
    },
    function (
      err,
      result
    ) {
      if (err) {
        console.log('error' + err);

        res.send(err);
      } else {
        console.log('save update password');
      }
    });

})


router.get('/updateexpairdate', async (req, res, next) => {
	let status = "Trial";

  try {
    bkash_model.findByIdAndUpdate({ packagename: status },
      {
        status: 'expire'
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);

        } else {

          return res.status(200).json({
            status: "found",
          });
        }
      });

  } catch (e) {
    return res.status(500).json(e);
  }


})


router.post('/testdb', function (req, res) {
  console.log('monir...db');
  console.log('test');
  const hashedPassword = bcrypt.hash(req.body.password, 10);
  res.send(req.body.autoid); //autoid );
})

router.post('/updatetrialstatus', async (req, res, next) => {
 // console.log('monir' + req.body.ID); //autoid 

  const resp = await bkash_model.findOne({
    $and: [
      { _id: req.body.ID },
    ],
  });
  const id = resp._id;
  const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Dhaka'
  });

  bkash_model.findOneAndUpdate({ _id: id },
    {
      status: req.body.status,
      updatetime: nDate
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
        console.log(err)
      } else {

        return res.status(200).json('save');

      }
    });

})

//admin user list
router.get(
  "/adminlist", async (req, res, next) => {
    console.log(req.params);
    const resp = await admin_model.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


//Editadminloginsetuppassword
router.post('/Editadminloginsetuppassword', async (req, res, next) => {
  console.log('monir' + req.body.schoolcollagename); //autoid 
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const resp = await schoolsetup.findOne({
    $and: [
      { _id: req.body.schoolcollagename },
    ],
  });
  const schoolname = resp.name;

  admin_model.findOneAndUpdate({ _id: req.body.autoid },
    {
      email: req.body.email,
      usersrole: req.body.userrole,
      schoolcollegetype: req.body.schoolcollegetype,
      schoolcollegename: schoolname,
      schoolid: req.body.schoolcollagename,
      fullname: req.body.fullname,
      userstatus: req.body.userstatus,
      password: hashedPassword,
      enteredby: req.username,
      updateby: req.username,
      enteredtime: '',
      updatetime: ''
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
        console.log(err)
      } else {

        return res.status(200).json({
          status: "save",
        });

      }
    });

})


router.get('/test', function (req, res) {
  console.log('monir...' + req.username);
  console.log('test');
  res.send('Hello World api3 444444')
})
router.get(
  "/subjectlist/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await subjectsetup.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
//coachingallsubject
router.get(
  "/coachingallsubject/:xclass/:xgroup/:versionname", async (req, res, next) => {
    const resp = await examsetup.find({
      $and: [
        { classname: req.params.xclass }
      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/grouplist/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await groupsetup.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//grouplist
router.get(
  "/grouplist/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await groupsetup.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//grouplist
router.get(
  "/subjectlist/:page/:limit", async (req, res, next) => {
    // console.log(req.params.categorytype)
    const resp = await subjectsetup.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//sectionlist
router.get(
  "/sectionlist/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await Sectionsetup.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get('/updateexamasfinish/:examid/:studentid', async (req, res, next) => {
  console.log(req.params.examid)
  console.log(req.params.studentid)
  const resp = await studentexamid.findOne({
    $and: [
      { examid: req.params.examid }, { studentexamid: req.params.studentid }
    ],
  }).count(); 

  if (resp > 0) {
    //if already exit exam in collection it will update
    res.send('exits');
    const respd = await studentexamid.findOne({
      $and: [
        { examid: req.params.examid }, { studentexamid: req.params.studentid }
      ],
    })

    console.log('id....' + respd._id);

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
  
    // prints date & time in YYYY-MM-DD format
    var datetime = year + "-" + month + "-" + date;
    ///////////////////////////////////////////////////////
    studentexamid.findOneAndUpdate( { _id: respd._id },
      {
        examstatus: 'S-C',
        examdate: datetime
      },
      function (
        err,
        result
      ) {
        if (err) {
          console.log('error' + err);
  
          res.send(err);
        } else {
          console.log('save update password');
        }
      });
  

    ///////////////////////////////////////////////////////
  }
  else {


  }


})


router.get('/studentexamid/:examid/:studentid/:randomid', async (req, res, next) => {
  console.log(req.params.examid)
  console.log(req.params.studentid)
  const resp = await studentexamid.findOne({
    $and: [
      { examid: req.params.examid }, { studentexamid: req.params.studentid }
    ],
  }).count();

  if (resp > 0) {
    //if already exit exam in collection it will update
    res.send('exits');
    const respd = await studentexamid.findOne({
      $and: [
        { examid: req.params.examid }, { studentexamid: req.params.studentid }
      ],
    })

    console.log('id....' + respd._id);
    ///////////////////////////////////////////////////////
    studentexamid.findOneAndUpdate( { _id: respd._id },
      {
        uid: req.params.randomid
      },
      function (
        err,
        result
      ) {
        if (err) {
          console.log('error' + err);
  
          res.send(err);
        } else {
          console.log('save update password');
        }
      });
  

    ///////////////////////////////////////////////////////
  }
  else {

    const user = {
      uid: req.params.randomid,
      examid: req.params.examid,
      studentexamid: req.params.studentid
    }
    try {
      const new_user = new studentexamid(user);
      const save_user = new_user.save();
      if (save_user)
        return res.status(200).json({
          status: req.params.randomid,
        });
      else
        return res.status(400).json({
          status: "here",
        });
    } catch (e) {
      console.log("erro ", e);
      return res.status(500).json(e);
    }

  }


})


router.get(
  "/classlist/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await classsetup.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

/* router.get(
  "/quizlist/:id/:ids/:page/:limit", async (req, res, next) => {
    console.log(req.params.id)
    const resp = await quizsetup.find({ schoolcollegeid : req.params.id }, {examid: req.params.ids})
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
 */
//getall answer result
router.get(
  "/getresultpage/:examid/:studentid/:examrandomid", async (req, res, next) => {
    console.log(req.params);
    const resp = await answer.find({
      $and: [
        { examid: req.params.examid }, { studentid: req.params.studentid }, { examrandomid: req.params.examrandomid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/resultpageviewhistory/:examid/:studentid", async (req, res, next) => {
    console.log(req.params);
    const resp = await answer.find({
      $and: [
        { examid: req.params.examid }, { studentid: req.params.studentid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//studentwiseinfo
router.get(
  "/studentwiseinfo/:id",
  (req, res, next) => {
    newstudent.find({ studentid: req.params.id })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/examquizcopy/:examid", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await quizsetup.find({
      $and: [
        { examid: req.params.examid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/findquiz/:id", async (req, res, next) => {
    console.log(req.params.id);
    const resp = await quizsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/quizlistview/:examid", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await quizsetup.find({
      $and: [
        { examid: req.params.examid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);



router.get(
  "/quizlist/:schoolid/:examid", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await quizsetup.find({
      $and: [
        { schoolcollegeid: req.params.schoolid }, { examid: req.params.examid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.post('/paymentstripepay', async (req, res, next) => {
  const { amount, email } = req.body;
  const {
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCVC,
    country,
    postalCode,
  } = req.body;

  if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
    return res.status(400).send({
      Error: "Necessary Card Details are required for One Time Payment",
    });
  }
  try {
    const cardToken = await stripe.tokens.create({
      card: {
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCVC,
        address_state: country,
        address_zip: postalCode,
      },
    });

    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "usd",
      source: cardToken.id,
      receipt_email: email,
      description: `Stripe Charge Of Amount ${amount} for One Time Payment`,
    });

    if (charge.status === "succeeded") {
      return res.status(200).send({ Success: charge });
    } else {
      return res
        .status(400)
        .send({ Error: "Please try again later for One Time Payment" });
    }
  } catch (error) {
    return res.status(400).send({
      Error: error.raw.message,
    });
  }

})
////////////////////stripe payment	



//receive payment

router.post('/xpaymentpaypal', async (req, res, next) => {
  console.log('datafile:' + req.body);
  var status = 'Active';
  ///////////////////////////////////
  let ts = Date.now();

  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  // prints date & time in YYYY-MM-DD format
  var datetime = year + "-" + month + "-" + date;
  ///////////////////////////////////
  // var datetime = new Date();
  console.log(datetime);
  const user = {
    orderid: req.body.orderid,
    paymentid: req.body.paymentid,
    paymenttype: req.body.paymenttype,
    price: req.body.price,
    email: req.body.email,
    date: datetime

  };


  try {
    const new_user = new xpayment(user);
    const save_user = await new_user.save();

    if (save_user)
      return res.status(200).json({
        status: "save",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.get(
  "/vieworder/:username", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await xordeheader.find({
      $and: [
        { cname: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/vieworderdetails/:username", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await xorder.find({
      $and: [
        { orderid: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//////website add banner
router.post('/addbannerimage', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new banner({
    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.bangla_name,
    status: req.body.status,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        id: req.body.id,
        english_name: req.body.english_name,
        bangla_name: req.body.bangla_name,
        status: req.body.status,
        // profileImg: url + '/public/' + req.file.filename // image upload with url
        profileImg: '/public/' + req.file.filename
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})
//website banner
router.get(
  "/banner",
  (req, res, next) => {
    banner.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/products/count",
  (req, res, next) => {
    /////////////////////////////////////////////    
    Addnewproduct.find().count(function (err, ress) {
      if (err)
        throw err;
      console.log(ress)
      return res.status(200).json(ress);
    });

    /////////////////////////////////////////////      
  }
);


//website banner
router.get(
  "/products",
  (req, res, next) => {
    Addnewproduct.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//{price: {$gte: 501, $lte: 1000}} 
router.get(
  "/productsamountrange/:frmrange/:torange",
  (req, res, next) => {
    Addnewproduct.find({ price: { $gte: req.params.frmrange, $lte: req.params.torange } })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/productscategory/:id",
  (req, res, next) => {
    //   Addnewproduct.find()
    Addnewproduct.find({
      $and: [
        { worker_categoryid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//website banner
router.get(
  "/reg",
  (req, res, next) => {
    reg.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/orderviewpage",
  (req, res, next) => {
    xordeheader.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/singleproduct/:productid", async (req, res, next) => {

    // gascategories.find()
    //  console.log('Service HOlder Image' + req.params.productid);
    const resp = await Addnewproduct.find({
      $and: [
        { _id: req.params.productid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/productviewlike/:productid", async (req, res, next) => {
    // gascategories.find()
    //  console.log('Service HOlder Image' + req.params.productid);
    var productname = req.params.productid;
    const resp = await Addnewproduct.find(
      { 'productname': new RegExp(productname, 'i') }
    )
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


//checkpassword
router.post('/checkpassword', async (req, res, next) => {
  console.log(req.body);
  const user = {
    email: req.body.emailaddress,
    password: req.body.password,
  };
  // check into the registration table if user is exits
  const resp = await reg.findOne({
    $and: [
      { email: user.email }, { password: user.password },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "found",
    });
  if (resp == null)
    return res.status(400).json({
      status: "notfound",
    });

})
//checkemail
router.post('/checkemail', async (req, res, next) => {
  console.log(req.body);
  const user = {
    email: req.body.email,
  };
  // check into the registration table if user is exits
  const resp = await reg.findOne({
    $or: [
      { email: user.email },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "found",
    });
  if (resp == null)
    return res.status(400).json({
      status: "notfound",
    });

})
// checkmobileno
router.post('/checkmobileno', async (req, res, next) => {
  console.log(req.body);
  const user = {
    mobile: req.body.mobile,
    emailaddress: req.body.emailaddress,
    usertoken: req.body.usertoken
  };
  // check into the registration table if user is exits
  const resp = await reg.findOne({
    $or: [
      { mobileno: user.mobile },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "found",
    });
  if (resp == null)
    return res.status(400).json({
      status: "notfound",
    });

})

router.post('/storepin', async (req, res, next) => {
  console.log(req.body);
  //mobile,code1,code2,code3,code4
  const user = {
    mobileno: req.body.mobileno,
    email: req.body.email,
    pinno: req.body.pinno,
    status: req.body.status
  };
  //    var pinno = code1 + "" + code2 + "" + code3 + "" + code4;
  try {

    const new_storepin = new Storepin(user);
    const storepindata = await new_storepin.save();
    if (storepindata)
      /////insert into storepin no

      //end insert store pin
      return res.status(200).json({
        status: "save",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})
//Adminmodel
router.post('/Adminloginareacheck', async (req, res, next) => {
  //router.post('/Adminloginareacheck', async (req, res) => {
  // res.send('Hello World')
  //console.log(req.body);
  const user = {
    email: req.body.emailaddress,
    password: req.body.password,
  };

  if (user.email == null || user.password == null)
    return res.sendStatus(400);
  // check into the registration table if user is exits
  const resp = await Adminmodel.findOne({
    $and: [
      { email: user.email }, { password: user.password }
    ],
  });

  if (!resp) {
    return res.status(404).send({ status: "User Not found." });
  }

  if (resp.password !== user.password)
    return res.status(403).send({ status: "Not Match" });

  if (resp !== null)
    return res.status(400).json({
      status: "found",
    });
  if (resp == null)
    return res.status(400).json({
      status: "notfound",
    });


})


router.get(
  "/getparmetersubjectlist/:country/:states", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await subjectsetup.find({
      $and: [
        { parentid: req.params.states },
        {
          inistute: req.params.country
        }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
////////////////////////////////////////////////////


router.get(
  "/editsubjectinformation/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await subjectsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//getschooluniqueid

router.get(
  "/getschooluniqueid", auth, async (req, res, next) => {
    schoolsetup.find().sort({ id: -1 }).limit(1).then((data) => {
      if (data) {
        // console.log('' + data[0].id);
        return res.status(200).json({
          status: data[0].id + 1
        });
        // return res.status(data[0].id+1);
      }
    })
  }
);

router.get(
  "/getquizuniqueid", auth, async (req, res, next) => {
    quizsetup.count({ inistute: req.params.id }, function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json(result + 1);
      }
    });
  }
);
router.get(
  "/viewmathquestion/:id", async (req, res, next) => {
    var url = path.join(__dirname, '../public/')
    // add CORS headers
    const resp = await answer.find({
      $and: [
        { _id: req.params.id }
      ],
    })
      .exec()
      .then((resp) => {
        //return res.status(200).json(resp);





      })
      .catch((err) => {
        return res.sendStatus(500);
      });

    /*     examsetup.count({ _id: req.params.id }, function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.json(result);
          }
        }); */
  }
);


router.get(
  "/getexamid/:id", async (req, res, next) => {
    const resp = await examsetup.find({
      $and: [
        { _id: req.params.id }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

    /*     examsetup.count({ _id: req.params.id }, function(err, result) {
          if (err) {
            res.send(err);
          } else {
            res.json(result);
          }
        }); */
  }
);

router.get(
  "/edituserinformation/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await admin_model.find({
      $and: [
        { _id: req.params.id }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/geteditnewexams/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await examsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


///////////////////////////////////////////////////

router.get(
  "/editschoolcollegesetup/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await schoolsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//get school wise student 
router.get(
  "/getexamsstudentwise/:id", async (req, res, next) => {
    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await examsetup.find({
      $and: [
        { schoolcollegid: req.params.id },
        { classname: '' },
        { xgroup: '' },
        { xsection: '' }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//getbyexamid
router.get(
  "/getbyexamid/:id/:studentid", async (req, res, next) => {

    const resp = await student_exam.find({
      $and: [
        { examid: req.params.id }, { studentid: req.params.studentid }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });


  }
);

//get quiz by student id

router.get(
  "/getstudentwiseexam/:id/:status", async (req, res, next) => {
    const resp = await student_exam.find({
      $and: [
        { studentid: req.params.id }, { status: req.params.status }
      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });


  }
);


//get school wise subject
router.get(
  "/getsubjectbyschool/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await subjectsetup.find({
      $and: [
        { parentid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/getsubjectfindbyid/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await subjectsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/getschoolcollegeinfo/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await schoolsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//getsectionid
router.get(
  "/getsectionid/:id", async (req, res, next) => {
    const resp = await Sectionsetup.find({
      $and: [
        { schoolid: req.params.id }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//gettotalquiz


//grouplist
router.get(
  "/subjectlistschool/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await subjectsetup.find({
      $and: [
        { parentid: req.params.id }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);



//grouplist
router.get(
  "/grouplist/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await groupsetup.find({
      $and: [
        { schoolid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//examwisestudentlist
router.get(
  "/studentlist/:id", async (req, res, next) => {
    const resp = await student_exam.find({
      $and: [
        { examid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//examwisestudentlist
router.get(
  "/examnamefind/:id", async (req, res, next) => {
    const resp = await examsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/answercount/:id", async (req, res, next) => {
    const resp = await answer.find({
      $and: [
        { examrandomid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


//examwisestudentlist
router.get(
  "/examwisestudentlist/:id", async (req, res, next) => {
    const resp = await newstudent.find({
      $and: [
        { examid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//getschoolidforsave
router.get(
  "/getschoolidforsave/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await schoolsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//edit quiz
router.get(
  "/quizedit/:id", async (req, res, next) => {

    const resp = await quizsetup.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//getquizserial
router.get(
  "/getquizserial/:id/:serial", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    console.log('Service HOlder Image' + req.params.serial);
    const resp = await quizsetup.find({
      $and: [
        { examid: req.params.id }, { id: req.params.serial }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/gettotalquiz/:id", async (req, res, next) => {
    const resp = await quizsetup.find({
      $and: [
        { examid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
router.get(
  "/examwisestudentwiseresult/:studentid/:examid", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await studentexamid.find({
      $and: [
        { examid: req.params.examid }, { studentexamid: req.params.studentid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/getclassid/:id", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.id);
    const resp = await classsetup.find({
      $and: [
        { inistuteid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//getschoolname
router.get(
  "/getschoolname/:id", async (req, res, next) => {
    const resp = await schoolsetup.find({
      $and: [
        { _id: req.params.id }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/getschoollist/:id", async (req, res, next) => {
    const resp = await schoolsetup.find({
      $and: [
        { inistute: req.params.id }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.post('/sectionsetup', async (req, res, next) => {
  console.log(req.body);

  ////////////////////////////////////////////////////////////////
  const user = {
    schoolid: req.body.schoolid,
    schoolname: req.body.schoolname,
    sectionname: req.body.classname,
    inistutetype: req.body.inistutetype,
    enteredby: '',
    updateby: ''
  }
  try {

    if (user.inistutetype == null || user.schoolid == null || user.sectionname == null) {
      res.send('required');
    }
    else {
      var mod = new Sectionsetup(user);
      mod.save(function (err, data) {
        if (err) {
          res.send(err);
          res.send('error');
        }
        else {
          res.send('save');
        }
      });

    }

  }
  catch {
    res.send('error');
  }

})


router.post('/groupsetup', async (req, res, next) => {
  console.log(req.body);
  ////////////////////////////////////////////////////////////////
  const user = {
    schoolid: req.body.schoolid,
    schoolname: req.body.schoolname,
    xgroupname: req.body.classname,
    inistutetype: req.body.inistutetype,
    enteredby: '',
    updateby: ''
  }
  try {

    if (user.inistutetype == null || user.schoolid == null || user.xgroupname == null) {
      res.send('required');
    }
    else {
      var mod = new groupsetup(user);
      mod.save(function (err, data) {
        if (err) {
          res.send(err);
          res.send('error');
        }
        else {
          res.send('save');
        }
      });

    }

  }
  catch {
    res.send('error');
  }

})
//signup student from frontend
router.post('/signupstudent', async (req, res, next) => {
  //console.log(req.body);
  const password = req.body.password;
  const hashedPassword = await bcrypt.hash(password, 10);
  ///////////////////////////req.body.schoolid/////////////////////////////////////
  const user = {
    studentid: req.body.email,
    password: hashedPassword,
    studentname: req.body.name,
    examid: '',
    classname: req.body.className,
    groupname: req.body.groupname,
    mobileno: req.body.mobileno,
    sectionname: '',
    versionname: req.body.versionname,
    mobileno: req.body.mobileno,
    email: req.body.email,
    status: 'Active',
    enteredby: '',
    updateby: '',
    enteredtime: '',
    updatetime: ''
  }
  const respes = await newstudent.findOne({
    $or: [
      { studentid: req.body.email }
    ],
  }).count();

  if (respes > 0) {
    //console.log('here....' + respes)
    res.send('exits');

  }
  else {

    try {

      if (user.studentid == null) {
        res.send('required');
      }
      else {
        var mod = new newstudent(user);
        mod.save(function (err, data) {
          if (err) {
            res.send(err);
            res.send('error');
          }
          else {
            res.send('save');
          }
        });

      }

    }
    catch {
      res.send('error');
    }
  }

})

/////////////////////////////////////////////////////////////////




// add new student
router.post('/Addnewstudent', auth, async (req, res, next) => {
  //console.log(req.body);

  const respes = await student_exam.findOne({
    $or: [
      { studentid: req.body.studentid }, { examid: req.body.autoid }
    ],
  }).count();
  if (respes > 0) {
    //console.log('here....' + respes)
    // return res.status(200).json("idexits");

  }
  else {
    const password = "12345678";
    const hashedPassword = await bcrypt.hash(password, 10);
    const resp = await examsetup.findOne({
      $or: [
        { _id: req.body.autoid }
      ],
    });
    console.log(resp.examname)
    const examname = resp.examname;

    ///////////////////////////req.body.schoolid/////////////////////////////////////
    const user = {
      studentid: req.body.studentid,
      password: hashedPassword,
      studentname: req.body.studentname,
      examid: req.body.autoid,
      examname: examname,
      exam: {
        subexamid: req.body.autoid,
        subexamname: examname,
        subexamdate: '20-09-2022',
        subexamtime: '10:20 am'
      },
      classname: req.body.classname,
      groupname: req.body.groupname,
      sectionname: req.body.sectionname,
      mobileno: req.body.mobileno,
      email: req.body.email,
      status: req.body.examstatus,
      enteredby: req.username,
      updateby: req.username,
      enteredtime: '',
      updatetime: ''

    }
    try {
      if (user.studentid == null
      ) {
        res.send('required');
      }
      else {
        //////////////check student id

        const resp = await newstudent.findOne({
          $or: [
            { studentid: req.body.studentid }
          ],
        });

        if (resp !== null) {
          const userdata = {
            studentid: req.body.studentid,
            examid: req.body.autoid,
            examname: examname,
            status: 'Active',
            enteredby: '',
            updateby: '',
            enteredtime: '',
            updatetime: ''
          }
          var studentsexams = new student_exam(userdata);
          studentsexams.save(function (err, data) {
            if (err) {
              res.send(err);
              res.send('error');
            }
            else {
              res.send('save');
            }
          });

          //exits req.body.studentid

        }
        else {
          //////////////////////////////////////////////////////////////
          var mod = new newstudent(user);
          mod.save(function (err, data) {
            if (err) {
              res.send(err);
              res.send('error');
            }
            else {
              res.send('save');
              //////////////////////insert details exams
              const userdata = {
                studentid: req.body.studentid,
                examid: req.body.autoid,
                examname: examname,
                status: 'Active',
                enteredby: '',
                updateby: '',
                enteredtime: '',
                updatetime: ''
              }
              var studentsexams = new student_exam(userdata);
              studentsexams.save(function (err, data) {
              });

              //////////////////////end details exam
            }
          });

          /////////////////////////////////////////////////////////////
        }

        ///////end check


      }

    }
    catch {
      res.send('error');
    }
  }
})



//class setup
router.post('/addnewexam', auth, async (req, res, next) => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  // prints date & time in YYYY-MM-DD format
  var datetime = year + "-" + month + "-" + date;
  ///////////////////////////req.body.schoolid/////////////////////////////////////
  const user = {
    examname: req.body.examname,
    examtype: req.body.examtype,
    quizType: req.body.quizType,
    examdate: req.body.examdate,
    examtime: req.body.examtime,
    schoolcollegid: req.body.schoolcollegid,
    schoolcollegename: req.body.schoolcollegename,
    classname: req.body.classname,
    subjectname: req.body.subjectname,
    paymenttype: req.body.paymenttype,
    versionname: req.body.versionname,
    xgroup: req.body.xgroup,
    xsection: req.body.xsection,
    examfees: req.body.examfees,
    noofstudent: req.body.noofstudent,
    examstatus: req.body.examstatus,
    chapter: req.body.chapter,
    status: req.body.status,
    enteredby: req.username,
    updateby: req.username,
    enteredtime: datetime,
    updatetime: datetime
  }
  try {

    if (user.examname == null
    ) {
      res.send('required');
    }
    else {
      var mod = new examsetup(user);
      mod.save(function (err, data) {
        if (err) {
          res.send(err);
          res.send('error');
        }
        else {
          res.send('save');
        }
      });
    }

  }
  catch {
    res.send('error');
  }

})



//class setup
router.post('/classsetup', async (req, res, next) => {
  console.log(req.body);
  ////////////////////////////////////////////////////////////////
  const user = {
    inistuteid: req.body.schoolid,
    schoolcollegename: req.body.schoolname,
    xclassname: req.body.classname,
    inistutetype: req.body.inistutetype,
    enteredby: '',
    updateby: ''
  }
  try {

    if (user.inistuteid == null || user.schoolcollegename == null || user.xclassname == null) {
      res.send('required');
    }
    else {
      var mod = new classsetup(user);
      mod.save(function (err, data) {
        if (err) {
          res.send(err);
          res.send('error');
        }
        else {
          res.send('save');
        }
      });

    }

  }
  catch {
    res.send('error');
  }

})

//subject setup
router.post('/subjectsetup', async (req, res, next) => {
  console.log(req.body);


  const resp = await schoolsetup.find({
    $and: [
      { _id: req.body.schoolname }

    ],
  })
    .exec()
    .then((resp) => {
      //return res.status(200).json(resp[0].name);
      const schoolnametxt = resp[0].name;
      ////////////////////////////////////////////////////////////////
      const user = {
        parentid: req.body.schoolname,
        schoolcollegename: schoolnametxt,
        name: req.body.subjectname,
        inistute: req.body.inistutetype,
        enteredby: '',
        updateby: ''
      }
      try {

        if (user.parentid == null || user.name == null || user.inistute == null) {
          res.send('required');
        }
        else {
          var mod = new subjectsetup(user);
          mod.save(function (err, data) {
            if (err) {
              res.send(err);
              res.send('error');
            }
            else {
              res.send('save');
            }
          });

        }

      }
      catch {
        res.send('error');
      }


      ///////////////////////////////////////////////////////////////
    })
    .catch((err) => {
      return res.sendStatus(500);
    });
  // console.log('school.....' + resp.name);


})
//fill in the gaps update
router.post('/fillinthegapupdate', async (req, res, next) => {
  //console.log(req.body)
  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.automemberid },
      {
        questiontitle: req.body.questiontitle,
        Answer: req.body.writtinganswer,
        writtinganswer: req.body.writtinganswer,
        quiztype: req.body.quiztype
      },
      function (
        err,
        result
      ) {
        if (err) {
          res.send(err);
          //res.send('Failed to upload files');
        }
        else {
          return res.status(200).json({
            status: "found",
          });
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})


//MCQ Quetion update 
router.post('/mcqquestionupdate', async (req, res, next) => {
  console.log('Atitle' + req.body.text6)
  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.automemberid },
      {
        questiontype: req.body.questiontype,
        questiontitle: req.body.text,
        Atype: req.body.Atype,
        Btype: req.body.Btype,
        Ctype: req.body.Ctype,
        Dtype: req.body.Dtype,
        Atitle: req.body.text6,
        Btitle: req.body.text7,
        Ctitle: req.body.text8,
        Dtitle: req.body.text9,
        Answer: req.body.Answer,
        writtinganswer: req.body.writtinganswer,
        quiztype: req.body.quiztype,
        point: '1',
        questiontitle2: req.body.text2,
        questiontitle3: req.body.text3,
        questiontitle4: req.body.text4,
        questiontitle5: req.body.text5,
        questiontype1: req.body.titletypetext1,
        questiontype2: req.body.titletypetext2,
        questiontype3: req.body.titletypetext3,
        questiontype4: req.body.titletypetext4,
        questiontype5: req.body.titletypetext5
      },
      function (
        err,
        result
      ) {
        if (err) {
          res.send(err);
          //res.send('Failed to upload files');
        }
        else {
          return res.status(200).json({
            status: "found",
          });
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})
//////////////get first id from quiz/////////////////


//writting test update 

router.post('/writtingtestupdate', auth, async (req, res, next) => {
  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.automemberid },
      {
        questiontype: req.body.questiontype,
        questiontitle: req.body.questiontitle,
        Answer: req.body.writtinganswer,
        writtinganswer: req.body.writtinganswer,
        quiztype: req.body.quiztype,
        questiontime: req.body.questiontime,
        point: req.body.points,
        writtinganswertype: req.body.answertype,
        questiontype1: req.body.titletypetext1,
        questiontype2: req.body.titletypetext2,
        questiontype3: req.body.titletypetext3,
        questiontype4: req.body.titletypetext4,
        questiontype5: req.body.titletypetext5,
        questiontitle: req.body.text,
        questiontitle2: req.body.text2,
        questiontitle3: req.body.text3,
        questiontitle4: req.body.text4,
        questiontitle5: req.body.text5
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {
          console.log('ssssss')
          return res.status(200).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})

//questionsaveall 
router.post('/questionsaveall', auth, async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log()
  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.automemberid },
      {
        questiontype: req.body.questiontype,
        questiontitle: req.body.text,
        Atype: req.body.Atype,
        Btype: req.body.Btype,
        Ctype: req.body.Ctype,
        Dtype: req.body.Dtype,
        Atitle: req.body.Atitle,
        Btitle: req.body.Btitle,
        Ctitle: req.body.Ctitle,
        Dtitle: req.body.Dtitle,
        Answer: req.body.Answer,
        writtinganswer: req.body.writtinganswer,
        quiztype: req.body.quiztype,
        point: '1',
        questiontitle2: req.body.text2,
        questiontitle3: req.body.text3,
        questiontitle4: req.body.text4,
        questiontitle5: req.body.text5,
        questiontype1: req.body.titletypetext1,
        questiontype2: req.body.titletypetext2,
        questiontype3: req.body.titletypetext3,
        questiontype4: req.body.titletypetext4,
        questiontype5: req.body.titletypetext5
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {
          console.log('ssssss')
          return res.status(200).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})



//Dimageupload
router.post('/Dimageupload', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);

  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        Dtype: req.body.Dtype,
        Dimage: '/public/' + req.file.filename,
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(400).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})

//Cimageupload
router.post('/Cimageupload', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);

  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        Ctype: req.body.Atype,
        Cimage: '/public/' + req.file.filename,
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(400).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})

const uploadImage = async (req, res, next) => {
  // res.set('Access-Control-Allow-Origin', '*');
  //res.send({ "msg": "This has CORS enabled " })
  // res.header("Access-Control-Allow-Origin", "*");
  // to declare some path to store your converted image
  console.log('xxx' + req.body.profileImg)

  return;
  if (req.body.profileImg == "undefined") {
    return new Error('Required');
  }
  //return;
  var matches = req.body.profileImg.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};

  if (matches.length !== 3) {
    return new Error('Invalid input string');
  }

  response.type = matches[1];
  response.data = new Buffer(matches[2], 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.extension(type);
  let fileName = "image." + extension;
  try {
    fs.writeFileSync("./public/" + fileName, imageBuffer, 'utf8');
    return res.send({ "status": "success" });
  } catch (e) {
    next(e);
  }

}

//router.post('/teacherimagemarksupdate', uploadImage)


//teacherimagemarksupdate
//router.post('/teacherimagemarksupdate', upload.single('profileImg'), async(req, res, next) => {
router.post('/teacherimagemarksupdate', async (req, res, next) => {
  console.log('fffff' + req.body.autoincrement);

  try {
    answer.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        Cimage: req.body.profileImg,
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(400).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }
})

//Aimageupload
router.post('/Bimageupload', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);

  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        Btype: req.body.Atype,
        Bimage: '/public/' + req.file.filename,
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(400).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }
})




//writing  answer user jpg upload to answer
router.post('/examimageupdate', upload.single('profileImg'), async (req, res, next) => {

  console.log('Email Address....' + req.body.autoincrement);
  if (!req.body.autoincrement) {
    console.log('not found');
    return;
  }

  examsetup.findOneAndUpdate({ _id: req.body.autoincrement },
    {
      image: '/public/' + req.file.filename,
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });


})



//writing  answer user jpg upload to answer
router.post('/Aimageupload_useranswerfileupload', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);

  ////////////////////////////////////////////////////////// req.body.autoincrement

  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.autoincrement }

    ],
  })
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: req.file.filename,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: '',
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: '',
    writtinganswertype: resp[0].writtinganswertype,
    questiontime: resp[0].questiontime,
    point: resp[0].point,
    questiontype1: resp[0].questiontype1,
    questiontype2: resp[0].questiontype2,
    questiontype3: resp[0].questiontype3,
    questiontype4: resp[0].questiontype4,
    questiontype5: resp[0].questiontype5,
    questiontitle2: resp[0].questiontitle2,
    questiontitle3: resp[0].questiontitle3,
    questiontitle4: resp[0].questiontitle4,
    questiontitle5: resp[0].questiontitle5

  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


  //////////////////////////////////////////////////////////////////////////////////
})


//Aimageupload
router.post('/Aimageupload', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);

  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        Atype: req.body.Atype,
        Aimage: '/public/' + req.file.filename,
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(400).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})
///////////////


router.post('/teacheranswerwritting', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);
  try {
    answer.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        Cimage: req.file.filename,
        studentpoint: req.body.useranswer,
        answertype: req.body.answertype
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(200).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });

  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})

router.get('/imageviewnodejs/:fileName', (req, res, next) => { //OKAYH?? oh prb was directory
  var url = path.join(__dirname, '../public/')
  // add CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "X-Requested-With");
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.sendFile(`${url}/${req.params.fileName}`);
})


///////////////////////////////////////////////////////
router.post('/questionimageupload', upload.single('profileImg'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.autoincrement);
  try {
    quizsetup.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        questiontype: req.body.questiontype,
        questionimage: '/public/' + req.file.filename,
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {

          return res.status(400).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });

  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})




router.get('/studentwiseresult', async (req, res, next) => {
  console.log('monir');
  const resp = await answer.aggregate([
    {
      $match:
        { examid: "631ce200c97db01d247a2aa1", studentid: "9001" }
    },
    {
      $group: {
        examid: "$examid",
        studentid: "$studentid",
        count: { $count: {} }
      }
    }
  ])
    .exec()
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((err) => {
      return res.sendStatus(500);
    });

})




router.get('/jointwocollection', async (req, res, next) => {
  // console.log(req.body);
  const resp = await answer.aggregate([
    { $match: { parentquizid: "631a65b456e89d0ac442afde" } },
    {
      $lookup:
      {
        from: "quizsetup",
        localField: "_id",
        foreignField: "parentquizid",
        as: "quizsetup"
      }
    }])
    .exec()
    .then((resp) => {
      return res.status(200).json(resp);
    })
    .catch((err) => {
      return res.sendStatus(500);
    });

})


router.get('/quizautoid', async (req, res, next) => {
  // console.log(req.body);

  quizsetup.find().sort({ id: -1 }).limit(1).then((data) => {
    if (data) {
      // console.log('' + data[0].id);
      return res.status(200).json({
        status: data[0].id + 1
      });
      // return res.status(data[0].id+1);
    }
  })

})


//////////////////////////////////////////////////////
//quizid  useranswer examid studentid

router.post('/playingquizinsert', async (req, res, next) => {

  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    point: resp[0].point,
    studentpoint: '0',
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: '',
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: '',
    questiontype1: resp[0].questiontype1,
    questiontype2: resp[0].questiontype2,
    questiontype3: resp[0].questiontype3,
    questiontype4: resp[0].questiontype4,
    questiontype5: resp[0].questiontype5,
    questiontitle2: resp[0].questiontitle2,
    questiontitle3: resp[0].questiontitle3,
    questiontitle4: resp[0].questiontitle4,
    questiontitle5: resp[0].questiontitle5

  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/playinsertfillinthegap', async (req, res, next) => {
  console.log(req.body.answertype);
  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    point: resp[0].point,
    studentpoint: '0',
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: req.body.answertype,
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: ''
  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/playinsertmcq', async (req, res, next) => {
  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  // console.log('dddd' + resp[0].examname, req.body.quizid);
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    point: resp[0].point,
    studentpoint: req.body.marks,
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: req.body.answertype,
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: '',
    questiontype1: resp[0].questiontype1,
    questiontype2: resp[0].questiontype2,
    questiontype3: resp[0].questiontype3,
    questiontype4: resp[0].questiontype4,
    questiontype5: resp[0].questiontype5,
    questiontitle2: resp[0].questiontitle2,
    questiontitle3: resp[0].questiontitle3,
    questiontitle4: resp[0].questiontitle4,
    questiontitle5: resp[0].questiontitle5,
  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})
// copy exams

router.post('/copyexamssubmit', auth, async (req, res, next) => {
           
           const user = {
            id:req.body.id,
            quiztype:req.body.quiztype,
            schoolcollegeid:req.body.schoolcollegeid,
            schoolname:req.body.schoolname,
            subject:req.body.subject,
            xgroup:req.body.xgroup,
            examid:req.body.examid,
            examname:req.body.examname,
            questiontype:req.body.questiontype,
            questiontitle:req.body.questiontitle,
            questionimage:req.body.questionimage,
            Atype:req.body.Atype,
            Atitle:req.body.Atitle,
            Aimage:req.body.Aimage,
            Btype:req.body.Btype,
            Btitle:req.body.Btitle,
            Bimage:req.body.Bimage,
            Ctype:req.body.Ctype,
            Ctitle:req.body.Ctitle,
            Cimage:req.body.Cimage,
            Dtype:req.body.Dtype,
            Dtitle:req.body.Dtitle,
            Dimage:req.body.Dimage,
            Answer:req.body.Answer,
            enteredby:req.body.enteredby,
            updateby:req.body.updateby,
            UpdateTime:req.body.UpdateTime,
            writtinganswertype:req.body.writtinganswertype,
            questiontime:req.body.questiontime,
            point:req.body.point,
            questiontitle2:req.body.questiontitle2,
            questiontitle3:req.body.questiontitle3,
            questiontitle4:req.body.questiontitle4,
            questiontitle5:req.body.questiontitle5,
            questiontype1:req.body.questiontype1,
            questiontype2:req.body.questiontype2,
            questiontype3:req.body.questiontype3,
            questiontype4:req.body.questiontype4,
            questiontype5:req.body.questiontype5,
            writtinganswer:req.body.writtinganswer
  }

  try {
    const new_user = new quizsetup(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save_data",
        data: {
          _id: new_user._id,
          examid: new_user.examid
        }
      })

    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


//end 
router.post('/quizsetupautoid', auth, async (req, res, next) => {
  //  console.log(req.body);
  const user = {
    id: req.body.id,
    quiztype: req.body.quiztype,
    schoolcollegeid: req.body.schoolcollegeid,
    subjectid: req.body.subjectid,
    schooltype: req.body.schooltype,
    schoolname: req.body.schoolname,
    subject: req.body.subject,
    xgroup: req.body.groupname,
    xsection: req.body.sectionname,
    examid: req.body.examid,
    examname: req.body.examname,
    questiontype: 'Text',
    questiontitle: 'x',
    questionimage: 'x`',
    Atype: 'Text',
    Atitle: 'x',
    Aimage: 'x',
    Btype: 'Text',
    Btitle: 'x',
    Bimage: 'x',
    Ctype: 'Text',
    Ctitle: 'x',
    Cimage: 'x',
    Dtype: 'Text',
    Dtitle: 'x',
    Dimage: 'x',
    Answer: 'x',
    enteredby: '',
    updateby: '',
    UpdateTime: '',
    writtinganswertype: 'Text',
    questiontime: '10',
    point: '5'
  }

  try {
    const new_user = new quizsetup(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    /*   return res.status(200).json({
        id: save_user._id,
        status: "save",
      });
 */



    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/quizheaderadd', async (req, res, next) => {
  console.log('Test Message...' + req.body.id);

  // return;
  /* 
  const user = {
    id: req.body.id,
    schooltype : req.body.schooltype,
    schoolname: req.body.schoolname,
    subject:  req.body.subject,
    questiontype: 'x',
    questiontitle: 'x',
    questionimage: 'x',
    Atype:  'x',
    Atitle:  'x',
    Aimage:  'x',
    Btype:  'x',
    Btitle:  'x',
    Bimage:  'x',
    Ctype:  'x',
    Ctitle:  'x',
    Cimage:  'x',
    Dtype:  'x',
    Dtitle:  'x',
    Dimage:  'x',
    Answer:  'x',
    enteredby:  '',
    updateby:  '',
    UpdateTime: ''
      }

  try {
    const new_user = new quizsetup(user);
    const save_user = await new_user.save();
    if (save_user)

     return res.status(200).json({
        status: "save",
      });
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  } */

})
//////////////
router.post('/teacherschoolsetup', auth, async (req, res, next) => {


  const resp = await schoolsetup.findOne({
    $and: [
      { _id: req.body.schoolid }
    ],
  });
  const schoolname = resp.name;

  admin_model.findOneAndUpdate({ email: req.body.useremail },
    {
      schoolcollegetype: req.body.inistute,
      schoolcollegename: schoolname,
      schoolid: req.body.schoolid
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {

        return res.status(200).json({
          status: "save",
        });

      }
    });


})


////school setup

router.post('/schoolsetup', auth, async (req, res, next) => {

  const user = {
    id: req.body.id,
    name: req.body.name,
    address: req.body.address,
    phone: req.body.phone,
    email: req.body.email,
    website: req.body.website,
    inistute: req.body.inistute,
    enteredby: '',
    updateby: ''
  }
  if (user.id == null || user.name == null || user.address == null || user.phone == null || user.website == null)
    return res.sendStatus(400);

  const resp = await schoolsetup.findOne({
    $or: [
      { name: user.name }
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "exits",
    });


  try {
    const new_user = new schoolsetup(user);
    const save_user = await new_user.save();
    // const new_storepin = new Storepin(storepindata);
    // const storepindata = await new_storepin.save();
    if (save_user)
      /////insert into storepin no

      //end insert store pin
      return res.status(200).json({
        status: "save",
      });
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})
//
/// add admin user  admin login url router.post('/Adminloginsetup', async (req, res, next) => { 
router.post('/continuewithteacher', async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = {
    email: req.body.email,
    password: hashedPassword,
    usersrole: 'Teacher',
    schoolcollegetype: 'x',
    schoolcollegename: 'x',
    schoolid: 'x',
    fullname: req.body.fullname,
    userstatus: 'pending',
    enteredby: '',
    updateby: '',
    enteredtime: '',
    updatetime: ''
  }
  if (user.email == null || user.password == null)
    return res.sendStatus(400);

  const resp = await Adminmodel.findOne({
    $or: [
      { email: user.email }
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "userexits",
    });


  try {
    const new_user = new Adminmodel(user);
    const save_user = await new_user.save();
    if (save_user) {
      const token = jwt.sign({
        username: req.body.email,
        userId: '5635454353453454354354',
      }, process.env.JWT_token, {
        expiresIn: '12h'
      })
      res.status(200).json({
        "access_token": token,
        "status": "save",
        "email": req.body.email,
        "usersrole": 'Teacher',
        "schoolcollegename": 'x',
        "fullname": 'x'
      })
    }
    else {
      return res.status(400).json({
        status: "failed",
      });
    }

    ///////////////////////////////////////////////////////////////




    //////////////////////////////////////////////////////////////

  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/Editadminloginsetup', auth, async (req, res, next) => {
  console.log('monir' + req.body.schoolcollagename); //autoid 

  const resp = await schoolsetup.findOne({
    $and: [
      { _id: req.body.schoolcollagename },
    ],
  });
  const schoolname = resp.name;

  admin_model.findOneAndUpdate({ _id: req.body.autoid },
    {
      email: req.body.email,
      usersrole: req.body.userrole,
      schoolcollegetype: req.body.schoolcollegetype,
      schoolcollegename: schoolname,
      schoolid: req.body.schoolcollagename,
      fullname: req.body.fullname,
      userstatus: req.body.userstatus,
      enteredby: req.username,
      updateby: req.username,
      enteredtime: '',
      updatetime: ''
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
        console.log(err)
      } else {

        return res.status(200).json({
          status: "save",
        });

      }
    });



})

/// add admin user  admin login url router.post('/Adminloginsetup', async (req, res, next) => { 
router.post('/adminsetup', async (req, res, next) => {
  console.log(req.body);
  console.log('..password ' + req.body.password);
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = {
    email: req.body.email,
    password: hashedPassword,
    usersrole: req.body.usersrole,
    schoolcollegetype: req.body.schoolcollegetype,
    schoolcollegename: req.body.schoolname,
    schoolid: req.body.schoolid,
    fullname: req.body.fullname,
    userstatus: req.body.userstatus,
    enteredby: '',
    updateby: '',
    enteredtime: '',
    updatetime: ''
  }
  if (user.email == null || user.password == null)
    return res.sendStatus(400);

  const resp = await Adminmodel.findOne({
    $or: [
      { email: user.email }
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "userexits",
    });


  try {
    const new_user = new Adminmodel(user);
    const save_user = await new_user.save();
    if (save_user)
      return res.status(200).json({
        status: "save",
      });
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


/// add admin user  admin login url router.post('/Adminloginsetup', async (req, res, next) => { 
router.post('/Adminloginsetup', async (req, res, next) => {
  console.log(req.body);
  console.log('..password ' + req.body.password);



})
//verify code 
router.post('/verifymobile', async (req, res, next) => {
  console.log(req.body);
  //mobile,code1,code2,code3,code4
  const user = {
    mobile: req.body.mobile,
    code1: req.body.code1,
    code2: req.body.code2,
    code3: req.body.code3,
    code4: req.body.code4
  };
  var pinno = req.body.code1 + "" + code2 + "" + code3 + "" + code4;
  console.log(pinno);

  // check into the registration table if user is exits
  const resp = await Storepin.findOne({
    $or: [
      { mobileno: user.mobile }, { pinno: pinno },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "found",
    });
  if (resp == null)
    return res.status(400).json({
      status: "notfound",
    });

})
// all area list
router.get(
  "/xdistpage",
  (req, res, next) => {
    xdist.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//workingtype
router.get(
  "/workingtype",
  (req, res, next) => {
    xdist.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
//AllCategory

router.get(
  "/areatype",
  (req, res, next) => {
    xcategory.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);



// gas category type

router.get(
  "/gascategorylist/:categoryid", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.categoryid);
    const resp = await xsubcategory.find({
      $and: [
        { categoryid: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//shopping sub category list
router.get(
  "/shoppingsubcategorylist/:categoryid", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.categoryid);
    const resp = await xsubcategory.find({
      $and: [
        { categoryid: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

/////shopping sub category for website add product dropdown menu

router.get(
  "/shoppingdropdownsubcategory",
  (req, res, next) => {
    xsubcategory.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

// list

///// food menu category list
router.get(
  "/foodmenulist",
  (req, res, next) => {
    xcategoryfood.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

// list


//router.get(
//"/subcategory", async (req, res, next) => {
//xsubcategory.find()
//.exec()
//.then((resp) => {
// return res.status(200).json(resp);
// })
//.catch((err) => {
//  return res.sendStatus(500);
// });
//}
//);

//router.get(
//"/subcategory/:categoryid/:page/:limit", async (req, res, next) => {
router.get(
  "/findfirstquestion/:examid/:studentid/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await quizsetup.find({
      $and: [
        { examid: req.params.examid }
      ]
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);



router.get(
  "/subcategory/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await xsubcategory.find()
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/shopfilter/:categoryid", async (req, res, next) => {
    console.log(req.params.categoryid);
    const resp = await Addnewproduct.find({
      $and: [
        { subcategory: req.params.categoryid }
      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//shopping list subcategory list
router.get(
  "/shoppingsubcategory/:categoryid/:page/:limit", async (req, res, next) => {
    console.log(req.params.categoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await Addnewproduct.find({
      $and: [
        { subcategory: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//shopping list single item show
router.get(
  "/shoppingsingleitem/:categoryid/:page/:limit", async (req, res, next) => {
    console.log(req.params.categoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await Addnewproduct.find({
      $and: [
        { _id: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//manager own product show 

router.get(
  "/managerownproductshow/:email/:page/:limit", async (req, res, next) => {
    console.log(req.params.categoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await Addnewproduct.find({
      $and: [
        { serviceholderid: req.params.email }

      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


// food categories setup



router.get(
  "/neartoyou/:xlat/:xlong/:categorytype/:page/:limit", async (req, res, next) => {
    console.log(req.params.categoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await reg.find({
      $and: [
        { categorytype: req.params.categorytype }

      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.get(
  "/studentinfosingle/:username", async (req, res, next) => {
    console.log('req....' + req.params.username);
    const resp = await newstudent.find({
      $and: [
        { studentid: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);



router.get(
  "/studentviewprofile/:username", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await newstudent.find({
      $and: [
        { studentid: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/teacherviewprofile/:username", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await admin_model.find({
      $and: [
        { email: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//View Profile page List
router.get(
  "/viewprofile/:username", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await reg.find({
      $and: [
        { email: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/addnewproductview/:id", async (req, res, next) => {
    console.log(req.params.id);
    const resp = await Addnewproduct.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.get(
  "/viewprofileimage/:username", async (req, res, next) => {
    console.log(req.params.username);
    const resp = await Uploadprofile.find({
      $and: [
        { email: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
//Service Holder List
router.get(
  "/serviceholder/:categorytype/:workingarea/:page/:limit", async (req, res, next) => {
    console.log(req.params.categorytype)
    const resp = await reg.find({
      $and: [
        { categorytype: req.params.categorytype },
        { workingarea: req.params.workingarea },
      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
//service holder product list


//Service Holder List
router.get(
  "/gasproductlist/:categoryid/:page/:limit", async (req, res, next) => {
    console.log(req.params.categoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await Addnewproduct.find({
      $and: [
        { worker_categoryid: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//////////////////////////
router.get(
  "/mobilecategory/:categoryid", async (req, res, next) => {

    // gascategories.find()
    console.log('Service HOlder Image' + req.params.categoryid);
    const resp = await Addnewproduct.find({
      $and: [
        { worker_categoryid: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

//////////////////////////



router.get(
  "/mobilecategory____/:categoryid", async (req, res, next) => {
    console.log(req.params.categoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await Addnewproduct.find({
      $and: [
        { worker_categoryid: req.params.categoryid }

      ],
    })
      .exec()
      .then((resp) => {

        return res.status(200).json(resp);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);



router.get(
  "/gassubcategoryproductlist/:categoryid/:subcategoryid/:page/:limit", async (req, res, next) => {
    console.log(req.params.categoryid)
    console.log(req.params.subcategoryid)
    // const resp = await Addnewproduct.find() //worker_categoryid
    const resp = await Addnewproduct.find({
      $and: [
        { worker_categoryid: req.params.categoryid },
        { subcategory: req.params.subcategoryid }

      ],
    })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//service holder product list

router.get(
  "/serviceholderproductlist/:serviceholderid", async (req, res, next) => {
    console.log('Service HOlder Image' + req.params.serviceholderid);
    const resp = await Addnewproduct.find({
      $and: [
        { serviceholderid: req.params.serviceholderid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

// find the users list from database
router.get(
  "/users",
  /*   function(req, res) {
    res.send('Hello World') */
  (req, res, next) => {
    reg.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });


  }
);
//test

//examslist
router.get(
  "/getexamname/:id", auth,
  (req, res, next) => {
    examsetup.find({ schoolcollegid: req.params.id })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
router.get(
  "/examslistteacher/:id/:teacherid/:page/:limit", async (req, res, next) => {
    // console.log(req.params.id);
    const resp = await examsetup.find({
      $and: [
        { schoolcollegid: req.params.id }, { enteredby: req.params.teacherid }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

        //return res.status(200).json(resp);




      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/examslistteacherfilter/:id/:teacherid/:classname/:subjectname/:version/:page/:limit", auth, async (req, res, next) => {
     console.log(req.params.subjectname);
    const resp = await examsetup.find({
      schoolcollegid: req.params.id,
      enteredby: req.params.teacherid,
      classname: req.params.classname,
      versionname: req.params.version,
      subjectname: req.params.subjectname
    }
    ).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/examslistfindbyteacher/:id/:teacherid/:subjectname/:page/:limit", async (req, res, next) => {
    console.log(req.params.subjectname);
    const resp = await examsetup.find({
      schoolcollegid: req.params.id,
      enteredby: req.params.teacherid,
      //examname: {$regex: req.params.subjectname, $options: 'i'}
      examname: req.params.subjectname
    }
    ).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/findexamsbysearch/:examname/:page/:limit", async (req, res, next) => {
    console.log(req.params.examname);
    const resp = await examsetup.find({
     // schoolcollegid: req.params.id,
     // enteredby: req.params.teacherid,
  //    examname: {$regex: req.params.examname, $options: 'i'}
      examname: req.params.examname
    }
    ).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/teacherallexammname/:id/:teacherid/:page/:limit", async (req, res, next) => {
    console.log('hook' + req.params.teacherid);
    const resp = await examsetup.find({
      schoolcollegid: req.params.id,
      enteredby: req.params.teacherid
    }
    ).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);



router.get(
  "/examslistadmin/:examstatus/:page/:limit", auth, async (req, res, next) => {
    // console.log(req.params.version);
    const resp = await examsetup.find().sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);



router.get(
  "/examslist/:id", auth,
  (req, res, next) => {
    examsetup.find({ schoolcollegid: req.params.id })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


//find userlist form database
router.get(
  "/userslist/:page/:limit",
  async(req, res, next) => {
    admin_model.find().sort({ _id: -1 })
      .exec()
      .then((resp) => {
        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        return res.status(200).json(result);
       // return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
router.get(
  "/studentexamresult/:studentid/:page/:limit", async (req, res, next) => {
    const resp = await studentexamid.find({
      $and: [
        { studentexamid: req.params.studentid },
        { examstatus: 'S-C' }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        return res.status(200).json(result);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/examlist/:page/:limit", async (req, res, next) => {
    // console.log(req.params.id);
    const resp = await studentexamid.find().sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

        //return res.status(200).json(resp);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//examlist
router.get(
  "/examlist___",
  (req, res, next) => {
    student_exam.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


// find the schoollist list from database
router.get(
  "/schoollist",
  (req, res, next) => {
    schoolsetup.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);




// find the schoollist list from database
router.get(
  "/subjectlist___", auth,
  (req, res, next) => {
    subjectsetup.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);



// find the users list from database
router.get(
  "/adminlist",
  (req, res, next) => {
    Adminmodel.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
// admin panel website datalist
router.get(
  "/allsubcategory",
  (req, res, next) => {
    xsubcategory.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);
router.post('/posts', (req, res) => {
  res.send('Welcome to your posts');
  const post = new Post({
    title: req.body.title,
    description: req.body.description
  })
  post.save()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      res.json({ message: err })
    })
})
//router.post('/storepin', async (req, res, next) => {



router.post('/signupworker', async (req, res, next) => {
  //console.log(req.body);
  const user = {
    id: req.body.email,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobileno: req.body.mobileno,
    thanaid: ''

  };

  if (user.name == null || user.password == null || user.email == null || user.mobileno == null)
    return res.sendStatus(400);

  const resp = await reg.findOne({
    $or: [
      { email: user.email }
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "userexits",
    });

  try {
    const new_user = new reg(user);
    const save_user = await new_user.save();
    // const new_storepin = new Storepin(user);
    //const storepindata = await new_storepin.save();
    if (save_user)

      return res.status(200).json({
        status: "save",
      });
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


// worker signup
router.post('/signupworker_off', async (req, res, next) => {
  console.log('body here....' + req.body);
  //var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const user = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobileno: req.body.mobileno

  };

  if (user.name == null || user.password == null || user.email == null || user.mobileno == null)
    return res.sendStatus(400);

  const resp = await reg.findOne({
    $or: [
      { email: user.email }
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "userexits",
    });

  try {
    const new_user = new reg(user);
    const save_user = await new_user.save();

    return res.status(200).json({
      status: "save",
    });
    var token = jwt.sign(jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    console.log('ffggfff: ' + token);
    //return res.status(200).send({ auth: true, token: token });

  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


//end worker signup
router.post('/signup', async (req, res, next) => {
  console.log(req.body);
  const user = {
    id: req.body.id,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    mobileno: req.body.mobileno,
    ip: req.body.ip,
    location: req.body.location,
    distid: req.body.distid,
    uid: req.body.uid,
    thanaid: req.body.thanaid,
    areaid: req.body.areaid,
    picture: req.body.picture,
    categorytype: req.body.categorytype,
    userstatus: req.body.userstatus,
    address: req.body.address,
    companyname: req.body.companyname,
    gender: req.body.gender,
    workingarea: req.body.workingarea,
    status: req.body.status,
    UpdateTime: req.body.UpdateTime,
    voterid: req.body.voterid,
    usertoken: req.body.usertoken,
    area: req.body.area,
    apartment: req.body.apartment,
    detailaddress: req.body.detailaddress,
    image: req.body.image,
    profilestatus: req.body.profilestatus,
    facebookprofile: req.body.facebookprofile,
    discount: req.body.discount,
    deliveryfee: req.body.deliveryfee,
    xlat: req.body.xlat,
    xlong: req.body.xlong,
    ownertype: req.body.ownertype,
    paymenttype: req.body.paymenttype
  };
  const storepindata = {
    mobileno: req.body.mobileno,
    email: req.body.email,
    pinno: req.body.pinno,
    status: '1'
  }


  const resp = await reg.findOne({
    $or: [
      { email: user.email },
      { mobileno: user.mobileno },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "userexits",
    });

  try {
    const new_user = new reg(user);
    const save_user = await new_user.save();
    const new_storepin = new Storepin(user);
    const storepindata = await new_storepin.save();
    if (save_user)
      /////insert into storepin no

      //end insert store pin
      return res.status(200).json({
        status: "save",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})
///////////////order header entry
router.post('/xorderheaderentry', async (req, res, next) => {
  console.log('datafile:' + req.body);
  var status = 'Active';

  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  // prints date & time in YYYY-MM-DD format
  var datetime = year + "-" + month + "-" + date;
  const user = {
    orderid: req.body.orderid,
    cname: req.body.cname,
    cfirstname: req.body.cfirstname,
    clastname: req.body.clastname,
    caddress: req.body.caddress,
    capartment: req.body.capartment,
    ccity: req.body.ccity,
    date: datetime

  };


  try {
    const new_user = new xordeheader(user);
    const save_user = await new_user.save();

    if (save_user)
      return res.status(200).json({
        status: "save",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

// order insert into database 
router.post('/xorderentry', async (req, res, next) => {
  console.log('datafile:' + req.body);
  var status = 'Active';
  var datetime = new Date();
  console.log(datetime);
  /////////////////////////////////////////////////////////////////
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  // prints date & time in YYYY-MM-DD format
  var datetime = year + "-" + month + "-" + date;
  /////////////////////////////////////////////////////////////////
  const user = {
    orderid: req.body.orderid,
    productid: req.body.productid,
    productname: req.body.productname,
    productdescription: 'xxx',
    price: req.body.price,
    discount: req.body.discount,
    serviceholderid: req.body.serviceholderid,
    fromuser: req.body.fromuser,
    promocode: req.body.addpromocode,
    date: datetime

  };


  try {
    const new_user = new xorder(user);
    const save_user = await new_user.save();

    if (save_user)
      /////insert into storepin no

      //end insert store pin
      return res.status(200).json({
        status: "save",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})





router.post('/gascategorysetup', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new gascategories({

    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.bangla_name,
    status: req.body.status,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        id: req.body.id,
        english_name: req.body.english_name,
        bangla_name: req.body.bangla_name,
        status: req.body.status,
        profileImg: '/public/' + req.file.filename
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})


router.post('/distset', async (req, res, next) => {
  console.log(req.body);
  const user = {
    distid: req.body.distid,
    distname_eng: req.body.distname_eng,
    distname_ban: req.body.distname_ban,
    status: '1',
  };
  const resp = await xdist.findOne({
    $or: [
      { distname_eng: user.distname_eng },
      { distname_ban: user.distname_ban },
      { distid: user.distid },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      message: "Duplicate Value",
    });

  try {
    const new_user = new xdist(user);
    const save_user = await new_user.save();
    if (save_user)
      return res.status(200).json({
        message: "added successffuly",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

// Main all  categories setup
router.post('/mainallcategoriessetup', async (req, res, next) => {
  console.log(req.body);
  const user = {
    id: req.body.id,
    name_eng: req.body.name_eng,
    name_ban: req.body.name_ban,
    status: '1',
  };
  const resp = await Foodcategories.findOne({
    $or: [
      { name_eng: user.name_eng },
      { name_ban: user.name_ban },
      { id: user.id },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      message: "Duplicate Value",
    });

  try {
    const new_user = new Foodcategories(user);
    const save_user = await new_user.save();
    if (save_user)
      return res.status(200).json({
        message: "added successffuly",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


// food categories setup
router.post('/foodcategoriessetup', async (req, res, next) => {
  console.log(req.body);
  const user = {
    id: req.body.id,
    name_eng: req.body.name_eng,
    name_ban: req.body.name_ban,
    status: '1',
  };
  const resp = await Foodcategories.findOne({
    $or: [
      { name_eng: user.name_eng },
      { name_ban: user.name_ban },
      { id: user.id },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      message: "Duplicate Value",
    });

  try {
    const new_user = new Foodcategories(user);
    const save_user = await new_user.save();
    if (save_user)
      return res.status(200).json({
        message: "added successffuly",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})
// add all cateory 



router.get(
  "/subcategorysetupedit/:id", async (req, res, next) => {
    console.log(req.params.id);
    const resp = await xsubcategory.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.post('/subcategorysetup', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new xsubcategory({
    categoryid: req.body.categoryid,
    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.bangla_name,
    status: req.body.status,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        categoryid: req.body.categoryid,
        id: req.body.id,
        english_name: req.body.english_name,
        bangla_name: req.body.bangla_name,
        status: req.body.status,
        profileImg: '/public/' + req.file.filename
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})

///////food category setup

router.post('/foodmenucategorysetup', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new xcategoryfood({

    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.bangla_name,
    status: req.body.status,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        id: req.body.id,
        english_name: req.body.english_name,
        bangla_name: req.body.bangla_name,
        status: req.body.status,
        profileImg: '/public/' + req.file.filename
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})

////end food category
router.post('/setupallcategory', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new xcategory({
    categoryid: req.body.categoryid,
    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.bangla_name,
    status: req.body.status,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        categoryid: req.body.categoryid,
        id: req.body.id,
        english_name: req.body.english_name,
        bangla_name: req.body.bangla_name,
        status: req.body.status,
        profileImg: '/public/' + req.file.filename
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})

///////////////////////////////////////////////////////////////////////////////
/* router.post('/setupallcategory', async (req, res, next) => {
  console.log(req.body);
  const user = {
    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.bangla_name,
    status: req.body.status,
    profileImg: req.body.profileImg
  };
  const resp = await xcategory.findOne({
    $or: [
      { english_name: user.english_name },
      { bangla_name: user.bangla_name },
      { id: user.id },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      message: "Duplicate Value",
    });

  try {
    const new_user = new xcategory(user);
    const save_user = await new_user.save();
    if (save_user)
      return res.status(200).json({
        message: "added successffuly",
      });
    else res.sendStatus(400);
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

}) */
//verifymobile
//workersignin
router.post('/workersignin', async (req, res, next) => {
  console.log(req.body);
  const user = {
    email: req.body.email,
    password: req.body.password,
    new_area: req.body.new_area
  };
  // check into the registration table if user is exits
  const resp = await reg.findOne({
    $and: [
      { email: user.email }, { password: user.password }, { categorytype: user.new_area },
    ],
  });

  if (resp !== null)
    return res.status(400).json({
      status: "found",
    });
  if (resp == null)
    return res.status(400).json({
      status: "notfound",
    });

})

router.get('/dblist/:id', async (req, res, next) => {

  const resp = await admin_model.find({ email: req.params.id })
  console.log('mmmm' + resp[0].email)
})

//end workersignin
//webserviceholderlogin
router.post('/webserviceholderlogin', async (req, res, next) => {
  //console.log(req.body);
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  // check into the registration table if user is exits
  const resp = await reg.findOne({
    $and: [
      { email: user.email }, { password: user.password }
    ],
  });

  if (resp !== null) {
    res.send('found')
  }

  if (resp == null)
    res.send('notfound')

})

router.post('/studentlogin', async (req, res, next) => {
  //console.log(req.body);
  try {
    const user = await newstudent.find({ studentid: req.body.email });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
      if (isValidPassword) {
        const token = jwt.sign({
          username: req.body.email,
          userId: user[0]._id,
        }, process.env.JWT_token, {
          expiresIn: '12h'
        })
        const resp = await newstudent.find({ studentid: req.body.email })
        res.status(200).json({
          "access_token": token,
          "message": "found",
          "email": resp[0].studentid,
          "examid": resp[0].examid,
          "fullname": resp[0].studentname,
          "classname": resp[0].classname,
          "groupname": resp[0].groupname,
          "sectionname": resp[0].sectionname,
          "versionname": resp[0].versionname
        })
      }
      else {
        res.send('Unauthorized')
      }

    }
    else {
      res.send('Unauthorized f')
    }

    ///////////////////////////////////////////
  }
  catch {
    res.send('Unauthorized');
  }

})


///////////////////////////////////////////////////

router.post('/emailaddresscheck', async (req, res, next) => {
  //console.log(req.body);

  try {
    const user = await newstudent.find({ email: req.body.mobileno });
    if (user && user.length > 0) {
      res.status(200).json({ message: "emailfound" })
    }
    else {
      res.status(200).json({ message: "emailnotfound" })
    }

    ///////////////////////////////////////////
  }
  catch (error) {
    res.status(200).json({ message: "error" })
  }


})




//////////////////////////////////////////////

router.post('/adminlogin', async (req, res, next) => {
  console.log(req.body);

  try {
    const user = await admin_model.find({ email: req.body.email });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
      if (isValidPassword) {
        const token = jwt.sign({
          username: req.body.email,
          userId: user[0]._id,
        }, process.env.JWT_token, {
          expiresIn: '12h'
        })
        const resp = await admin_model.find({ email: req.body.email })
        res.status(200).json({
          "access_token": token,
          "message": "found",
          "email": resp[0].email,
          "usersrole": resp[0].usersrole,
          "schoolcollegename": resp[0].schoolcollegename,
          "schoolid": resp[0].schoolid,
          "fullname": resp[0].fullname,
          "schoolcollegetype": resp[0].schoolcollegetype
        })
      }
      else {
        res.send('Unauthorized')
      }

    }
    else {
      res.send('Unauthorized f')
    }

    ///////////////////////////////////////////
  }
  catch (error) {
    res.send('Unauthorized yyyy');
    console.log(error)
  }


})

////////mobile login
router.post('/mobilelogin', async (req, res, next) => {
  console.log(req.body);

  try {
    const user = await newstudent.find({ email: req.body.email });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(req.body.password, user[0].password);
      if (isValidPassword) {
        const token = jwt.sign({
          username: req.body.email,
          userId: user[0]._id,
        }, process.env.JWT_token, {
          expiresIn: '12h'
        })
        const resp = await newstudent.find({ email: req.body.email })
        res.status(200).json({
          "access_token": token,
          "message": "found",
          "email": resp[0].email,
          "mobileno": resp[0].mobileno,
          "studentid": resp[0].studentid,
          "fullname": resp[0].studentname,
          "classname": resp[0].classname
        })
      }
      else {
        res.status(200).json({
          "message": "notfound"
        })
      }

    }
    else {
      res.send('Unauthorized f')
    }

    ///////////////////////////////////////////
  }
  catch (error) {
    res.send('Unauthorized yyyy');
    console.log(error)
  }


})





//end webserviceholderlogin

//end webserviceholderlogin

//user profile image
router.post('/userprofile', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new Uploadprofile({
    email: req.body.email,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename

  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        email: req.body.email,
        profileImg: result.profileImg
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})
/////////////////////////////////////////////////////////////////////////////

//edit image
/*router.post('/editimgprd', (req, res, next) => {

console.log('is:::' + req.body);

    Addnewproduct.findByIdAndUpdate(
    {
      _id: req.body.id
    },
    {
      discount: '500'
    }, 
    function(err, docs){
     if(err) res.json(err);
    else
    { 
       console.log('doc....' + docs);
      // res.redirect('/user/'+req.params.id);
     }
     });   


})
*/
/*router.post('/addnewproductupdate', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body);
  console.log('is:::' + req.body);

    Addnewproduct.findByIdAndUpdate(
    {
      _id: req.body.id
    },
    {
      discount: '500',
      profileImg: '/public/' + req.file.filename,

    }, 
    function(err, docs){
     if(err) res.json(err);
    else
    { 
       console.log('doc....' + docs);
      // res.redirect('/user/'+req.params.id);
     }
     });   

})*/
router.get(
  "/addnewproductview/:id", async (req, res, next) => {
    console.log(req.params.id);
    const resp = await Addnewproduct.find({
      $and: [
        { _id: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
/////////////////////////////////////////////////////////////////////////////

//add new product
router.post('/addnewproduct', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('BOdy....' + req.body);
  const user = new Addnewproduct({

    productname: req.body.productname,
    description: req.body.description,
    price: req.body.price,
    discount: req.body.discount,
    status: req.body.status,
    email: req.body.email,
    serviceholderid: req.body.serviceholderid,
    worker_categoryid: req.body.worker_categoryid,
    subcategory: req.body.subcategory,
    Vat: req.body.Vat,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename,
    ownerid: req.body.ownerid,
    status: req.body.status,
    sku: req.body.sku,
    vedio: req.body.vedio,
    tag: req.body.tag,
    solditem: req.body.solditem,

  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      /*       userCreated: {
              _id: result._id,
              productname: req.body.productname,
              description: req.body.description,
              price: req.body.price,
              discount: req.body.discount,
              status: req.body.status,
              email: req.body.email,
              serviceholderid: req.body.serviceholderid,
              worker_categoryid: req.body.worker_categoryid,
              subcategory: req.body.subcategory,
              Vat: req.body.Vat,
              // profileImg: url + '/public/' + req.file.filename // image upload with url
              profileImg: '/public/' + req.file.filename,
              ownerid: req.body.ownerid,
              status: req.body.status
            } */
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})

//end add new product


//add new product
router.post('/categorysetup', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('Email Address....' + req.body.email);
  const user = new xcategory({
    id: req.body.id,
    english_name: req.body.english_name,
    bangla_name: req.body.english_name,
    status: req.body.status,
    // profileImg: url + '/public/' + req.file.filename // image upload with url
    profileImg: '/public/' + req.file.filename
  });
  user.save().then(result => {
    res.status(201).json({
      message: "User registered successfully!",
      userCreated: {
        _id: result._id,
        id: req.body.id,
        english_name: req.body.english_name,
        bangla_name: req.body.bangla_name,
        status: req.body.status,
        // profileImg: url + '/public/' + req.file.filename // image upload with url
        profileImg: '/public/' + req.file.filename
      }
    })
  }).catch(err => {
    console.log(err),
      res.status(500).json({
        error: err
      });
  })
})

//end add new product

// delete categories
//api for Delete data from database 

router.post("/delete_exam", auth, function (req, res) {
  examsetup.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.post("/deletestudentpackage", function (req, res) {
  bkash_model.remove({ _id: req.body.ID }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.get("/deleteallexam", function (req, res) {

  studentexamid.remove({}, function (err, removed) {
  });
  res.send('ok');
})
router.get("/deleteallstudentanswer", function (req, res) {

  answer.remove({}, function (err, removed) {
  });
  res.send('ok');
})


router.post("/delete_subcategories", function (req, res) {
  console.log('id here....' + req.body.id);
  xsubcategory.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      //////////////////////////////////////////////////////////////////
      /* 	const resp = xsubcategory.findOne({
        $and: [
        { _id: req.body.id }
        ],
        });
        if (resp.profileImg)
        {
          console.log(resp.profileImg);
        //fs.unlinkSync(`/public/${resp.profileImg}`);	
        } */
      //if (resp.profileImg !== 'undefined')
      // unlinkSync('/public/1614703816853-1.jpg');
      //unlinkSync('/tmp/hello');
      // return res.status(400).json({
      //   status: "found",
      // });
      //if (resp == 'undefined')
      //  return res.status(400).json({
      //    status: "notfound",
      //  });




      res.send({ status: "Record has been Deleted..!!" });
      //////////////////////////////////////////////////////////////////

    }
  });
})
router.post("/delete_categories", function (req, res) {
  xcategory.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send({ data: "Record has been Deleted..!!" });
    }
  });
})

//update product
//delete_quiz
router.post("/delete_quiz", auth, function (req, res) {
  // console.log(req.body.id);
  quizsetup.deleteOne({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})
//delete_class
router.post("/delete_class", auth, function (req, res) {
  classsetup.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})


//delete_subject
router.post("/delete_section", auth, function (req, res) {
  Sectionsetup.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

//delete_subject
router.post("/delete_group", auth, function (req, res) {
  groupsetup.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})


//delete_subject
router.post("/delete_subject", auth, function (req, res) {
  subjectsetup.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.post("/delete_schoolcollege", function (req, res) {
  schoolsetup.deleteOne({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send("delete");
    }
  });
})

router.post("/delete_users", function (req, res) {
  admin_model.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})


router.post("/delete_product", function (req, res) {
  Addnewproduct.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send({ data: "Record has been Deleted..!!" });
    }
  });
})



router.post('/updateproduct____', async (req, res, next) => {
  console.log('monir' + req.body);

  if (!req.body._id) {
    console.log('not found');
    return;
  }

  Addnewproduct.findByIdAndUpdate({ _id: '602e77455d8c0b03fb8069a2' },
    {

      productname: 'Jamal'


    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        console.log('monir' + req.body._id);
        res.json(result);
      }
    });
});
//update updatestudentinformation
router.post('/updatestudentinformation', (req, res, next) => {
  if (!req.body.autoid) {
    console.log('not found');
    return;
  }
  newstudent.findOneAndUpdate({ studentid: req.body.studentid },
    {
      studentname: req.body.studentname,
      classname: req.body.classname,
      groupname: req.body.groupname,
      sectionname: req.body.sectionname,
      mobileno: req.body.mobileno,
      email: req.body.email,
      status: req.body.examstatus,
      updatetime: ''
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });

})
//allapproveexam

//update approveexam
router.get('/allapproveexam', (req, res, next) => {

  examsetup.findOneAndUpdate({ examstatus: 'Draft' },
    {
      examstatus: 'Publish'
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('update');
      }
    });

})


//update approveexam
router.get('/approveexam/:examid', (req, res, next) => {
  if (!req.params.examid) {
    console.log('not found');
    return;
  }
  examsetup.findOneAndUpdate({ _id: req.params.examid },
    {
      examstatus: 'Publish'
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });

})


//updateexamstatus
//update school informtion
router.post('/updateexamstatus', (req, res, next) => {
  if (!req.body.studentid) {
    console.log('not found');
    return;
  }
  student_exam.findOneAndUpdate({ studentid: req.body.studentid, examid: req.body.examid },
    {
      status: 'Recentactivity'
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });

})


//update school informtion
router.post('/updateexams', (req, res, next) => {
  if (!req.body.autoid) {
    console.log('not found');
    return;
  }
  examsetup.findOneAndUpdate({ _id: req.body.autoid },
    {
      examname: req.body.examname,
	    chapter: req.body.chapter,
      quizType: req.body.quizType,
      examtype: req.body.examtype,
      examdate: req.body.examdate,
      subjectname: req.body.subjectname,
      examtime: req.body.examtime,
      versionname: req.body.versionname,
      schoolcollegid: req.body.schoolcollegid,
      schoolcollegename: req.body.schoolcollegename,
      classname: req.body.classname,
      xgroup: req.body.xgroup,
      xsection: req.body.xsection,
      examfees: req.body.examfees,
      noofstudent: req.body.noofstudent,
      examstatus: req.body.examstatus,
      status: req.body.status,
      paymenttype: req.body.paymenttype,
      updatetime: Date.now()
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });

})

//studentinfosingle


///////////////update passwprd studen

//update school informtion
router.post('/studentupdatepassword', async (req, res, next) => {
  if (!req.body.studentid) {
    console.log('not found');
    return;
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  newstudent.findOneAndUpdate({ studentid: req.body.studentid },
    {
      password: hashedPassword,
      updatetime: Date.now()

    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });

})



//update school informtion
router.post('/updateschool', (req, res, next) => {

  console.log('is:::' + req.body.autoid);

  if (!req.body.autoid) {
    console.log('not found');
    return;
  }

  schoolsetup.findByIdAndUpdate({ _id: req.body.autoid },
    {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      website: req.body.website,
      enteredby: '',
      updateby: ''
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        console.log('monir' + req.body._id);
        // res.json(result); this is json data
        res.send('save');
      }
    });

})


//update school informtion
router.post('/updatesubject', (req, res, next) => {
  console.log('is:::' + req.body.subjectautoid);
  if (!req.body.subjectautoid) {
    console.log('not found');
    return;
  }

  subjectsetup.findByIdAndUpdate({ _id: req.body.subjectautoid },
    {
      parentid: req.body.schoolcollegeid,
      schoolcollegename: req.body.schoolcollegename,
      name: req.body.subjectname,
      inistutetype: req.body.inistutetype,
      enteredby: '',
      updateby: ''
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        console.log('monir' + req.body._id);
        // res.json(result); this is json data
        res.send('save');
      }
    });

})


router.post('/updateproduct', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('is:::' + req.body._id);

  if (!req.body._id) {
    console.log('not found');
    return;
  }

  Addnewproduct.findByIdAndUpdate({ _id: req.body._id },
    {

      productname: req.body.productname,
      description: req.body.description,
      price: req.body.price,
      discount: req.body.discount,
      status: req.body.status,
      //email: req.body.email,
      //serviceholderid: req.body.serviceholderid,
      worker_categoryid: req.body.worker_categoryid,
      subcategory: req.body.subcategory,
      Vat: req.body.Vat,
      // profileImg: url + '/public/' + req.file.filename // image upload with url
      //  profileImg: '/public/' + req.file.filename,
      //ownerid: req.body.ownerid,



    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        console.log('monir' + req.body._id);
        res.json(result);
      }
    });

})

router.post('/updatesubcategory', upload.single('profileImg'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log('is:::' + req.body._id);

  if (!req.body._id) {
    console.log('not found');
    return;
  }

  xsubcategory.findByIdAndUpdate({ _id: req.body._id },
    {

      id: req.body.subcategoriesid,
      categoryid: req.body.categoryid,
      english_name: req.body.english_name,
      bangla_name: req.body.bangla_name,
      status: req.body.status,


    },
    function (
      err,
      result
    ) {
      if (err) {


        res.send(err);
      } else {

        return res.status(400).json({
          status: "found",
        });
        //return res.status(403).send({ status: "Not Match" });
        // res.json(result);
      }
    });

})

////////////////////////////


/// mobile api start form here
// add new student
router.post('/Addnewstudentmobile', async (req, res, next) => {
  console.log(req.body);
  // console.log()
  if (req.body.studentname == '' || req.body.classname == '' || req.body.mobileno == '' || req.body.password == '') {
    return res.status(200).json({
      message: "required",
    });
  }
  else {
    //const password = "12345678";
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const std = Date.now().toString(36);

    //////if already checked mobile no
    const user = {
      studentid: std,
      password: hashedPassword,
      studentname: req.body.studentname,
      examid: '',
      examname: '',
      exam: {
        subexamid: '',
        subexamname: '',
        subexamdate: '',
        subexamtime: '',
      },
      classname: req.body.classname,
      groupname: req.body.groupname,
      sectionname: '',
      mobileno: req.body.mobileno,
      email: req.body.email,
      status: '',
      enteredby: req.username,
      updateby: req.username,
      enteredtime: 'Sign in mobile',
      updatetime: Date.now()

    }
    var mod = new newstudent(user);
    mod.save(function (err, data) {
      if (err) {
        res.send(err);
        res.send('error');
      }
      else {
        ///////////////////////////

        const token = jwt.sign({
          username: req.body.mobileno,
          userId: '0009',
        }, process.env.JWT_token, {
          expiresIn: '12h'
        })

        res.status(200).json({
          message: "success",
          access_token: token,
          studentid: std
        })

        //////////////////////////              

      }
    });

    /////end mobile no check

  }


})



//get subject list from classwise examamine school
router.get(
  "/subjectlist_mobile/:page/:limit", async (req, res, next) => {
    // console.log(req.params.page + 'ddddd')
    const resp = await subjectsetup.find({ schoolcollegename: 'Examamine School' })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/subjectexamaminelistmobile/:subjectname/:classname/:page/:limit", async (req, res, next) => {
    console.log(req.params)
    const resp = await examsetup.find(
      {
        schoolcollegename: 'Examamine School', 'classname': req.params.classname, 'subjectname': req.params.subjectname
      }
    )
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp.examname);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/examamineschoolallcourse/:classname/:page/:limit", async (req, res, next) => {
    const resp = await examsetup.find(
      {
        schoolcollegename: 'Examamine School', classname: req.params.classname
      }
    )
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp.examname);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);



router.get(
  "/resulthistory/:studentid/:page/:limit", async (req, res, next) => {
    // const sort = { _id: 1 }
    const resp = await studentexamid.find(
      {
        studentexamid: req.params.studentid
      }
    ).sort({ _id: -1 }) // decending holo -1 ar 1 or asending 
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp.examname);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/studentviewprofilemobile/:username", async (req, res, next) => {
    console.log('profile' + req.params.username);
    const resp = await newstudent.find({
      $and: [
        { email: req.params.username }

      ],
    })
      .exec()
      .then((resp) => {


        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.post('/updatestudentidmobile', async (req, res, next) => {
  if (req.body.mobileno == "" || req.body.studentid == "") {
    console.log('dddddd')
    res.status(200).json({
      "message": "require"
    })
    return;
  }

  newstudent.findOneAndUpdate({ mobileno: req.body.mobileno },
    {
      studentid: req.body.studentid,
      updatetime: Date.now()

    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.status(200).json({
          "message": "success"
        })
      }
    });

})

router.get('/studentexamidmobile/:examid/:studentid/:randomid', async (req, res, next) => {
  console.log(req.params);
  console.log('uuuuu')
  const user = {
    uid: req.params.randomid,
    examid: req.params.examid,
    studentexamid: req.params.studentid
  }
  try {
    const new_user = new studentexamid(user);
    const save_user = new_user.save();
    if (save_user)
      return res.status(200).json({
        status: req.params.randomid,
      });
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/mobile', async (req, res, next) => {

  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  console.log('dddd' + resp[0].examname, req.body.quizid);
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: req.body.answertype,
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: ''
  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


router.post('/playinsertfillinthegapmobile', async (req, res, next) => {
  console.log(req.body.answertype);
  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: req.body.answertype,
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: ''
  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})


router.post('/playingquizinsertmobile', async (req, res, next) => {

  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  const user = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: req.body.useranswer,
    answertype: '',
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: '',
    questiontype1: resp[0].questiontype1,
    questiontype2: resp[0].questiontype2,
    questiontype3: resp[0].questiontype3,
    questiontype4: resp[0].questiontype4,
    questiontype5: resp[0].questiontype5,
    questiontitle2: resp[0].questiontitle2,
    questiontitle3: resp[0].questiontitle3,
    questiontitle4: resp[0].questiontitle4,
    questiontitle5: resp[0].questiontitle5
  }

  try {
    const new_user = new answer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.get(
  "/studentuserlist",
  (req, res, next) => {
    newstudent.find()
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get(
  "/studentuserlistpage/:page/:limit", async (req, res, next) => {
    // console.log(req.params.id);
    const resp = await newstudent.find().sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

        //return res.status(200).json(resp);




      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/Mathsubject/:xclass/:xgroup/:versionname/:page/:limit", async (req, res, next) => {
    console.log(req.params.subjectname);
    const resp = await examsetup.find({
      $and: [
        //{ subjectname: new RegExp(req.params.subjectname, 'i')}
        { classname: req.params.xclass }, { xgroup: req.params.xgroup }, { versionname: req.params.versionname }

      ],
    }).sort({ _id: -1 })

      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.get(
  "/examimage/:examid", async (req, res, next) => {

    const resp = await examsetup.find({
      $and: [
        { _id: req.params.examid }

      ],
    })

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  });

router.get(
  "/draftexamlisttecher/:id/:teacherid/:page/:limit/:examstatus", async (req, res, next) => {
    // console.log(req.params.id);
    const resp = await examsetup.find({
      $and: [
        { schoolcollegid: req.params.id }, { enteredby: req.params.teacherid }, { examstatus: req.params.examstatus }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

        //return res.status(200).json(resp);




      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.post('/matchsaveall', auth, async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  console.log()
  try {
    ////////////////////////////////////////////////////////// req.body.autoincrement
    quizsetup.findByIdAndUpdate({ _id: req.body.automemberid },
      {
        questiontype: req.body.questiontype,
        questiontitle: req.body.questiontitle,
        Atype: req.body.Atype,
        Atitle: req.body.Atitle,
        Aimage: req.body.Aimage,
        Btype: req.body.Btype,
        Btitle: req.body.Btitle,
        Bimage: req.body.Bimage,
        Ctype: req.body.Ctype,
        Ctitle: req.body.Ctitle,
        Cimage: req.body.Cimage,
        Dtype: req.body.Dtype,
        Dtitle: req.body.Dtitle,
        Dimage: req.body.Dimage,
        Answer: req.body.Answer,
        writtinganswer: req.body.writtinganswer,
        quiztype: req.body.quiztype
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);
          //res.send('Failed to upload files');
        } else {
          console.log('ssssss')
          return res.status(200).json({
            status: "found",
          });
          //return res.status(403).send({ status: "Not Match" });
          // res.json(result);
        }
      });


    ///////////////////////////////////////////////////////////
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }


})


router.post('/insertMatch', async (req, res, next) => {

  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  console.log('dddd' + resp[0].examname, req.body.quizid);


  const user = {
    answerid: req.body.answerid,
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    Acolone: resp[0].questiontype,
    Acoltwo: resp[0].Atype,
    Acolthree: resp[0].Atitle,
    Acolfour: resp[0].Aimage,
    Acolfive: resp[0].Btype,
    Bcolone: resp[0].Btitle,
    Bcoltwo: resp[0].Bimage,
    Bcolthree: resp[0].Ctype,
    Bcolfour: resp[0].Ctitle,
    Bcolfive: resp[0].Cimage,
    Anscolone: req.body.Rightone,
    Anscoltwo: req.body.Righttwo,
    Anscolthree: req.body.Rightthree,
    Anscolfour: req.body.Rightfour,
    Anscolfive: req.body.Rightfive,
    MatchAnscolone: '',
    MatchAnscoltwo: '',
    MatchAnscolthree: '',
    MatchAnscolfour: '',
    MatchAnscolfive: ''

  }

  try {
    const new_user = new matchanswer(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save"
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/insertmatchfirst', async (req, res, next) => {

  const resp = await quizsetup.find({
    $and: [
      { _id: req.body.quizid }

    ],
  })
  console.log('dddd' + resp[0].examname, req.body.quizid);
  const questioninfo = {
    examrandomid: req.body.examrandomid,
    schoolcollegeid: resp[0].schoolcollegeid,
    subjectid: resp[0].subjectid,
    examid: resp[0].examid,
    examname: resp[0].examname,
    schooltype: resp[0].schooltype,
    schoolname: resp[0].schoolname,
    subject: resp[0].subject,
    xgroup: resp[0].xgroup,
    xsection: resp[0].xsection,
    quiztype: resp[0].quiztype,
    questiontype: resp[0].questiontype,
    questiontitle: resp[0].questiontitle,
    questionimage: resp[0].questionimage,
    Atype: resp[0].Atype,
    Atitle: resp[0].Atitle,
    Aimage: resp[0].Aimage,
    Btype: resp[0].Btype,
    Btitle: resp[0].Btitle,
    Bimage: resp[0].Bimage,
    Ctype: resp[0].Ctype,
    Ctitle: resp[0].Ctitle,
    Cimage: resp[0].Cimage,
    Dtype: resp[0].Dtype,
    Dtitle: resp[0].Dtitle,
    Dimage: resp[0].Dimage,
    Answer: resp[0].Answer,
    status: resp[0].status,
    point: resp[0].point,
    studentpoint: '0',
    parentquizid: req.body.quizid,
    studentid: req.body.studentid,
    examid: req.body.examid,
    useranswer: '',
    answertype: '',
    enteredby: req.username,
    updateby: req.username,
    UpdateTime: ''

  }

  try {
    const new_user = new answer(questioninfo);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
        data: {
          _id: new_user._id
        }
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.get("/deleteallanswer", function (req, res) {


  answer.remove({}, function (err, removed) {
  });
})

router.get(
  "/matchinfoshow/:examid", async (req, res, next) => {

    const resp = await matchanswer.find({
      $and: [
        { answerid: req.params.examid }

      ],
    })

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//correctanswer view transction
router.get(
  "/viewtransactioncorrect/:examid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { examid: req.params.examid }, { answertype: 'Correct' }

      ],
    }).count()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//correctanswer
router.get(
  "/correctanswer/:examid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { examrandomid: req.params.examid }, { answertype: 'Correct' }

      ],
    }).count()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
//incorrectanswer view transction
router.get(
  "/viewtransactionincorrect/:examid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { examid: req.params.examid }, { answertype: 'Incorrect' }

      ],
    }).count()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/incorrectanswer/:examid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { examrandomid: req.params.examid }, { answertype: 'Incorrect' }

      ],
    }).count()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
//studentname

router.get(
  "/studentname/:studentid", async (req, res, next) => {

    const resp = await newstudent.find({
      $and: [
        { studentid: req.params.studentid }

      ],
    })

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


//exampublishstatus
router.get(
  "/exampublishstatus/:examid", async (req, res, next) => {

    const resp = await examsetup.find({
      $and: [
        { _id: req.params.examid }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
//examid
router.get(
  "/examid/:id", async (req, res, next) => {

    const resp = await quizsetup.find({
      $and: [
        { examid: req.params.id }

      ],
    })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get("/delete_question/:id", function (req, res) {
  quizsetup.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.post("/deletestudentfromexam", auth, function (req, res) {

  student_exam.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.get(
  "/subjectwisedata/:classname/:xgroup/:versionname/:subjectname", async (req, res, next) => {

    console.log('xclass ' + req.params.classname)
    console.log('xgroup ' + req.params.xgroup)
    console.log('version name ' + req.params.versionname)
    console.log('subjectname ' + req.params.subjectname)

    const resp = await examsetup.find({
      $and: [
        { classname: req.params.classname },
        { xgroup: req.params.xgroup },
        { versionname: req.params.versionname },
        { subjectname: req.params.subjectname }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


router.get(
  "/subjectwisedatachapter/:classname/:xgroup/:versionname/:subjectname/:chapter", async (req, res, next) => {
    const resp = await examsetup.find({
      $and: [
        { classname: req.params.classname },
        { xgroup: req.params.xgroup },
        { versionname: req.params.versionname },
        { subjectname: req.params.subjectname },
		{ chapter: req.params.chapter }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);




//resulthistoryexamlist http://192.168.1.111:8081/subjectwisedata/S.S.C Model Test 2023/Science/Bangla Version/English 1st
router.get(
  "/resulthistoryexamlist/:xclass/:xgroup/:versionname", async (req, res, next) => {
    console.log(req.params.examstatus)
    console.log(req.params.status)
    const resp = await examsetup.find({
      $and: [
        { classname: req.params.xclass }, { xgroup: req.params.xgroup }, { versionname: req.params.versionname }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });


  }
);

router.get(
  "/ownexambystudent/:studentid", async (req, res, next) => {
    const resp = await answer.find({
      $and: [
        { studentid: req.params.studentid }

      ],
    }).sort({ _id: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);



router.get(
  "/coachingcourse/:xclass/:xgroup/:versionname", async (req, res, next) => {
    // const resp = await examsetup.find({
    //   $and: [
    //     { classname: req.params.xclass }, { xgroup: req.params.xgroup }, { versionname: req.params.versionname }
    //   ],
    // }).sort({ _id: -1 })
    //   .exec()
    //   .then((resp) => {
    //     return res.status(200).json(resp);
    //   })
    //   .catch((err) => {
    //     return res.sendStatus(500);
    //   });
    try {
      let query = {
        classname: req.params.xclass,
        xgroup: req.params.xgroup,
        versionname: req.params.versionname
      };
      // Check if the 'subjectname' query parameter is provided
      // if (req.query.subjectname) {
      //   query.subjectname = req.query.subjectname;
      // }
      // if (req.query.quiztype) {
      //   query.quiztype = req.query.quiztype;
      // }
      //console.log(' query::', query)
      const resp = await examsetup.find(query)
        .sort({ _id: -1 })
        .exec();
      return res.status(200).json(resp);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
  }
);

router.get('/subjectwisecourses', async (req, res) => {
  try {
    let query = {}; // Default empty query
    // Check if the 'subject' query parameter is provided
    if (req.query.classname) {
      // If 'subject' query parameter is provided, create a case-insensitive regex for partial matching
      query.classname = req.query.classname
    }
    if (req.query.group) {
      // If 'subject' query parameter is provided, create a case-insensitive regex for partial matching
      query.xgroup = req.query.group
    }
    if (req.query.version) {
      // If 'subject' query parameter is provided, create a case-insensitive regex for partial matching
      query.versionname = req.query.version
    }
    if (req.query.subject) {
      // If 'subject' query parameter is provided, create a case-insensitive regex for partial matching
      query.subjectname = req.query.subject
    }
    // Find documents based on the query
    const exams = await examsetup.find(query)
    res.json(exams);
  }catch(ex){
    res.status(500).json({ message: ex });
  }
});

//Get Uniq Subject Name 
router.get('/allSubjects', async (req, res) => {
  try {
    let query = {}; // Default empty query
    // Check if the 'subject' query parameter is provided
    if (req.query.subject) {
      // If 'subject' query parameter is provided, create a case-insensitive regex for partial matching
      query.name = { $regex: new RegExp(req.query.subject, 'i') };
    }
    // Find documents based on the query
    const subjects = await xsubjects.find(query).limit(20);
    res.json(subjects);
  }catch(ex){
    res.status(500).json({ message: ex });
  }
});

  router.get('/getPackages', (req, res) => {
    xpackages.find()
      .sort({ updatedAt: -1 })
      .exec()
      .then((resp) => {
        return res.status(200).json(resp); // Send the response once it's available
      })
      .catch((err) => {
        return res.sendStatus(500); // Handle errors appropriately
      });
  })

router.get('/package/:id', async (req, res) => {
  const { id } = req.params;
  // Validate the ID
  if (!ObjectId.isValid(id)) {
    // If the ID is not a valid ObjectId, respond with a 400 Bad Request status
    return res.status(400).json({ code:400,  message: 'Invalid ID format' });
  }else{
  try {
    const packageObj = await xpackages.findOne({
      _id: req.params.id,
    }).exec();
    // Check if package was found
    if (!packageObj) {
      // If no package is found, send a 404 Not Found response
      return res.status(404).json({ code:404, message: 'Package not found' });
    }
    // If a package is found, send a 200 OK response with the package data
    return res.status(200).json(packageObj);
  } catch (err) {
    // Handle any errors that occur during the database query
    console.error(err);
    return res.status(500).json({ code:500,  message: 'Internal server error' });
  }
}
})

router.post('/addPackage', (req,res)=> {
  const packageObj = new xpackages({
    packagename: req.body.packagename,
    type: req.body.type,
    class: req.body.classname,
    versionname: req.body.versionname,
    group: req.body.group,
    price: req.body.price
  });
  packageObj.save().then(result => {
    res.status(201).json({
      message: "Created",
    })
  }).catch(err => {
      res.status(500).json({
        error: err
      });
  })
})

router.put('/updatePackage/:id', async (req, res) => {
  const { id } = req.params;

  // Validate the ID
  if (!ObjectId.isValid(id)) {
      // If the ID is not valid, respond with a 400 Bad Request status
      return res.status(400).json({ message: 'Invalid ID format' });
  }
  // Get the updated data from the request body
  const updatedData = req.body;

  try {
      // Find the package by ID and update its fields
      const updatedPackage = await xpackages.findByIdAndUpdate(
          id,
          updatedData,
          { new: true } // Return the updated package
      ).exec();

      // Check if package was found and updated
      if (!updatedPackage) {
          // If no package is found, send a 404 Not Found response
          return res.status(404).json({ message: 'Package not found' });
      }

      // If package was found and updated successfully, send a 200 OK response with the updated package data
      return res.status(200).json(updatedPackage);
  } catch (err) {
      // Handle any errors that occur during the update process
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/deletePackage/:id', (req, res) => {
  xpackages.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      return res.status(200).json({
        status: "deleted",
      });
    }
  });
})

router.get('/getPackagePrice', async (req, res) => {
  try {
    let query = {}; 
    if (req.query.classname) {
      query.class = req.query.classname
    }
    if (req.query.group) {
      query.group = req.query.group
    }
    if (req.query.version) {
      query.versionname = req.query.version
    }
    if (req.query.type) {
      query.type = req.query.type
    }
    const packageObj = await xpackages.findOne(query)
    res.json(packageObj);
  }catch(ex){
    res.status(500).json({ message: ex });
  }
});

//get all courses Group_By Subjectname from the "xexams" collection
router.get("/allcourses", async (req, res, next) => {
  try {
  const { classname, group, version, subject } = req.query;

  // Construct the aggregation pipeline based on the provided filters
  let pipeline = [
    {
      $match: {}
    },
    {
      $group: {
        _id: '$subjectname', // Group by subjectname
        count: { $sum: 1 }, // Count the occurrences of each subjectname
        id: { $first: '$_id' } // Take the _id of the first document in each group
      }
    },
    {
      $project: {
        _id: '$id', // Project the _id field
        subjectname: '$_id', // Project the subjectname
        count: 1 // Project the count field
      }
    }
  ];

  // Add filter conditions based on the provided parameters
  if (classname) {
    pipeline[0].$match.classname = classname;
  }
  if (group) {
    pipeline[0].$match.xgroup = group;
  }
  if (version) {
    pipeline[0].$match.versionname = version;
  }
  if(subject){
    pipeline[0].$match.subjectname = subject;
  }

  // Execute the aggregation pipeline
  const result = await examsetup.aggregate(pipeline);
  // Send the aggregated result as the response
  res.json({result, totalCount: result.length});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/bkashpaymentonline', async (req, res, next) => {
	const nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Dhaka'
	});

  const user = {
    studentid: req.body.studentid,
    packageid: req.body.packageid,
    packagename: req.body.packagename,
    classname: req.body.classname,
    groupname: req.body.groupname,
    mobileno: req.body.bkashno,
    transid: req.body.transid,
    purchasedate: nDate,
    amount: req.body.amount,
    examname: req.body.classname,
    status: 'approved',
    currency: req.body.currency,
    enteredby: req.username,
    updateby: req.username,
    enteredtime: nDate,
    updatetime: nDate 
  }

  try {
    const new_user = new bkash_model(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
      })

    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.post('/bkashpayment', async (req, res, next) => {
	const nDate = new Date().toLocaleString('en-US', {
	timeZone: 'Asia/Dhaka'
	});

  const user = {
    studentid: req.body.studentid,
    packageid: req.body.packageid,
    packagename: req.body.packagename,
    classname: req.body.className,
    groupname: req.body.groupname,
    purchasedate: nDate,
    type: req.body.type,
    amount: req.body.amount,
    currency: req.body.currency,
    status: 'approved',
    version: req.body.version,
    invNo: req.body.invNo,
    reference: req.body.reference,
    mobileno: req.body.bkashno,
    trxID: req.body.trxID,
    paymentID: req.body.paymentID,
    bkashObject: req.body.bkashObj
  }

  const existingUser = await bkash_model.findOne({
    studentid: req.body.studentid,
    packageid: req.body.packageid
  });
  if (existingUser) {
    return res.status(400).json({
      status: "exist",
    });
  }

  try {
    const new_user = new bkash_model(user);
    const save_user = await new_user.save();
    if (save_user)
      res.status(200).json({
        message: "success",
      })
    else
      return res.status(400).json({
        status: "failed",
      });
  } catch (e) {
    return res.status(500).json(e);
  }
})


router.post('/insertpaymentbkash', async (req, res, next) => {


  const user = {
    studentid: req.body.studentid,
    classname: req.body.classname,
    groupname: req.body.groupname,
    mobileno: req.body.bkashno,
    transid: req.body.transid,
    purchasedate: Date.now(),
    amount: req.body.amount,
    examname: '',
    currency: req.body.currency,
    enteredby: req.username,
    updateby: req.username,
    status: 'approved',
    enteredtime: Date.now(),
    updatetime: Date.now()
  }

  try {
    const new_user = new bkash_model(user);
    const save_user = await new_user.save();
    if (save_user)

      res.status(200).json({
        message: "save",
      })
    else
      return res.status(400).json({
        status: "here",
      });
  } catch (e) {
    console.log("erro ", e);
    return res.status(500).json(e);
  }

})

router.get(
  "/bklistpage/:page/:limit", async (req, res, next) => {
    // console.log(req.params.id);
    const resp = await bkash_model.find().sort({ _id: -1 })
      .exec()
      .then((resp) => {

        const page = parseInt(req.params.page)
        const limit = parseInt(req.params.limit)
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const result = resp.slice(startIndex, endIndex)
        // return res.status(200).json(resp);
        return res.status(200).json(result);

        //return res.status(200).json(resp);

      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

//update approveexam
router.get('/approvepayment/:transid', (req, res, next) => {
  if (!req.params.transid) {
    console.log('not found');
    return;
  }
  bkash_model.findOneAndUpdate({ _id: req.params.transid },
    {
      status: 'approved'
    },
    function (
      err,
      result
    ) {
      if (err) {
        res.send(err);
      } else {
        res.send('save');
      }
    });
})

router.get(
  "/getDatacheckpayment/:studentid", async (req, res, next) => {
    const resp = await bkash_model.find({ studentid: req.params.studentid, status: 'approved' }).count()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);

router.get("/checkUserPayment", async (req, res, next) => {
    const { studentid, className, group, type, version } = req.query;
    let query = {}
    if (studentid) {
      query.studentid = studentid
    }
    if (className) {
      query.classname = className
    }
    if (type) {
      query.type = type
    }
    if (version) {
      query.version = version
    }
    if (group) {
      query.groupname = group
    }
    query.status = 'approved'
    //query.status = 'approve'
    const resp = await bkash_model.findOne(query).exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
    }
);

router.get(
  "/getDatacheckpayment/:studentid", async (req, res, next) => {

    const resp = await bkash_model.find({
      $and: [
        { studentid: req.params.studentid }, { status: 'approved' }

      ],
    }).count()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
router.get(
  "/checktrialdata/:studentid", async (req, res, next) => {

    const resp = await bkash_model.find({
      $and: [
        { studentid: req.params.studentid }, { status: 'expair' }, { packagename: 'Trial' }

      ],
    }).count()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.get(
  "/alltrialdata", async (req, res, next) => {

    const resp = await bkash_model.find()

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.get(
  "/getstudentpackageinfo/:studentid", async (req, res, next) => {

    const resp = await bkash_model.find({
      $and: [
        { studentid: req.params.studentid }

      ],
    })

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);



router.post('/permissionstudent', async (req, res, next) => {
  console.log(req.body);

  const resp = await student_exam.find({
    $and: [
      { studentid: req.body.studentid }, { examid: req.body.examid }

    ],
  }).count()
  if (resp > 0) {
    return res.status(200).json('found');
  }
  else {
    const result = await examsetup.find({
      $and: [
        { _id: req.body.examid }

      ],
    })

    const userdata = {
      studentid: req.body.studentid,
      examid: req.body.examid,
      examname: result.examname,
      status: 'Active',
      enteredby: '',
      updateby: '',
      enteredtime: '',
      updatetime: ''
    }

    var studentsexams = new student_exam(userdata);
    studentsexams.save(function (err, data) {
    });

    return res.status(200).json('notfound');
  }



})

router.post('/teachmarketingwritting', async (req, res, next) => {

  try {
    answer.findByIdAndUpdate({ _id: req.body.autoincrement },
      {
        studentpoint: req.body.studentmarks,
        answertype: req.body.answertype
      },
      function (
        err,
        result
      ) {
        if (err) {

          res.send(err);

        } else {

          return res.status(200).json({
            status: "found",
          });
        }
      });

  } catch (e) {
    return res.status(500).json(e);
  }


})

router.get(
  "/viewquestionid/:studentid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { _id: req.params.studentid }

      ],
    })

      .exec()
      .then((resp) => {

        return res.status(200).json(resp);


      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);


router.get(
  "/countplayquestion/:examid/:studentid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { examid: req.params.examid }, { studentid: req.params.studentid }

      ],
    }).count()

      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);

router.get(
  "/questioncount/:examid", async (req, res, next) => {

    const resp = await answer.find({
      $and: [
        { examrandomid: req.params.examid }

      ],
    }).count()

      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });

  }
);
router.get("/deletestudentanswer/:examid/:studentid", function (req, res) {

  answer.remove({ examid: req.params.examid, studentid: req.params.studentid }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.get("/deleteanswer", function (req, res) {

  answer.remove(function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})


router.post("/deletestudentexamid", function (req, res) {

  studentexamid.remove({ uid: req.body.examid }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      res.send('delete');
    }
  });
})

router.get(
  "/getoldexamid/:examid/:studentid", async (req, res, next) => {


    const resp = await studentexamid.find({
      $and: [
        { examid: req.params.examid }, { studentexamid: req.params.studentid }

      ],
    })


      .exec()
      .then((resp) => {
        return res.status(200).json(resp);
      })
      .catch((err) => {
        return res.sendStatus(500);
      });
  }
);


const bkaash_headers = { 
  'Content-Type': 'application/json', 
  'username': environment.username,
  'password': environment.password,
}

router.get('/getExamTypes', (req, res) => {
  exam_categories.find({status:1})
    .exec()
    .then((resp) => {
      return res.status(200).json(resp); // Send the response once it's available
    })
    .catch((err) => {
      return res.sendStatus(500); // Handle errors appropriately
    });
})

router.post('/addexamtype', (req,res)=> {
  const user = new exam_categories({
    id: req.body.title,
    title: req.body.title,
    status: req.body.status
  });
  user.save().then(result => {
    res.status(201).json({
      message: "Created",
    })
  }).catch(err => {
      res.status(500).json({
        error: err
      });
  })
})
router.delete('/deleteExamType/:id', (req, res) => {
  exam_categories.remove({ _id: req.params.id }, function (err) {
    if (err) {
      res.send(err);
    }
    else {
      return res.status(200).json({
        status: "deleted",
      });
    }
  });
})

// router.get("/getToken", async function (req, res) {
//   const endpoint = '/token/grant';
//   const url = environment.base_url + endpoint;

//   let config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: url,
//     headers: bkaash_headers,
//     data : JSON.stringify({
//       "app_key": environment.app_key,
//       "app_secret": environment.app_secret
//     })
//   };

//   axios.request(config)
//   .then((response) => {
//     res.status(200).json(response.data);
//   })
//   .catch((error) => {
//     res.status(403).json(error);
//   });
// });

async function getToken() {
  try {
    const endpoint = '/token/grant';
    const url = environment.base_url + endpoint;

    const config = {
      method: 'post',
      url: url,
      headers: bkaash_headers,
      data: {
        "app_key": environment.app_key,
        "app_secret": environment.app_secret
      }
    };
    const response = await axios.request(config);
    if (response?.data) {
      const token = response.data.id_token;
      const expires = response.data.expires_in;
      const refresh_token = response.data.refresh_token;
      // Update token in the database
      await bkashtokens.findOneAndUpdate(
        { type: 'bkash' },
        { token: token, expires: expires, refresh_token: refresh_token }
      ).exec();
      return { code: 200, token: token };
    }
  } catch (error) {
    return { code: 403, token: null };
  }
}

router.get("/getRefreshToken", async function (req, res) {
  const endpoint = '/token/refresh';
  const url = environment.base_url + endpoint;

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: bkaash_headers,
    data : JSON.stringify({
      "app_key": environment.app_key,
      "app_secret": environment.app_secret,
      "refresh_token": req?.body?.refresh_token
    })
  };

  axios.request(config)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((error) => {
    res.status(403).json(error);
  });

});

router.post("/createPayment", async function (req, res) {
  const newToken = await getToken();
  const endpoint = '/create';
  const url = environment.base_url + endpoint;
  const xAppKey = environment.app_key
  const bkashObj = await bkashtokens.findOne({ type: 'bkash' }).exec()
  if (!bkashObj) {
    return res.status(500).json({ message: 'No token found in database' });
  }
  let token = bkashObj.token

  let config = {
    method: 'post',
    url: url,
    headers: {...bkaash_headers, "Authorization": token, "X-App-Key":xAppKey},
    data : JSON.stringify({  
      "mode": "0011",
      "payerReference": req.body.reference,
      "callbackURL": environment.callback,
      "merchantAssociationInfo": '',
      "amount": req.body.amount,
      "currency": "BDT",
      "intent": "sale",
      "merchantInvoiceNumber": generateInvoiceNumber()
   })
  };
  try {
    const response = await axios.request(config);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      const { status, statusText, data } = error.response;
      if (statusText === 'Unauthorized') {
        const newToken = await getToken();
        config.headers.Authorization = newToken.token;
        const response = await axios.request(config);
        res.status(200).json(response.data);
      } else {
        res.status(status).json({ code: status, message: statusText, data });
      }
    } else {
      res.status(500).json({ code: 500, message: 'Internal Server Error' });
    }
  }
});

router.post("/executePayment", async function (req, res) {
  const endpoint = '/execute';
  const url = environment.base_url + endpoint;
  const xAppKey = environment.app_key
  const bkashObj = await bkashtokens.findOne({ type: 'bkash' }).exec()
  if (!bkashObj) {
    return res.status(500).json({ message: 'No token found in database' });
  }
  let token = bkashObj.token
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {...bkaash_headers, "Authorization": token, "X-App-Key": xAppKey},
    data : JSON.stringify({
      "paymentID" : req.body.paymentID
    })
  };
  axios.request(config)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((error) => {
    res.status(403).json(error);
  });
});

router.post("/queryPayment", async function (req, res) {
  const endpoint = '/payment/status';
  const url = environment.base_url + endpoint;
  const xAppKey = environment.app_key
  const bkashObj = await bkashtokens.findOne({ type: 'bkash' }).exec()
  if (!bkashObj) {
    return res.status(500).json({ message: 'No token found in database' });
  }
  let token = bkashObj.token
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {...bkaash_headers, "Authorization": req.headers['token'], "X-App-Key":xAppKey},
    data : JSON.stringify({
      "paymentID" : req.body.paymentID
    })
  };
  axios.request(config)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((error) => {
    res.status(403).json(error);
  });
});

router.post("/refund", async function (req, res) {
  const endpoint = '/payment/refund';
  const url = environment.base_url + endpoint;
  const bkashObj = await bkashtokens.findOne({ type: 'bkash' }).exec()
  if (!bkashObj) {
    return res.status(500).json({ message: 'No token found in database' });
  }
  let token = bkashObj.token
  const xAppKey = environment.app_key
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {...bkaash_headers, "Authorization": token, "X-App-Key":xAppKey},
    data : JSON.stringify({
      "paymentID" : req.body.paymentID,
      "amount": req.body.amount,
      "trxID":  req.body.trxID,
      "sku":  req.body.sku,
      "reason":  req.body.sku,
    })
  };
  axios.request(config)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((error) => {
    res.status(403).json(error);
  });
});

router.post("/refundStatus", async function (req, res) {
  const endpoint = '/payment/refund';
  const url = environment.base_url + endpoint;
  const bkashObj = await bkashtokens.findOne({ type: 'bkash' }).exec()
  if (!bkashObj) {
    return res.status(500).json({ message: 'No token found in database' });
  }
  let token = bkashObj.token
  const xAppKey = environment.app_key
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: url,
    headers: {...bkaash_headers, "Authorization": req.headers['token'], "X-App-Key":xAppKey},
    data : JSON.stringify({
      "paymentID" : req.body.paymentID,
      "trxID":  req.body.trxID
    })
  };
  axios.request(config)
  .then((response) => {
    res.status(200).json(response.data);
  })
  .catch((error) => {
    res.status(403).json(error);
  });
});


module.exports = router;