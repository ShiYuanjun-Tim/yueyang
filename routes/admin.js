var express = require('express');
var router = express.Router();

var db=require("../service/dataAccess.js");
/* GET all data. */
router.get('/', function(req, res, next) {
   res.send(db.read())
});

//add a data
 var id= db.get("posts").size().value();

router.get('/add', function(req, res, next) {
   db.get("posts").push( 
   		{
   			"id":(++id),
			"title":"simple post",
			"boolean":true,
			"number":123,
			 "date":new Date()
		}
 ).value();

  res.log.debug(" posts size => "+db.get("posts").size().value())
   db.write()
    .then(() => res.send(db.read()))
});

module.exports = router;
