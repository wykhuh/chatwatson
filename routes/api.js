var express = require('express');
var app = express();

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
      console.log('request',request_data);
      io.emit('translate message', {name: req.body.name, text: request_data.translation});

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
