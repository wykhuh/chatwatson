$(function() {

  var chat = Chat();
  var socket = io();
  var username;
  var connected = false;

  var $usernameInput = $('.usernameInput');
  var $messageInput = $('.messageInput');
  var $messages = $('.messages');
  var $users = $('.allUsers');

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
    connected = true;
    // show messages instead of login form
    chat.displayArea(connected);
    // remove all existin users
    chat.clearUsers();
    // remove all existing messages
    chat.clearMessages();
    // add user to user list
    for(username in data.usernames){
      chat.addUser(username);
    }
    //add joined in message
    chat.log(data.username + ' joined the chat');
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', function (data) {
    chat.addUser(data.username);
    chat.log(data.username + ' joined the chat');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', function (data) {
    chat.removeUser(data.username);
    chat.log(data.username + ' left the chat');
  });

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('disconnect', function (data) {
    chat.log(data.username + ' left the chat');
  });


});

