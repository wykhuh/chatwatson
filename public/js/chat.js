var Chat = function(){
  var chatMethods = {};
  var socket = io();

  var $usernameInput = $('.usernameInput');
  var $messageInput = $('.messageInput');
  var $messages = $('.messages');
  var $loginForm = $('.loginForm');

  var username;
  var connected = false;
  var $currentInput = $usernameInput.focus();


  var username;
  
  // default translation is english to spanish
  chatMethods.sid = "mt-enus-eses";



  // ask user to input name
  chatMethods.getUsername = function(){
     // username = cleanInput($usernameInput.val().trim());
     username = 'me';

     if(username) {
      // $loginPage.fadeOut();

      // Tell the server your username
      socket.emit('add user', username);

     }
  };

  chatMethods.sendMessage = function() {

    var message =  $messageInput.val();
    console.log('chat send', message, username, chatMethods.sid )

    // emit an event to all other users via sockets
    socket.emit('new message', {text: message, name: username});

    // send the message to IBM Watson via POST to api
    chatMethods.sendToServer({text: message, name: username, sid: chatMethods.sid });

    // clears the input field
    $messageInput.val('');
    return false;
  };



  // send post request to api, which will then send message to IBM Watson
  chatMethods.sendToServer = function(message){
    console.log('chat send to server', message)
    var base_url =window.location.origin+'/api/watson';
    $.post( base_url, message);
  };

  // scroll to the bottom of the page when new messages are added
  chatMethods.scrollToBottom = function(div){
    $messages[0].scrollTop = $messages[0].scrollHeight;
  };

  // set the input and output language
  chatMethods.selectLanguage = function(){

    $("#language").change(function(){
      chatMethods.sid = $(this).val();
      sendText();
    });
  };

  chatMethods.addMessage = function(data, messageType) {
    console.log('chat add', data, messageType);

    if(data.text){
      
      var $message = $('<li class="' + messageType +'">');
      var $username = $('<span class="name">');
      $username.text(data.name + ': ').appendTo($message);
      $message.append(data.text);
      $messages.append($message);
  
      chatMethods.scrollToBottom('messages');
    }
  };

  chatMethods.addParticipantsMessage = function (data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    log(message);
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
    $('#send').text(phrases[lang]);

  };

  // Log a message
  function log (message, options) {
    var $el = $('<li>').addClass('log').text(message);
    // chatMethods.addMessage($el, 'log');
  }

  return chatMethods;
};

 