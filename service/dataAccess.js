const low = require('lowdb')
const fileAsync = require('lowdb/lib/file-async')

// Start database using file-async storage
const db = low('data/db.json', {
  storage: fileAsync
  ,writeOnChange: false
})

// // Init, add info  of documents 
db.defaults({ offers: [
/*{
	"displayOrder":0,
    "studentName":"陈殷禹",
    "primarySchool":"上海位育中学（IB）",
    "TOEFL":"94",
    "IELTS":null,
    "SAT":null,
    "GMAT":null,
    "GRE":null,
    "schoolAdmission":"凯尼休斯学院",
    "major":"ND 未定"
  }*/
	], user: {
 /*"name": "aa"
    "pass":""*/
	} })
  .value()
 

module.exports =db;