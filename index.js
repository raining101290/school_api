const http = require('http');
const express = require('express')
const bodyParser = require('body-parser') // new
const mongoose = require('mongoose'); 

const cors = require('cors');
const app = express()

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // for parsing application/x-www-form-urlencoded
//const fs = require('fs');
//const mime = require('mime');
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/public', express.static('public')); // this is for public api directory
const port = process.env.PORT || 4224;

require('dotenv/config');



////////////////////////

app.use(cors({
  origin: [
      'https://examamine.com', 
      'https://school.examamine.com',
      'https://demo.examamine.com', 
      'https://webview.examamine.com', 
      'http://localhost:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));


// import the route here
const postsRouter = require('./route/route');
const postsRouterwebsite = require('./route/websiteroute');
//require("./models/user_model");


//url from browser
app.use('/', postsRouter);
app.use('/test', postsRouter);
app.use('/testdb', postsRouter);
app.use('/signup', postsRouter);
app.use('/imageviewnodejs', postsRouter)
app.use('/checktrialdata', postsRouter)
app.use('/copyexamssubmit', postsRouter)
app.use('/trialcheck', postsRouter)
app.use('/deletestudentpackage', postsRouter)

app.use('/setupallcategory', postsRouter);//setupallcategory all category like all service
app.use('/delete_categories', postsRouter); // delete categories main
app.use('/delete_subcategories', postsRouter); // usa ecommerce delete categories main
app.use('/quizlistview', postsRouter);
// examin all api
app.use('/teacherimagemarksupdate', postsRouter)
app.use('/getresultpage', postsRouter)
app.use('/resultpageviewhistory', postsRouter)
app.use('/viewtransactioncorrect', postsRouter)
app.use('/viewtransactionincorrect', postsRouter)
app.use('/getstudentpackageinfo', postsRouter)
app.use('/findexamsbysearch', postsRouter)

app.use('/findquiz', postsRouter)
app.use('/adminlist', postsRouter)


app.use('/examquizcopy', postsRouter)
app.use('/jointwocollection', postsRouter)
app.use('/schoolsetup', postsRouter);
app.use('/schoollist', postsRouter)
app.use('/getschoollist', postsRouter)
app.use('/subjectsetup', postsRouter);
app.use('/subjectlist', postsRouter);
app.use('/getparmetersubjectlist', postsRouter)
app.use('/quizautoid', postsRouter)
app.use('/quizsetupautoid', postsRouter)
app.use('/questionimageupload', postsRouter)
app.use('/quizheaderadd', postsRouter)
app.use('/quizlist', postsRouter)
app.use('/questionsaveall', postsRouter)
app.use('/editschoolcollegesetup', postsRouter)
app.use('/updateschool', postsRouter)
app.use('/delete_schoolcollege', postsRouter)
app.use('/delete_subject', postsRouter)
app.use('/delete_class', postsRouter)
app.use('/editsubjectinformation', postsRouter)
app.use('/getschoolcollegeinfo', postsRouter)
app.use('/updatesubject', postsRouter)
app.use('/delete_quiz', postsRouter)
app.use('/getsubjectfindbyid', postsRouter)
app.use('/userslist', postsRouter)
app.use('/delete_users', postsRouter)
app.use('/examslist', postsRouter)
app.use('/groupsetup', postsRouter)
app.use('/sectionsetup', postsRouter)
app.use('/sectionlist', postsRouter)
app.use('/dblist', postsRouter)
app.use('/viewmathquestion', postsRouter)

app.use('/examslistteacher', postsRouter)
app.use('/studentwiseinfo', postsRouter)

app.use('/getclassid', postsRouter)
app.use('/getsectionid', postsRouter)
app.use('/grouplist', postsRouter)
app.use('/addnewexam', postsRouter)
app.use('/getschoolname', postsRouter)
app.use('/delete_exam', postsRouter)
app.use('/delete_group', postsRouter)
app.use('/delete_section', postsRouter)
app.use('/edituserinformation', postsRouter)
app.use('/getschooluniqueid', postsRouter)
app.use('/getquizuniqueid', postsRouter)
app.use('/geteditnewexams', postsRouter)
app.use('/updateexams', postsRouter)
app.use('/Addnewstudent', postsRouter)
app.use('/signupstudent', postsRouter)
app.use('/continuewithteacher', postsRouter)
app.use('/getquizserial', postsRouter)
app.use('/getexamid', postsRouter)
app.use('/Editadminloginsetup', postsRouter)
app.use('/studentexamid', postsRouter)
app.use('/coachingallsubject', postsRouter)
app.use('/Editadminloginsetuppassword', postsRouter)
//Student Panel Route
app.use('/studentlogin', postsRouter)
app.use('/getsubjectbyschool', postsRouter)
app.use('/getexamsstudentwise', postsRouter)
app.use('/updatepassword', postsRouter)
app.use('/checktrialdata', postsRouter)

//end examin all api

app.use('/checkemail', postsRouter);
app.use('/Adminloginareacheck', postsRouter);
app.use('/adminlogin', postsRouter);
app.use('/checkmobileno', postsRouter);
app.use('/verifymobile', postsRouter);
app.use('/distset', postsRouter); // setup distarea+

app.use('/signupworker', postsRouter); // setup distarea
app.use('/userprofile', postsRouter);
app.use('/workersignin', postsRouter); // workersignin
app.use('/webserviceholderlogin', postsRouter); // website service holder login

app.use('/addnewproduct', postsRouter);
app.use('/addnewproductupdate', postsRouter);
app.use('/updateproduct', postsRouter);
app.use('/delete_product', postsRouter);

app.use('/foodmenucategorysetup', postsRouter) // food category menu setup
app.use('/foodmenulist', postsRouter) // food menu list show here

app.use('/xorderentry', postsRouter) // food menu list show here
app.use('/gascategorylist', postsRouter) // food menu list show here
app.use('/gascategorysetup', postsRouter)
app.use('/categorysetup', postsRouter) // usa ecommerce
app.use('/gassubcategoryproductlist', postsRouter) 
app.use('/studentwiseresult', postsRouter)
app.use('/examwisestudentwiseresult', postsRouter)



//signupworker
app.use('/storepin', postsRouter); // post method save 
app.use('/subcategorysetup', postsRouter); // usa ecommerce site post method save 
app.use('/updatesubcategory', postsRouter)
///subcategorysetup
app.use('/posts', postsRouter);
app.use('/users', postsRouter);
app.use('/reg', postsRouter);
app.use('/orderviewpage', postsRouter); //productviewlike
app.use('/productviewlike', postsRouter);
app.use('/paymentstripepay', postsRouter);
app.use('xpaymentpaypal', postsRouter);
app.use('/vieworder', postsRouter);
app.use('/vieworderdetails', postsRouter);
app.use('/products/count', postsRouter);
app.use('/productscategory', postsRouter);
app.use('/productsamountrange', postsRouter);
app.use('/adminlist', postsRouter);
app.use('/classsetup', postsRouter);
app.use('/classlist', postsRouter);
app.use('/getschoolidforsave', postsRouter)
app.use('/examwisestudentlist', postsRouter)
app.use('/getstudentwiseexam', postsRouter)
app.use('/getbyexamid', postsRouter)
app.use('/quizedit', postsRouter)
app.use('/mcqquestionupdate', postsRouter)
app.use('/fillinthegapupdate', postsRouter)
app.use('/writtingtestupdate', postsRouter)
app.use('/findfirstquestion', postsRouter)
app.use('/playingquizinsert', postsRouter)
app.use('/playinsertfillinthegap', postsRouter)
app.use('/subjectwisedata', postsRouter)
app.use('/subjectwisedatachapter', postsRouter)



///subcategory
app.use('/subcategory', postsRouter);
app.use('/allsubcategory', postsRouter); // usa ecommerce
app.use('/shoppingdropdownsubcategory', postsRouter)
app.use('/shoppingsingleitem', postsRouter)
app.use('/shoppingsubcategoryshow', postsRouter)


//shopping category like salower kamiz
app.use('/shoppingsubcategory', postsRouter);
app.use('managerownproductshow', postsRouter)


app.use('/workingtype', postsRouter); // working area get all data
app.use('/areatype', postsRouter); // usa category // area get all data


app.use('/xdistpage', postsRouter); // show all area
app.use('/serviceholder', postsRouter);
app.use('/gasproductlist', postsRouter);


// view profile
app.use('/viewprofile', postsRouter); // get profile from view profile
app.use('/viewprofileimage', postsRouter) // profile image show
app.use('/serviceholderproductlist', postsRouter) // server holder product list 
app.use('/foodcategoriessetup', postsRouter); // foodcategories setup

app.use('/xorderentry', postsRouter)


//website work start from  here/////////////////////////website category here
app.use('/banner', postsRouter)
app.use('/addbannerimage', postsRouter)
app.use('/products', postsRouter)
app.use('/mobilecategory', postsRouter)
app.use('/singleproduct', postsRouter)
app.use('/addnewproductview', postsRouter)
app.use('/shopfilter', postsRouter)
app.use('/studentlist', postsRouter)
app.use('/teacheranswerwritting', postsRouter)
app.use('/adminsetup', postsRouter)
app.use('/updatetrialstatus', postsRouter)

/* view teacher profile */

//delete exam

app.use('/teacherviewprofile', postsRouter)
app.use('/studentviewprofile', postsRouter)
app.use('/studentupdatepassword', postsRouter)
app.use('/studentinfosingle', postsRouter)
app.use('/updateexamstatus', postsRouter)
app.use('/examlist', postsRouter)
app.use('/studentexamresult', postsRouter)
app.use('/deleteallexam', postsRouter)
app.use('/deleteallstudentanswer', postsRouter)
app.use('/updateexamasfinish', postsRouter)

///////mobile apps api
app.use('/Addnewstudentmobile', postsRouter)
app.use('/subjectlist_mobile', postsRouter)
app.use('/studentviewprofilemobile', postsRouter) 
app.use('/updatestudentidmobile', postsRouter)
app.use('/studentexamidmobile', postsRouter)
app.use('/playinsertmcqmobile', postsRouter)
app.use('/playinsertfillinthegapmobile', postsRouter)
app.use('/playingquizinsertmobile', postsRouter) 
app.use('/subjectexamaminelistmobile', postsRouter)
app.use('/subjectlist', postsRouter)
app.use('/subjectlistschool', postsRouter)
app.use('/resulthistory', postsRouter)
app.use('/examnamefind', postsRouter)
app.use('/answercount', postsRouter)
app.use('/examimageupdate', postsRouter)
app.use('/examamineschoolallcourse', postsRouter)
app.use('/examslistteacherfilter', postsRouter)
app.use('/emailaddresscheck', postsRouter)
app.use('/mobilelogin', postsRouter)
app.use('/approveexam', postsRouter)
app.use('/allapproveexam', postsRouter)
app.use('/studentuserlist', postsRouter)
app.use('/studentuserlistpage', postsRouter)
app.use('/Mathsubject', postsRouter)
app.use('/examimage', postsRouter)
app.use('/draftexamlisttecher', postsRouter)
app.use('/matchsaveall', postsRouter)
app.use('/insertMatch',postsRouter)
app.use('/insertmatchfirst', postsRouter)
app.use('/matchinfoshow', postsRouter)
app.use('/correctanswer', postsRouter)
app.use('/incorrectanswer', postsRouter)
app.use('/studentname', postsRouter)
app.use('/exampublishstatus', postsRouter)
app.use('/examid', postsRouter)
app.use('/delete_question', postsRouter)
app.use('/deletestudentfromexam', postsRouter)
app.use('/coachingcourse', postsRouter)
app.use('/insertpaymentbkash', postsRouter)
app.use('/bklistpage', postsRouter)
app.use('/approvepayment', postsRouter)
app.use('/getDatacheckpayment', postsRouter)
app.use('/permissionstudent', postsRouter)

app.use('/teachmarketingwritting', postsRouter)
app.use('/viewquestionid', postsRouter)

app.use('/countplayquestion', postsRouter)
app.use('/questioncount', postsRouter)
app.use('/deletestudentanswer', postsRouter)
app.use('/deletestudentexamid', postsRouter)
app.use('/getoldexamid', postsRouter)
app.use('/examslistfindbyteacher', postsRouter)
app.use('/teacherallexammname', postsRouter)
app.use('/resulthistoryexamlist', postsRouter)
app.use('/updateexpairdate', postsRouter)
app.use('/alltrialdata', postsRouter)


//delete student answer all
app.use('/deleteanswer', postsRouter)
app.use('/bkashpaymentonline', postsRouter)
app.use('/updateps', postsRouter)


/////end mobile apps

// connection to the mongoose db
// connection is comming form dotenv .env file.
//mongoose.connect(process.env.DATABASE_URL,
// { useNewUrlParser: true}, () => console.log('connection to db'));
//mongoose.connect('mongodb+srv://doadmin:GK9J3724I8s0yQ5z@db-mongodb-sgp1-20694-1c299fa2.mongo.ondigitalocean.com/admin?retryWrites=true&w=majority') // live
// mongoose.connect('mongodb://127.0.0.1:27017/examdb') // localhost my pc

 mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false // Add this line to disable the findAndModify deprecation warning
}) // localhost my pc
.then(() => console.log('connection successfully'))
.catch(err => console.log(err))


function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }

}
// this is for online server
/*
 app.listen(port, () => {
  console.log(`App running on port ${port}.`)
}) 
*/
// this is for offline server



var server = app.listen(4224, function() {
  console.log('Ready on port %d', server.address().port);
});

