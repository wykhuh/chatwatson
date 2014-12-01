$(function() {

  var $usernameInput = $('.usernameInput');
  var $messageInput = $('.messageInput');
  var $messages = $('.messages');


  var username;
  var connected = false;
  // var $currentInput = $usernameInput.focus();

  var chat = Chat();
  var socket = io();

  chat.selectLanguage();
  chat.submitUsername();

  chat.displayArea(connected);

  // user submits a message
  $('.messageForm').submit(function(){
    chat.submitMessage();
    return false;
  });

   // user submits a message
  $('.loginForm').submit(function(){
    chat.submitUsername();

    return false;
  });

  // when client receives a 'chat' event via sockets, add the message to the DOM
  socket.on('new message', function (data) {
    chat.addMessage(data, 'original');
  });

  // when client recieves a 'translate' event via sockets, add the translated 
  // message to the DOM
  socket.on('translate message', function (data) {
    chat.addMessage(data, 'translate');
  });

  // when user logins, emit 'login' event and display chat area
  socket.on('login', function (data) {
    console.log('main login', data);
    connected = true;
    chat.displayArea(connected);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
     console.log('main login', data);

    chat.log(data.username + ' joined the chat');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
      console.log('main login', data);

    chat.log(data.username + ' left the chat');
  });


});

