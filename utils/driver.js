const getDriverSettings = (driverId, models) => new Promise((resolve, reject) => {
  models.driver.model.findOne({
    _id: driverId,
  }).lean().exec().then((result) => {
    if (result) {
      return resolve(result.settings);
    }
    return resolve({});
  })
    .catch((e) => {
      reject(e);
    });
});

const updateDriverSettings = (driverId, settings, models) => models.driver.model.update({
  _id: driverId,
}, {
  settings,
}, {
  upsert: true,
  setDefaultsOnInsert: true,
}).exec();

const doesDriverExist = (driverId, drivers) => new Promise((resolve) => {
  if (!drivers[driverId]) {
    return resolve(false);
  }
  return resolve(true);
});

const determineEventType = (driverType, constants) => {
  switch (driverType) {
    case 'light':
      return constants.DEVICE_LIGHT_EVENT;
    case 'speaker':
      return constants.DEVICE_SPEAKER_EVENT;
    case 'socket':
      return constants.DEVICE_SOCKET_EVENT;
    case 'sensor':
      return constants.DEVICE_SENSOR_EVENT;
    default:
      return null;
  }
};

const load = async (interfaces, fs, chalk, models, constants, eventCreators, eventEmitter) => {
  const driversArr = [];
  await fs.readdirSync('./node_modules').forEach(async (file) => {
    if (file.match(/thinglator-driver-/) !== null) {
      const driverId = file;
      const driverModule = require(`${driverId}`);

      console.log(chalk.blue(`Loading driver: ${chalk.white(driverId)}`)); // eslint-disable-line no-console

      const interfaceRequired = driverModule.interface;
      const commsInterface = interfaces.getActiveCommsById(interfaceRequired);
      if (commsInterface === undefined) {
        throw new Error(`${interfaceRequired} interface not found. Required by ${driverId} driver`);
      }

      const events = constants[driverModule.driverType];

      const eventType = determineEventType(driverModule.driverType, constants);
      const createEvent = (eventId, deviceId, value) => {
        eventEmitter.emit(eventType, eventCreators.deviceEvent(eventId, driverModule.driverType, driverModule.driverId, deviceId, value));
      };

      driversArr[driverId] = {
        api: await driverModule.initialise(() => getDriverSettings(driverId, models), newSettings => updateDriverSettings(driverId, newSettings, models), commsInterface.methodsAvailableToDriver, events, createEvent, eventEmitter),
        comms: interfaceRequired,
        driverType: driverModule.driverType,
        driverId: driverModule.driverId,
      };

      // get a list of devices for this particular driver
      const devices = await models.device.model.find({
        type: driversArr[driverId].driverType,
        driver: driverId,
      }).lean().exec();
      await driversArr[driverId].api.initDevices(devices);
    }
  });
  return driversArr;
};


module.exports = (fs, chalk, models, constants, eventCreators, eventEmitter) => ({
  load: interfaces => load(interfaces, fs, chalk, models, constants, eventCreators, eventEmitter),
  doesDriverExist,
  updateDriverSettings: (driverId, settings) => updateDriverSettings(driverId, settings, models),
  getDriverSettings: driverId => getDriverSettings(driverId, models),
});
