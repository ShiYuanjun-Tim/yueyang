var express = require('express');
var router = express.Router();

var dao=require("../service/dataAccess.js");
var db=dao.db;

// data request
/*
get  -> /api/offers    get all offers
get -> /api/schoolImgs get all images
*/


router.get('/api/offers', function(req, res, next) {
 	const offers=dao.getAll("offers");
 	res.json(offers);
});


router.get('/api/schoolImgs', function(req, res, next) {
	 
 	const scs=dao.getAll("schoolsImage");
 	res.json(scs);
	 	
 });

module.exports = router;
