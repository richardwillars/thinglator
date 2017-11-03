const getDriversWithStats = async (models, _, driverList) => {
  const devicesGroupedByDrivers = await models.device.model.aggregate([{
    $group: {
      _id: '$driver',
      type: {
        $first: '$type',
      },
      deviceCount: {
        $sum: 1,
      },
    },
  }]).exec();

  const driversWithStats = [];
  Object.keys(driverList).forEach((driverId) => {
    const obj = {
      _id: driverList[driverId].driverId,
      type: driverList[driverId].driverType,
      deviceCount: 0,
    };
    const foundStats = _.findWhere(devicesGroupedByDrivers, {
      _id: driverList[driverId].driverId,
    });
    if (foundStats) {
      obj.deviceCount = foundStats.deviceCount;
    }
    driversWithStats.push(obj);
  });
  return driversWithStats;
};

const discover = async (driverId, driverUtils, models, md5, deviceUtils, driverList) => {
  try {
  // check that the driver exists and that it matches the specified type
    const foundDriver = await driverUtils.doesDriverExist(driverId, driverList);

    // if found, load it
    if (foundDriver === false) {
      const e = new Error('driver not found');
      e.type = 'NotFound';
      throw e;
    }
    const driver = driverList[driverId];
    const type = driver.driverType;

    console.log('driverId', driverId);
    console.log('driver', driver);
    console.log('type', type);
    // call the discover method on the driver and wait for it to return devices
    const foundDevices = await driver.api.discover() || [];

    // get a list of existing devices from the db
    const existingDevices = await models.device.model.find({
      type,
      driver: driverId,
    }).exec();

    console.log('existingDevices', existingDevices);
    console.log('foundDevices', foundDevices);

    // loop through existingDevices and determine if they exist in the foundDevices list
    const toUpdate = [];
    existingDevices.forEach((existingDevice) => {
      foundDevices.find((foundDevice) => {
        if (existingDevice._id === md5(`${type}${driverId}${foundDevice.originalId}`)) {
          if ((typeof foundDevice.name === 'undefined') || (foundDevice.name === '')) {
            foundDevice.name = existingDevice.specs.name;
          }
          toUpdate.push({
            device: existingDevice,
            specs: foundDevice,
          });
          return true;
        }
        return false;
      });
    });

    // if they do exist in the foundDevices list, update them
    const promises = [];
    console.log('toUpdate', toUpdate);
    toUpdate.forEach((r) => {
      promises.push(deviceUtils.updateDevice(r.device, r.specs));
    });
    await Promise.all(promises);

    // loop through foundDevices and determine if they don't exist in the existing devices list
    const newDevices = foundDevices.filter(foundDevice => existingDevices.find(existingDevice => existingDevice._id === md5(`${type}${driverId}${foundDevice.originalId}`)) === undefined);
    console.log('new devices', newDevices);
    // if there are any other devices in foundDevices, create them
    await Promise.all(newDevices.map(async (r) => {
      await deviceUtils.createDevice(type, driverId, r);
    }));

    const finalDevices = await models.device.model.find({ // get the entire list of devices from the db
      type,
      driver: driverId,
    }).lean().exec();

    await driverList[driverId].api.initDevices(finalDevices);
    return finalDevices;
  } catch (e) {
    if (e.type) {
      if (e.type === 'Driver') {
        e.driver = driverId;
      }
    }
    throw e;
  }
};

const getEventDescriptions = async (events) => {
  const descriptions = {};
  Object.keys(events).forEach((eventId) => {
    if (events[eventId].description) {
      descriptions[eventId] = {
        description: events[eventId].description,
        friendly: events[eventId].friendly,
        fields: events[eventId].responseSchema.properties,
      };
    }
  });
  return descriptions;
};

const getCommandDescriptions = async (models) => {
  // loop through each model
  const descriptions = {};
  Object.keys(models).forEach((modelId) => {
    if (models[modelId].schema) {
      const { schema } = models[modelId];

      if (typeof schema.commands !== 'undefined') {
        Object.keys(schema.commands).forEach((commandId) => {
          if (typeof descriptions[modelId] === 'undefined') {
            descriptions[modelId] = {};
          }
          descriptions[modelId][commandId] = {
            description: schema.commands[commandId].description,
            friendly: schema.commands[commandId].friendly,
          };
        });
      }
    }
  });
  return descriptions;
};

const getAllDevices = async models => models.device.model.find().lean().exec();

const getDevicesByType = async (driverType, models) => models.device.model.find({
  type: driverType,
}).lean().exec();

const getDevicesByDriver = async (driverId, models) => models.device.model.find({
  driver: driverId,
}).lean().exec();

const getDeviceById = async (deviceId, models) => {
  const device = await models.device.model.findOne({
    _id: deviceId,
  }).lean().exec();

  if (!device) {
    const e = new Error('device not found');
    e.type = 'NotFound';
    throw e;
  }
  return device;
};

const getDeviceTypes = async (models) => {
  const types = {};
  Object.keys(models)
    .filter(modelId => models[modelId].DeviceEventEmitter !== undefined)
    .forEach((modelId) => {
      types[modelId] = models[modelId].schema;
    });
  return types;
};

const runCommand = async (deviceId, command, body, driverList, models, jsonValidator) => {
  const device = await models.device.model.findOne({
    _id: deviceId,
  }).lean().exec();

  if (!device) {
    const e = new Error('device not found');
    e.type = 'NotFound';
    throw e;
  }
  if (typeof device.specs.commands[command] === 'undefined') {
    const e = new Error('command not found');
    e.type = 'BadRequest';
    throw e;
  }
  if (device.specs.commands[command] === false) {
    const e = new Error('command not supported');
    e.type = 'BadRequest';
    throw e;
  }
  const driverObj = driverList[device.driver];

  const fnName = `command_${command}`;
  // if a schema is specified, confirm that the request body matches it

  const commandRequestSchema = models[device.type].schema.commands[command].requestSchema;
  if (commandRequestSchema) {
    const validated = jsonValidator.validate(body, commandRequestSchema);
    if (validated.errors.length !== 0) {
      const e = new Error('the supplied json is invalid');
      e.type = 'Validation';
      e.errors = validated.errors;
      throw e;
    }
  }
  return driverObj.api[fnName](device, body);
};


module.exports = (_, models, md5, driverUtils, deviceUtils, driverList, jsonValidator) => ({
  getDriversWithStats: () => getDriversWithStats(models, _, driverList),
  discover: driverId => discover(driverId, driverUtils, models, md5, deviceUtils, driverList),
  getEventDescriptions: () => getEventDescriptions(models.events),
  getCommandDescriptions: () => getCommandDescriptions(models),
  getAllDevices: () => getAllDevices(models),
  getDevicesByType: driverType => getDevicesByType(driverType, models),
  getDevicesByDriver: driverId => getDevicesByDriver(driverId, models),
  getDeviceById: deviceId => getDeviceById(deviceId, models),
  getDeviceTypes: () => getDeviceTypes(models),
  runCommand: (deviceId, command, body) => runCommand(deviceId, command, body, driverList, models, jsonValidator),
});
