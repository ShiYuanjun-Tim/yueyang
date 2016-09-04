var express = require('express');
var router = express.Router();
var passport = require('passport');
var dao=require("../service/dataAccess.js");
var db=dao.db;

router.use(function(req,res,next){
	var path=req.path;
	// var isLoggedIn = require('connect-ensure-login').ensureLoggedIn();
	// res.log.info( `path :${path}, logined:${isLoggedIn}`);
	// if(path!="/login" && isLoggedIn){
	// 	res.log.info( "redirect to login page");
	// 	res.redirect("/admin/login")
	// }
	next();	
})



/* page request. */
router.get('/', 
// passport.authenticate('local', { failureRedirect: '/admin/login' }),
  require('connect-ensure-login').ensureLoggedIn("/admin/login"),
	function(req, res, next) {
   res.render("admin/index")
});


router.get('/login', 
  function(req, res, next) {
     res.render("admin/login")
  }
);

router.post('/auth', 
	passport.authenticate('local', {  failureRedirect: '/admin/login' }),
	function(req, res, next) {
	   res.redirect("/admin")
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

function parse(body){
	var newO={};
	for(var key in body){
		var v=body[key],match  = /(\w+)\[(\w+)\]/.exec(key);
		if(match){
			var outK = match[1] , inK=match[2];
			 
			var obj=newO[outK]||{};
			obj[inK] = v;
			newO[outK]= obj;
			continue;
		}
		newO[key]=v;
	}
	return newO;
}


router.get('/api/offer/delete/:offerId', function(req, res, next) {
	res.log.debug("parameters: ",req.params);
 	const offer=db.get("offers").remove({id:req.params.offerId}).value();
 	db.write().then(()=>{
 		res.json(offer);
	})	
 });

router.post('/api/offer/update', function(req, res, next) {
	var obj =parse(req.body)
	res.log.debug("update offer:" ,req.body,obj);
 	const offer=db.get("offers").find({id:req.body.id}).assign(obj).value();
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
