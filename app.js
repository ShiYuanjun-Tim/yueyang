var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var dao=require("./service/dataAccess.js");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var log = require("./service/logger").log;
var uuid = require('node-uuid');
var env = require('get-env')({
    dev:["dev","development"],
    prod: ['prod', 'production']
});
// var compression = require('compression');

log.warn("APP RUNING IN "+env +" MODE");


// Configure the local strategy for use by Passport.
//
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.
passport.use(new LocalStrategy(
  function(username, password, done) { 
      log.debug("###############"+username, password);
      var user = dao.db.get("user").find({name:username}).value();
      if(user){
         log.debug("########id#######"+user.id);
         if(password===user.pass){
           return done(null, user);
         }
          return done( {
          status: 500      ,
         message:`  PASSWORD \n
          is not correct!
        `
      });
      }
      log.debug("########login failed#######"+user.id);
      return done( {
        status: 500      ,
        message:`  USER NOT FOUND \n
          The user name is not correct,please confirm =>${username}
        `
      });
     
  }));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  log.debug("########deserializeUser#######"+id);
    var user=dao.db.get("user").find({id:id}).value();
    if(user){
       log.debug(`########ok info ##name: ${user.name}###` );
       cb(null, user);
    }else{
         log.debug(`########fail ##` );
      return  cb( {
        status:500,
        message:"USER NOT FOUND"
      });
    }
});




var routes = require('./routes/index');
var admin = require('./routes/admin');
var apis = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//add the log to request chain, add addtional info for time and ip
app.use(function (req, res, next) {
  res.removeHeader("x-powered-by");
  log.info("new request "+req.originalUrl);
        res.log = log.child({ 
            req_id:uuid(),
            ip:req.ip,
            url:req.originalUrl
        },true);
        next(); 
});


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(compression);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/',express.static(path.join(__dirname, 'public'))); 

  app.use(session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());


app.use('/', routes);
app.use('/admin', admin);
app.use('/apis', apis);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (env!== 'prod') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
 
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
