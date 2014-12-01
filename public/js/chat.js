var Chat = function(){
  var chatMethods = {};
  var socket = io();

  var $usernameInput = $('.usernameInput');
  var $messageInput = $('.messageInput');
  var $messages = $('.messages');
  var $users = $('.users');
  var $loginArea = $('.loginArea');
  var $chatArea =  $('.chatArea');

  var username;

  // default translation is english to spanish
  chatMethods.sid = "mt-enus-eses";

  chatMethods.displayArea = function(connected) {
    // if user is logged in, show chat area
    if(connected) {
      $chatArea.css('display', 'block');
      $loginArea.css('display', 'none');
    // else show login form
    } else {
      $chatArea.css('display', 'none');
      $loginArea.css('display', 'block');
    }
  };

  //  user enters  username
  chatMethods.submitUsername = function(){
     username = cleanInput($usernameInput.val().trim());
     if(username) {
      // Tell the server your username
      socket.emit('add user', username);
     }
  };


    // set the input and output language
  chatMethods.selectLanguage = function(){
    $("#language").change(function(){
      chatMethods.sid = $(this).val();
      multilingual();
    });
  };

  chatMethods.addUser = function(username) {
    var $user = $('<li class="user ' + username +'">');
    $user.append(username);
    $users.append($user);
  };

  chatMethods.removeUser = function(username) {
    $('.user.'+username).remove();
  };

  chatMethods.submitMessage = function() {
    var message =  cleanInput($messageInput.val().trim());
    // console.log('chat send', message, username, chatMethods.sid )

    // emit an event to all other users via sockets
    socket.emit('new message', {text: message, username: username});

    // send the message to IBM Watson via POST to api
    sendToServer({text: message, username: username, sid: chatMethods.sid });

    // clears the input field
    $messageInput.val('');
    return false;
  };

  chatMethods.clearMessages = function(){
    $('.message').remove();
  };

  chatMethods.clearUsers = function(){
    $('.user').remove();
  };

  // send post request to api, which will then send message to IBM Watson
  var sendToServer = function(message){
    // console.log('chat send to server', message)
    var base_url =window.location.origin+'/api/watson';
    $.post( base_url, message);
  };

  // add message to DOM
  chatMethods.addMessage = function(data, messageType) {
    // console.log('chat add', data, messageType);

    if(data.text){
      var $message = $('<li class="message ' + messageType +'">');

      if(data.username){
        var $username = $('<span class="name">');
        $username.text(data.username + ': ').appendTo($message);
      }

      $message.append(data.text);
      $messages.append($message);

      // scroll to the bottom of the page when new messages are added
      $messages[0].scrollTop = $messages[0].scrollHeight;

    }
  };

  chatMethods.addParticipantsMessage = function (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    chatMethods.log(message);
  };

  // Log a message
  chatMethods.log = function(message) {
    // console.log('chat log', message)
    chatMethods.addMessage({text: message}, 'log');
  };

  // Prevents input from having injected markup
  var cleanInput = function (input) {
    return $('<div/>').text(input).text();
  };

  // changes the text for the "Send" button
  var multilingual = function(){
    var phrases = {};

    phrases.messageButton = {
      'mt-enus': 'Send',
      'mt-eses': 'Enviar',
      'mt-frfr': 'Envoi',
      'mt-ptbr': 'Enviar',
      'mt-arar': 'Send'
    };

    phrases.messageInput = {
      'mt-enus': 'Write a message',
      'mt-eses': 'Escribir un mensaje',
      'mt-frfr': 'Écrire un message',
      'mt-ptbr': 'Escreva uma mensagem',
      'mt-arar': 'Write a message'
    };

    phrases.joinedChat = {
      'mt-enus': 'joined the chat',
      'mt-eses': 'se unió a la conversación',
      'mt-frfr': 'rejoint la discussion',
      'mt-ptbr': 'entrou no bate-papo',
      'mt-arar': 'joined the chat'
    };

    phrases.people = {
      'mt-enus': 'People',
      'mt-eses': 'Gente',
      'mt-frfr': 'Peuple',
      'mt-ptbr': 'Gente',
      'mt-arar': 'People'
    };

    var lang = chatMethods.sid.slice(0, 7);
    $('.submitMessage').text(phrases.messageButton[lang]);
    $('.messageInput').attr('placeholder', phrases.messageInput[lang]).val("").focus().blur()
    $('.usersArea h2').text(phrases.people[lang]);

  };



  return chatMethods;
};

 