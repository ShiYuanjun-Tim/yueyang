var express = require('express');
var router = express.Router();

var dao=require("../service/dataAccess.js");
var db=dao.db;
/* page request. */
router.get('/', function(req, res, next) {
   res.render("admin/index")
});
router.get('/dev', function(req, res, next) {
   res.render("admin/adminDev")
});

// data request
/*
get  -> /api/offers    get all offers
get  -> /api/offer/{id}   get one offers
post -> /api/offer/update
post -> /api/offer/new
get -> /api/offer/delete/{id}

*/


router.get('/api/offers', function(req, res, next) {
 	const offers=dao.getAll("offers");
 	res.json(offers);
});

router.get('/api/offer/delete/:offerId', function(req, res, next) {
	res.log.debug("parameters: ",req.params);
 	const offer=db.get("offers").remove({id:req.params.offerId}).value();
 	db.write().then(()=>{
 		res.json(offer);
	})	
 });

router.post('/api/offer/update', function(req, res, next) {
	res.log.debug("update offer:" ,req.body);
 	const offer=db.get("offers").find({id:req.body.id}).assign(req.body).value();
 	db.write().then(()=>{
 		res.json(offer);
	})	
 });

router.post('/api/offer/new', function(req, res, next) {
	res.log.debug("new offer:" ,req.body);
 	const offer=db.get("offers").insert(req.body).value();
 	db.write().then(()=>{
 		res.json(offer);
	})	
 });

 

module.exports = router;
