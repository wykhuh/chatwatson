var Chat = function(){
  var chatMethods = {};
  var socket = io();

  var $usernameInput = $('.usernameInput');
  var $messageInput = $('.messageInput');
  var $messages = $('.messages');
  var $loginArea = $('.loginArea');
  var $chatArea =  $('.chatArea');

  var username;
  // var connected = false;
  var $currentInput = $usernameInput.focus();


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
     // username = 'me';

     if(username) {

      // Tell the server your username
      socket.emit('add user', username);

     }
  };

    // set the input and output language
  chatMethods.selectLanguage = function(){
    $("#language").change(function(){
      chatMethods.sid = $(this).val();
      sendText();
    });
  };



  chatMethods.submitMessage = function() {
    var message =  $messageInput.val();
    console.log('chat send', message, username, chatMethods.sid )

    // emit an event to all other users via sockets
    socket.emit('new message', {text: message, name: username});

    // send the message to IBM Watson via POST to api
    // sendToServer({text: message, name: username, sid: chatMethods.sid });

    // clears the input field
    $messageInput.val('');
    return false;
  };


  // send post request to api, which will then send message to IBM Watson
  var sendToServer = function(message){
    console.log('chat send to server', message)
    var base_url =window.location.origin+'/api/watson';
    $.post( base_url, message);
  };

  // add message to DOM
  chatMethods.addMessage = function(data, messageType) {
    console.log('chat add', data, messageType);

    if(data.text){
      var $message = $('<li class="' + messageType +'">');

      if(data.name){
        var $username = $('<span class="name">');
        $username.text(data.name + ': ').appendTo($message);
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
    console.log('chat log', message)
    chatMethods.addMessage({text: message}, 'log');
  };

  // Prevents input from having injected markup
  var cleanInput = function (input) {
    return $('<div/>').text(input).text();
  };

  // changes the text for the "Send" button
  var sendText = function(){
    phrases = {
      'mt-enus': 'Send',
      'mt-eses': 'Enviar',
      'mt-frfr': 'Envoi',
      'mt-ptbr': 'Enviar',
      'mt-arar': 'Send'
    };

    var lang = chatMethods.sid.slice(0, 7);
    $('.submitMessage').text(phrases[lang]);

  };



  return chatMethods;
};

 