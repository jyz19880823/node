
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/routes')
  , http = require('http')
  /*, https = require('https')*/
  , path = require('path')
  ,MongoStore = require('connect-mongo')(express)
  ,settings=require("./model/mongo")
  ,flash=require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
/*app.set('sport', process.env.PORT || 443);*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash())
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session({
  	secret: settings.cookieSecret,
	  store: new MongoStore({db:settings.db})
  }));
app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes(app);

app.use(function(req,res,next){
	var err=flash('error'),
	success=req.flash('success');
res.locals.user=req.session.user;
res.locals.error=err.length?err:null;
res.locals.success=success.length?success:null;
next();
})
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
/*https.createServer(app).listen(app.get('sport'));*/
