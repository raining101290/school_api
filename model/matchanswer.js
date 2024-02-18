const mongoose = require('mongoose');

const AnswerSchema = mongoose.Schema({
    answerid: { type : String},
schoolcollegeid: { type : String},
examrandomid: { type : String},
subjectid: { type : String},
examid: { type : String},
examname: { type : String},
Acolone:  { type : String},
Acoltwo:  { type : String},
Acolthree:  { type : String},
Acolfour:  { type : String},
Acolfive:  { type : String},
Bcolone:  { type : String},
Bcoltwo:  { type : String},
Bcolthree:  { type : String},
Bcolfour:  { type : String},
Bcolfive:  { type : String},
Anscolone:  { type : String},
Anscoltwo:  { type : String},
Anscolthree:  { type : String},
Anscolfour:  { type : String},
Anscolfive:  { type : String},
MatchAnscolone:  { type : String},
MatchAnscoltwo:  { type : String},
MatchAnscolthree:  { type : String},
MatchAnscolfour:  { type : String},
MatchAnscolfive:  { type : String},
    });

module.exports = mongoose.model('matchanswer', AnswerSchema); 