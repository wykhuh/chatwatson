$(document).ready(function() {
  var Chat = function(){
    var chatMethods = {};

    chatMethods.name;
    // default translation is english to spanish
    chatMethods.sid = "mt-enus-eses";

    // ask user to input name
    chatMethods.showPrompt = function(){
      do {
        chatMethods.name = prompt('Please enter your name');
      } while (chatMethods.name.length < 1);
    };

    // send post request to api, which will then send message to IBM Watson
    chatMethods.sendToServer = function(message){
      var base_url =window.location.origin+'/api/watson';
      console.log(base_url)
      $.post( base_url, message);
    };

    // scroll to the bottom of the page when new messages are added
    chatMethods.scrollToBottom = function(div){
      // scroll(0, document.getElementById(div).scrollHeight);
      $messages = $('#messages')
          $messages[0].scrollTop = $messages[0].scrollHeight;

    };

    // set the input and output language
    chatMethods.selectLanguage = function(){

      $("#language").change(function(){
        chatMethods.sid = $(this).val();
        sendText();
      });
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

    return chatMethods;
  };

  var chat = Chat();
  var socket = io();

  chat.selectLanguage();

  chat.showPrompt();

  // chat.dText();


  // when user submits a message
  $('form').submit(function(){

    var message =  $('#m').val();
    // emit an event to all other users via sockets
    socket.emit('chat message', {text: message, name: chat.name});

    // send the message to IBM Watson via POST to api
    chat.sendToServer({text: message, name: chat.name, sid: chat.sid });

    // clears the input field
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

  // when client recieves a 'translate' event via sockets, add the translated message to 
  // the DOM
  socket.on('translate message', function(msg){
    var $messages = $('#messages');
    
    var $message = $('<li class="translate">');
    var $username = $('<span class="name">');
    $username.text(msg.name + ': ').appendTo($message);
    $message.append(msg.text);
    console.log(msg.text)
    $messages.append($message);

    chat.scrollToBottom('messages');
  });


});

