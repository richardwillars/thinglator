const express = require('express');
const mongoose = require('mongoose');
const driverUtils = require('./utils/driver');

// load and initialise express
const app = express();

// connect to the database

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/thinglator');

// Get the drivers and initialise them
const drivers = driverUtils.loadDrivers();

// setup the HTTP API
require('./httpApi')(app, drivers);

// Initialise the webserver
const httpServer = app.listen(3000, () => {
    console.log('thinglator listening on port 3000!'); // eslint-disable-line no-console
});

// setup the websocket API
require('./socketApi').socketApi(httpServer, drivers);
