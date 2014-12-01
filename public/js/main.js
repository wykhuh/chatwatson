$(function() {

  var $usernameInput = $('.usernameInput');
  var $messageInput = $('.messageInput');
  var $messages = $('.messages');
  var $loginForm = $('.loginForm');

  var username;
  var connected = false;
  var $currentInput = $usernameInput.focus();

  var chat = Chat();
  var socket = io();

  chat.selectLanguage();
  chat.getUsername();

  // user submits a message
  $('form').submit(function(event){
    event.preventDefault();
    chat.sendMessage();
    return false;
  });


  // // when user logins, emit 'login' event
  // socket.on('login', function (data) {
  //   connected = true;
  //   chat.addParticipantsMessage(data);
  // });

  // when client receives a 'chat' event via sockets, add the message to the DOM
  socket.on('new message', function (data) {
    console.log('main new message', data)
    chat.addMessage(data, 'original');
  });

  // when client recieves a 'translate' event via sockets, add the translated 
  // message to the DOM
  socket.on('translate message', function (data) {
    console.log('main new translate', data)

    chat.addMessage(data, 'translate');
  });


  // // Whenever the server emits 'user joined', log it in the chat body
  // socket.on('user joined', function (data) {
  //   log(data.username + ' joined');
  //   chat.addParticipantsMessage(data);
  // });

  // // Whenever the server emits 'user left', log it in the chat body
  // socket.on('user left', function (data) {
  //   log(data.username + ' left');
  //   chat.addParticipantsMessage(data);
  // });


});

