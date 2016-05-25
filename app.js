var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var request = require('request')
app.use(bodyParser.json())

/**Test**/
app.get('/ping', function (req, res) {
  res.send('Pong!');
});

/**To verify**/
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'your-secret-is-safe-with-me') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

var allSenders = {}

/**To Receive Messages and do the things we want to do**/
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    allSenders[sender] = true;
    if (event.message && event.message.text) {
      text = event.message.text;
      // Handle a text message from this sender      
      console.log(allSenders);
      Object.keys(allSenders).forEach(function(senderId){
      	sendTextMessage(senderId, text);
      });      
    }
  }
  res.sendStatus(200);
});

var token = "EAADKFiqFwvMBABqL3681jZC4FyVtZBOztfSmZBJNBbfci77BijqdQhHovb51WdvldyKosWhsZBfmtzKDWMKij5aHjaDhupOblAAWwA6bQUz3KQotv2hum3aGCBLZC42inX1Sn5qd8P9nSogVgHj3RcnE4aZCvD0ZAh01QWL0ZCur7gZDZD";

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(process.env.PORT || 3000, function () {
  //console.log('Example app listening on port ' + process.env.PORT + '!');
});