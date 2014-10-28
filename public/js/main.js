$(document).ready(function() {

  var chat = Chat();
  var socket = io();

  chat.selectLanguage();
  chat.showPrompt();

  // user submits a message
  $('form').submit(function(){

    var message =  $('#m').val();
    // emit an event to all other users via sockets
    socket.emit('chat message', {text: message, name: chat.name});

    // send the message to IBM Watson via POST to api
    chat.sendToServer({text: message, name: chat.name, sid: chat.sid });

    $('#m').val('');
    return false;
  });

  // when client receives a 'chat' event via sockets, add the message to the DOM
  socket.on('chat message', function(msg){
    var $messages = $('#messages');

    var $message = $('<li class="original">');
    var $username = $('<span class="name">');
    $username.text(msg.name + ': ').appendTo($message);
    $message.append(msg.text);
    $messages.append($message);

    chat.scrollToBottom('messages');
  });

  // when client recieves a 'translate' event via sockets, add the translated 
  // message to the DOM
  socket.on('translate message', function(msg){
    var $messages = $('#messages');
    
    var $message = $('<li class="translate">');
    var $username = $('<span class="name">');
    $username.text(msg.name + ': ').appendTo($message);
    $message.append(msg.text);
    $messages.append($message);

    chat.scrollToBottom('messages');
  });


});

