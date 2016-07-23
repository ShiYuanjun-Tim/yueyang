const low = require('lowdb')
const fileAsync = require('lowdb/lib/file-async')

// Start database using file-async storage
const db = low('data/db.json', {
  storage: fileAsync
  ,writeOnChange: false
})

// // Init, add info  of documents 
db.defaults({ posts: [], user: {} })
  .value()
 

module.exports =db;
