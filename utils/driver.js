const getDriverSettings = (driverId, driversCollection) =>
  new Promise(resolve => {
    const result = driversCollection.findOne({
      driverId
    });
    if (result) {
      return resolve(result.settings);
    }
    return resolve({});
  });

const updateDriverSettings = (driverId, settings, driversCollection) =>
  new Promise(resolve => {
    const existingDriver = driversCollection.findOne({
      driverId
    });
    let newSettings = settings;
    if (existingDriver === null) {
      driversCollection.insert({ driverId, settings: newSettings });
    } else {
      newSettings = Object.assign(existingDriver.settings, settings);
      existingDriver.settings = newSettings;
      driversCollection.update(existingDriver);
    }
    resolve(newSettings);
  });

const doesDriverExist = (driverId, drivers) =>
  new Promise(resolve => {
    if (!drivers[driverId]) {
      return resolve(false);
    }
    return resolve(true);
  });

const determineEventType = (driverType, constants) => {
  switch (driverType) {
    case "light":
      return constants.DEVICE_LIGHT_EVENT;
    case "speaker":
      return constants.DEVICE_SPEAKER_EVENT;
    case "socket":
      return constants.DEVICE_SOCKET_EVENT;
    case "sensor":
      return constants.DEVICE_SENSOR_EVENT;
    default:
      return null;
  }
};

const getListOfEventsForDeviceType = (deviceType, schemas, constants) => {
  const allowed = Object.values(schemas.deviceTypes[deviceType].events);
  return Object.keys(constants.events)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
      obj[key] = constants.events[key]; // eslint-disable-line no-param-reassign
      return obj;
    }, {});
};

const load = async (
  interfaces,
  fs,
  chalk,
  driversCollection,
  devicesCollection,
  constants,
  eventCreators,
  eventEmitter,
  schemas,
  loadModule
) => {
  const driversArr = {};
  await fs.readdirSync("./node_modules").forEach(async file => {
    if (file.match(/thinglator-driver-/) !== null) {
      const driverId = file;
      const driverModule = loadModule(driverId);
      console.log(chalk.blue(`Loading driver: ${chalk.white(driverId)}`)); // eslint-disable-line no-console

      const interfaceRequired = driverModule.interface;
      const commsInterface = interfaces.getActiveCommsById(interfaceRequired);
      if (commsInterface === undefined) {
        throw new Error(
          `${interfaceRequired} interface not found. Required by ${driverId} driver`
        );
      }

      const events = getListOfEventsForDeviceType(
        driverModule.driverType,
        schemas,
        constants
      );

      const eventType = determineEventType(driverModule.driverType, constants);

      const createEvent = (eventId, deviceId, value) => {
        eventEmitter.emit(
          eventType,
          eventCreators.deviceEvent(
            eventId,
            driverModule.driverType,
            driverModule.driverId,
            deviceId,
            value
          )
        );
      };

      driversArr[driverId] = {
        api: await driverModule.initialise(
          () => getDriverSettings(driverId, driversCollection),
          newSettings =>
            updateDriverSettings(driverId, newSettings, driversCollection),
          commsInterface.methodsAvailableToDriver,
          events,
          createEvent,
          eventEmitter
        ),
        comms: interfaceRequired,
        driverType: driverModule.driverType,
        driverId: driverModule.driverId
      };

      // get a list of devices for this particular driver
      const devices = devicesCollection.find({
        driverId
      });
      await driversArr[driverId].api.initDevices(devices);
    }
  });
  return driversArr;
};

module.exports = (
  fs,
  chalk,
  driversCollection,
  devicesCollection,
  constants,
  eventCreators,
  eventEmitter,
  schemas,
  loadModule
) => ({
  load: interfaces =>
    load(
      interfaces,
      fs,
      chalk,
      driversCollection,
      devicesCollection,
      constants,
      eventCreators,
      eventEmitter,
      schemas,
      loadModule
    ),
  doesDriverExist,
  updateDriverSettings: (driverId, settings) =>
    updateDriverSettings(driverId, settings, driversCollection),
  getDriverSettings: driverId => getDriverSettings(driverId, driversCollection)
});
