const mongoose = require('mongoose');

const QuizSchema = mongoose.Schema({
    id: {
        type: String
      },
    schoolcollegeid: { type : String},
    subjectid: { type : String},
    examid: { type : String},
    examname: { type : String},
      schooltype : { type : String},
      schoolname: { type : String },
      subject:  { type : String },
      xgroup:  { type : String },
      xsection:  { type : String },
      quiztype: {type: String},
      questiontype: { type : String },
      questiontitle: { type : String },
      questionimage: { type : String },
      answerimage: { type : String },
      Atype:  { type : String },
      Atitle:  { type : String },
      Aimage:  { type : String },
      Btype:  { type : String },
      Btitle:  { type : String },
      Bimage:  { type : String },
      Ctype:  { type : String },
      Ctitle:  { type : String },
      Cimage:  { type : String },
      Dtype:  { type : String },
      Dtitle:  { type : String },
      Dimage:  { type : String },
      Answer:  { type : String },
      status:  { type : String },
      writtinganswer: { type : String },
      enteredby:  { type : String},
      updateby:  { type : String },
      UpdateTime: { type : Date, default: Date.now },
      writtinganswertype:  { type : String },
      questiontime:  { type : String },
      point:  { type : String },
      questiontype1:  { type : String },
      questiontype2:  { type : String },
      questiontype3:  { type : String },
      questiontype4:  { type : String },
      questiontype5:  { type : String },
      questiontitle2:  { type : String },
      questiontitle3:  { type : String },
      questiontitle4:  { type : String },
      questiontitle5:  { type : String }

    });

module.exports = mongoose.model('xquizsetup', QuizSchema); 