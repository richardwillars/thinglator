/* eslint-disable no-console */
const config = require('config');
const chalk = require('chalk');
const md5 = require('md5');
const mongoose = require('mongoose');
const express = require('express');
const ioLib = require('socket.io');
const bodyParser = require('body-parser');
const fs = require('fs');
const jsonschema = require('jsonschema');
const _ = require('underscore');
const EventEmitter = require('events');
const constants = require('./constants');
const eventCreators = require('./eventCreators');

const driverUtilsModule = require('./utils/driver');
const eventUtilsModule = require('./utils/event');
const deviceUtilsModule = require('./utils/device');
const commsLoader = require('./comms');
const socketApi = require('./socketApi');
const authenticateCtrlModule = require('./controllers/authenticate');
const eventCtrlModule = require('./controllers/event');
const driverCtrlModule = require('./controllers/driver');
const modelsModule = require('./models');
const httpApi = require('./httpApi');

console.log(chalk.yellow('Starting Thinglator'));

const comms = commsLoader(fs, chalk);

process.on('SIGINT', async () => {
  try {
    await comms.disconnectAll();
  } catch (err) {
    console.log('ERROR2', err);
  }

  console.log(chalk.yellow('Stopping Thinglator'));
  process.exit();
});

const jsonValidator = new jsonschema.Validator();

const models = modelsModule(mongoose, constants);
const eventUtils = eventUtilsModule(EventEmitter, constants, models, jsonValidator);
const deviceUtils = deviceUtilsModule(md5, models);
const driverUtils = driverUtilsModule(fs, chalk, models, constants, eventCreators, eventUtils.eventEmitter);


const launch = async () => {
  // connect to the database
  mongoose.Promise = global.Promise;
  mongoose.connect(`mongodb://${config.get('mongodb.host')}/${config.get('mongodb.db')}`);

  // get a list of all potential interfaces (one for each communication protocol)
  const availableInterfaces = comms.installInterfaces();
  // load the comms using the available interfaces and their configs
  await comms.initialise(availableInterfaces, config.get('interfaces'), eventUtils.eventEmitter);
  console.log(chalk.blue('All comms connected!'));

  // Get the drivers and initialise them
  const driverList = await driverUtils.load(comms);
  console.log(chalk.blue('All drivers connected!'));

  const driverCtrl = driverCtrlModule(_, models, md5, driverUtils, deviceUtils, driverList, jsonValidator);
  const authenticateCtrl = authenticateCtrlModule(jsonValidator, models, driverUtils, driverList);
  const eventCtrl = eventCtrlModule(models);

  // load and initialise express
  const app = express();

  // setup the HTTP API
  httpApi(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, driverList);

  // Initialise the webserver
  const httpServer = app.listen(config.get('port'), () => {
    console.log(chalk.blue(`REST API server listening on port ${config.get('port')}`));
  });

  // setup the websocket API
  socketApi.initialise(ioLib, authenticateCtrl, eventCtrl, driverCtrl, eventUtils, httpServer, driverList, constants);
  console.log(chalk.blue(`WebSocket server listening on port ${config.get('port')}`));
};

try {
  launch();
} catch (err) {
  console.log('ERROR', err);
  process.emit('SIGINT');
}
