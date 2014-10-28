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
    $.post( base_url, message);
  };

  // scroll to the bottom of the page when new messages are added
  chatMethods.scrollToBottom = function(div){
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

 