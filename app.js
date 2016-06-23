var express = require('express');
var app = express();
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/homebox');

app.get('/', function (req, res) {
  res.send('Hello World!');
});

/*
GET discover/:type/:driver
-> GET discover/speaker/sonos

GET devices/:type
-> GET devices/speaker

GET devices/:type/:driver
-> GET getDevices/speaker/sonos

GET device/:_id
-> GET device/abc123
*/


app.listen(3000, function () {
  console.log('homebox listening on port 3000!');
});