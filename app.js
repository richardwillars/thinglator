/* eslint-disable no-console */
const config = require("config");
const chalk = require("chalk");
const md5 = require("md5");
const Loki = require("lokijs");
const express = require("express");
const ioLib = require("socket.io");
const bodyParser = require("body-parser");
const fs = require("fs");
const jsonschema = require("jsonschema");
const EventEmitter = require("events");

const constants = require("./constants");
const eventCreators = require("./eventCreators");
const driverUtilsModule = require("./utils/driver");
const eventUtilsModule = require("./utils/event");
const deviceUtilsModule = require("./utils/device");
const jobsUtilsModule = require("./utils/jobs");
const commsLoader = require("./comms");
const socketApi = require("./socketApi");
const authenticateCtrlModule = require("./controllers/authenticate");
const eventCtrlModule = require("./controllers/event");
const driverCtrlModule = require("./controllers/driver");
const schemasModule = require("./schemas");
const httpApi = require("./httpApi");

console.log(chalk.yellow("Starting Thinglator"));

const comms = commsLoader(fs, chalk);

process.on("SIGINT", async () => {
  try {
    await comms.disconnectAll();
  } catch (err) {
    console.log("ERROR2", err);
  }

  console.log(chalk.yellow("Stopping Thinglator"));
  process.exit();
});

let driversCollection = null;
let devicesCollection = null;
let eventsCollection = null;
let db = null;
const setupDb = () =>
  new Promise(resolve => {
    const databaseInitialize = () => {
      driversCollection = db.getCollection("drivers");
      // console.log(driversCollection);
      if (!driversCollection) {
        driversCollection = db.addCollection("drivers", {
          unique: ["driverId"]
        });
      }
      devicesCollection = db.getCollection("devices");
      if (!devicesCollection) {
        devicesCollection = db.addCollection("devices", {
          unique: ["deviceId"]
        });
      }
      eventsCollection = db.getCollection("events");
      if (!eventsCollection) {
        eventsCollection = db.addCollection("events");
      }

      resolve();
    };

    db = new Loki("thinglator.db", {
      autoload: true,
      autoloadCallback: databaseInitialize,
      autosave: true,
      autosaveInterval: 4000
    });
  });

const loadModule = moduleId => require(`${moduleId}`);

const launch = async () => {
  const jsonValidator = new jsonschema.Validator();

  console.log(chalk.blue("Setting up database.."));
  await setupDb();
  const schemas = schemasModule(constants);
  const eventUtils = eventUtilsModule(
    EventEmitter,
    constants,
    schemas,
    jsonValidator,
    eventsCollection
  );
  const deviceUtils = deviceUtilsModule(
    md5,
    devicesCollection,
    schemas,
    jsonValidator
  );
  const driverUtils = driverUtilsModule(
    fs,
    chalk,
    driversCollection,
    devicesCollection,
    constants,
    eventCreators,
    eventUtils.eventEmitter,
    schemas,
    loadModule
  );
  const jobsUtils = jobsUtilsModule(eventsCollection);
  console.log(chalk.blue("Database initialised!"));

  jobsUtils.schedule();
  console.log(chalk.blue("Jobs scheduled!"));

  // get a list of all potential interfaces (one for each communication protocol)
  const availableInterfaces = comms.installInterfaces();
  // load the comms using the available interfaces and their configs
  await comms.initialise(
    availableInterfaces,
    config.get("interfaces"),
    eventUtils.eventEmitter
  );
  console.log(chalk.blue("All comms connected!"));

  // Get the drivers and initialise them
  const driverList = await driverUtils.load(comms);
  console.log(chalk.blue("All drivers connected!"));

  const driverCtrl = driverCtrlModule(
    devicesCollection,
    eventsCollection,
    md5,
    driverUtils,
    deviceUtils,
    driverList,
    jsonValidator,
    schemas
  );
  const authenticateCtrl = authenticateCtrlModule(
    jsonValidator,
    schemas.authentication,
    driverUtils,
    driverList
  );
  const eventCtrl = eventCtrlModule(eventsCollection);

  // load and initialise express
  const app = express();

  // setup the HTTP API
  httpApi(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, driverList);

  // Initialise the webserver
  const httpServer = app.listen(config.get("port"), () => {
    console.log(
      chalk.blue(`REST API server listening on port ${config.get("port")}`)
    );
  });

  // setup the websocket API
  socketApi.initialise(
    ioLib,
    authenticateCtrl,
    eventCtrl,
    driverCtrl,
    eventUtils,
    httpServer,
    driverList,
    constants
  );
  console.log(
    chalk.blue(`WebSocket server listening on port ${config.get("port")}`)
  );
};

try {
  launch();
} catch (err) {
  console.log("ERROR", err);
  process.emit("SIGINT");
}
