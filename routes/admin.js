var express = require('express');
var router = express.Router();

var db=require("../service/dataAccess.js");
/* GET all data. */
router.get('/', function(req, res, next) {
   res.render("admin/index")
});

router.get('/test', function(req, res, next) {
   res.render("admin/index")
});

 

module.exports = router;
