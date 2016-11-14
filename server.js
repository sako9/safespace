var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');


var routes = require('./app/route');
var router = express.Router();

var port = process.env.PORT || 8080;


var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
                replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } }};
mongoose.connect('mongodb://localhost:27017/', options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 
app.use(cors())
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 
routes(router);
app.use(router);

// routes ==================================================

// start app ===============================================
// startup our app at http://localhost:8080
var server = app.listen(port);               

var io = require('socket.io').listen(server);
var socketEvents = require('./socketEvents');
socketEvents(io);

// shoutout to the user                     
console.log('Magic happens on port ' + port);

// expose app           
exports = module.exports = app;                         
