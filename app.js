/* eslint-disable no-console */
const config = require('config');
const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');
const driverUtils = require('./utils/driver');
const commsUtils = require('./utils/comms');
const socketApi = require('./socketApi');
const httpApi = require('./httpApi');

console.log(chalk.yellow('Starting Thinglator'));

// load and initialise express
const app = express();

// connect to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/thinglator');

const interfaceConfig = {
    zwave: {
        hardwareLocation: '/dev/cu.usbmodem1411',
        debug: true
    }
};

// get a list of all potential interfaces (one for each communication protocol)
const availableInterfaces = commsUtils.loadInterfaces();

// load the comms using the available interfaces and their configs
const comms = commsUtils.loadComms(availableInterfaces, interfaceConfig);
// loop through the comms and connect them
const commsConnectPromises = [];
Object.keys(comms).forEach((i) => {
    console.log(chalk.blue(`Connecting to comms: ${chalk.white(i)}`));
    commsConnectPromises.push(comms[i].connect());
});

Promise.all(commsConnectPromises).then(() => {
    console.log(chalk.blue('All comms connected!'));

    // Get the drivers and initialise them
    const drivers = driverUtils.loadDrivers();
    console.log(chalk.blue('All drivers connected!'));
    // setup the HTTP API
    httpApi(app, drivers);

    // Initialise the webserver
    const httpServer = app.listen(config.get('port'), () => {
        console.log(chalk.blue(`REST API server listening on port ${config.get('port')}`));
    });

    // setup the websocket API
    socketApi.socketApi(httpServer, drivers);
    console.log(chalk.blue(`WebSocket server listening on port ${config.get('port')}`));
}).catch((err) => {
    console.log(chalk.red(err));
    process.emit('SIGINT');
});

process.on('SIGINT', () => {
    const commsDisconnectPromises = [];
    Object.keys(comms).forEach((i) => {
        console.log(chalk.blue(`Disconnecting from comms: ${chalk.white(i)}`));
        commsDisconnectPromises.push(comms[i].disconnect());
    });

    Promise.all(commsDisconnectPromises).then(() => {
        console.log(chalk.blue('All comms disconnected!'));
    }).catch((err) => {
        console.log(chalk.red(err));
    }).then(() => {
        console.log(chalk.yellow('Stopping Thinglator'));
        process.exit();
    });
});
