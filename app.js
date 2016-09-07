'use strict';
//load and initialise express
var express = require('express');
var app = express();

//connect to the database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/homebox');

//Get the drivers and initialise them
var driverUtils = require('./utils/driver');
var drivers = driverUtils.loadDrivers();

//setup the HTTP API
var httpApi = require('./httpApi')(app, drivers);

//Initialise the webserver
var httpServer = app.listen(3000, function() {
	console.log('Homebox listening on port 3000!');
});

//setup the websocket API
var socketApi = require('./socketApi').socketApi(httpServer, drivers);