
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , nowjs   = require('now')
  , path = require('path');

var app = express();
var commit_msg = "";



app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/commits', function(req, res){
  commit_msg = req.query.q;
  console.log(commit_msg);
  everyone.now.distributeMessage(commit_msg);
  res.send(200);
});

var server = http.createServer(app);
var everyone = nowjs.initialize(server);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

everyone.now.distributeMessage = function(msg){
    everyone.now.receiveMessage(msg);
}


nowjs.on('connect', function(){
    //Update the current set of users when someone joins
    console.log("Client joined...");
});