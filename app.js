var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var url = require('url');


var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var routes = require('./routes/index');
var api = require('./routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');

app.use('/', routes);
// app.use('/api', api);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});


// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
http.listen(port, host);
