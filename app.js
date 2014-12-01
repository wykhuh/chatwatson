var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

var app = express();

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

require('./config/express')(app, config);


var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(config.port, function () {
  console.log('Server listening at port %d', config.port);
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

module.exports = {
  server: server
  // io: io
}