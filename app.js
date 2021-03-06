var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var https = require('https');
var url = require('url');
var querystring = require('querystring');
var config = require('./config/local.env');

app.use(express.errorHandler());
app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(app.router);

app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views


// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// defaults for dev outside bluemix
var service_url = config.service_url;
var service_username = config.service_username;
var service_password = config.service_password;

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
if (process.env.VCAP_SERVICES) {
  console.log('Parsing VCAP_SERVICES');
  var services = JSON.parse(process.env.VCAP_SERVICES);
  //service name, check the VCAP_SERVICES in bluemix to get the name of the services you have
  var service_name = 'machine_translation';
  
  if (services[service_name]) {
    var svc = services[service_name][0].credentials;
    service_url = svc.url;
    service_username = svc.username;
    service_password = svc.password;
  } else {
    console.log('The service '+service_name+' is not in the VCAP_SERVICES, did you forget to bind it?');
  }

} else {
  console.log('No VCAP_SERVICES found in ENV, using defaults for local development');
}

console.log('service_url = ' + service_url);
console.log('service_username = ' + service_username);
console.log('service_password = ' + new Array(service_password.length).join("X"));

var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');

// routes ===================================


app.get('/', function(req, res){
  // res.sendfile('index.html');
  res.render('index');
});


app.get('/about', function(req, res){
  res.render('about')
})

// Sends the message to IBM Watson API
app.post('/api/watson', function(req, res){

  if(!req.body.text || !req.body.sid){
    return;
  }

  var request_data = { 
    'txt': req.body.text,
    'sid': req.body.sid,
    'rt':'text' // return type e.g. json, text or xml
  };
  
  var parts = url.parse(service_url);
  // create the request options to POST our question to Watson
  var options = { host: parts.hostname,
    port: parts.port,
    path: parts.pathname,
    method: 'POST',
    headers: {
      'Content-Type'  :'application/x-www-form-urlencoded', // only content type supported
      'X-synctimeout' : '30',
      'Authorization' :  auth }
  };

  // Create a request to POST to Watson
  var watson_req = https.request(options, function(result) {
    result.setEncoding('utf-8');
    var responseString = '';

    result.on("data", function(chunk) {
      responseString += chunk;
    });
    
    result.on('end', function() {
      // add the response to the request so we can show the text and the response in the template
      request_data.translation = responseString;
      console.log('data from ibm',request_data);
      io.emit('translate message', {ll: 'dd', username: req.body.username, text: request_data.translation});

      res.end();
    });

  });

  watson_req.on('error', function(e) {
    return res.render('index', {'error': e.message});
  });

  // create the request to Watson
  watson_req.write(querystring.stringify(request_data));
  watson_req.end();

});

// chatroom ===================================

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;


io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    io.emit('new message', {
      username: socket.username,
      text: data.text
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    // we store the username in the socket session for this client
    socket.username = username;
    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    
    // send event to person who logged in
    socket.emit('login', {
      username: socket.username,
      numUsers: numUsers,
      usernames: usernames
    });

    // send event toall users except the person who ligged in
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers,
      usernames: usernames
    });
  });


  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers,
        usernames: usernames
      });
    }
  });
});

// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
http.listen(port, host);
