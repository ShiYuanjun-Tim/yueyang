var express = require('express');
var router = express.Router();
var passport = require('passport');
var dao=require("../service/dataAccess.js");
var db=dao.db;

router.use(function(req,res,next){
	var path=req.path;
	res.log.info("-------",req.originalUrl);
	// if(path!="/login" && ){
	// 	res.log.info( "redirect to login page");
	// 	res.redirect("/admin/login")
	// }
	next();	
})



/* page request. */
router.get('/', function(req, res, next) {
   res.render("admin/index")
});

router.post('/auth', 
	passport.authenticate('local', { successRedirect: '/admin',
                                   failureRedirect: '/admin/login' })
);

router.get('/login', 
	function(req, res, next) {
	   res.render("admin/login")
	}
);
router.get('/dev', function(req, res, next) {
   res.render("admin/adminDev")
});

// data request
/*
 
get  -> /api/offer/{id}   get one offers
post -> /api/offer/update
post -> /api/offer/new
get -> /api/offer/delete/{id}

*/
 
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
