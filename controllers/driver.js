const groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

const getDriversWithStats = async (devicesCollection, driverList) => {
  const devices = devicesCollection.find();
  const devicesGroupedByDrivers = groupBy(devices, "driverId");
  return Object.keys(devicesGroupedByDrivers).map(driverId => {
    const driverInfo = Object.values(driverList).find(
      driver => driver.driverId === driverId
    );
    return {
      driverId,
      deviceCount: devicesGroupedByDrivers[driverId].length,
      comms: driverInfo ? driverInfo.comms : null,
      type: driverInfo ? driverInfo.driverType : null
    };
  });
};

const discover = async (
  driverId,
  driverUtils,
  devicesCollection,
  md5,
  deviceUtils,
  driverList
) => {
  try {
    // check that the driver exists and that it matches the specified type
    const foundDriver = await driverUtils.doesDriverExist(driverId, driverList);

    // if found, load it
    if (foundDriver === false) {
      const e = new Error("driver not found");
      e.type = "NotFound";
      throw e;
    }
    const driver = driverList[driverId];
    const type = driver.driverType;

    // call the discover method on the driver and wait for it to return devices
    const foundDevices = (await driver.api.discover()) || [];

    // get a list of existing devices from the db
    const existingDevices = devicesCollection.find({
      type,
      driverId
    });

    console.log("existingDevices", existingDevices);
    console.log("foundDevices", foundDevices);

    // loop through existingDevices and determine if they exist in the foundDevices list
    const toUpdate = [];
    existingDevices.forEach(existingDevice => {
      foundDevices.find(foundDevice => {
        if (
          existingDevice.deviceId ===
          md5(`${type}${driverId}${foundDevice.originalId}`)
        ) {
          if (
            typeof foundDevice.name === "undefined" ||
            foundDevice.name === ""
          ) {
            foundDevice.name = existingDevice.name;
          }
          toUpdate.push({
            device: existingDevice,
            specs: foundDevice
          });
          return true;
        }
        return false;
      });
    });

    // if they do exist in the foundDevices list, update them
    const promises = [];
    console.log("toUpdate", toUpdate);
    toUpdate.forEach(r => {
      promises.push(deviceUtils.updateDevice(r.device, r.specs));
    });
    await Promise.all(promises);

    // loop through foundDevices and determine if they don't exist in the existing devices list
    const newDevices = foundDevices.filter(
      foundDevice =>
        existingDevices.find(
          existingDevice =>
            existingDevice.deviceId ===
            md5(`${type}${driverId}${foundDevice.originalId}`)
        ) === undefined
    );
    console.log("new devices", newDevices);
    // if there are any other devices in foundDevices, create them
    await Promise.all(
      newDevices.map(async r => {
        await deviceUtils.createDevice(type, driverId, r);
      })
    );

    const finalDevices = devicesCollection.find({
      // get the entire list of devices from the db
      type,
      driverId
    });

    await driverList[driverId].api.initDevices(finalDevices);
    return finalDevices;
  } catch (e) {
    if (e.type) {
      if (e.type === "Driver") {
        e.driver = driverId;
      }
    }
    throw e;
  }
};

const getEventDescriptions = async schemas => {
  const events = {};
  Object.keys(schemas.deviceTypes).forEach(type => {
    events[type] = schemas.deviceTypes[type].events;
  });
  return events;
};

const getCommands = async schemas => {
  const commands = {};
  Object.keys(schemas.deviceTypes).forEach(type => {
    commands[type] = schemas.deviceTypes[type].commands;
  });
  return commands;
};

const getAllDevices = async devicesCollection => devicesCollection.find();

const getDevicesByType = async (driverType, devicesCollection) =>
  devicesCollection.find({
    type: driverType
  });

const getDevicesByDriver = async (driverId, devicesCollection) =>
  devicesCollection.find({
    driverId
  });

const getDeviceById = async (deviceId, devicesCollection) => {
  const device = devicesCollection.findOne({
    deviceId
  });

  if (!device) {
    const e = new Error("device not found");
    e.type = "NotFound";
    throw e;
  }
  return device;
};

const getDeviceTypes = async models => {
  const types = {};
  Object.keys(models)
    .filter(
      modelId =>
        models[modelId].schema &&
        models[modelId].schema.commands !== undefined &&
        models[modelId].schema.events !== undefined
    )
    .forEach(modelId => {
      types[modelId] = models[modelId].schema;
    });
  return types;
};

const runCommand = async (
  deviceId,
  command,
  body,
  driverList,
  devicesCollection,
  schemas,
  jsonValidator
) => {
  const device = devicesCollection.findOne({
    deviceId
  });

  if (!device) {
    const e = new Error("device not found");
    e.type = "NotFound";
    throw e;
  }
  if (typeof device.commands[command] === "undefined") {
    const e = new Error("command not found");
    e.type = "BadRequest";
    throw e;
  }
  if (device.commands[command] === false) {
    const e = new Error("command not supported");
    e.type = "BadRequest";
    throw e;
  }
  const driverObj = driverList[device.driverId];

  const fnName = `command_${command}`;
  // if a schema is specified, confirm that the request body matches it
  const commandRequestSchema =
    schemas.deviceTypes[driverObj.driverType].commands.properties[command]
      .requestSchema;
  if (commandRequestSchema) {
    const validated = jsonValidator.validate(body, commandRequestSchema);
    if (validated.errors.length !== 0) {
      const e = new Error("the supplied json is invalid");
      e.type = "Validation";
      e.errors = validated.errors;
      throw e;
    }
  }
  return driverObj.api[fnName](device, body);
};

module.exports = (
  devicesCollection,
  eventsCollection,
  md5,
  driverUtils,
  deviceUtils,
  driverList,
  jsonValidator,
  schemas
) => ({
  getDriversWithStats: () => getDriversWithStats(devicesCollection, driverList),
  discover: driverId =>
    discover(
      driverId,
      driverUtils,
      devicesCollection,
      md5,
      deviceUtils,
      driverList
    ),
  getEventDescriptions: () => getEventDescriptions(schemas),
  getCommands: () => getCommands(schemas),
  getAllDevices: () => getAllDevices(devicesCollection),
  getDevicesByType: driverType =>
    getDevicesByType(driverType, devicesCollection),
  getDevicesByDriver: driverId =>
    getDevicesByDriver(driverId, devicesCollection),
  getDeviceById: deviceId => getDeviceById(deviceId, devicesCollection),
  getDeviceTypes: () => getDeviceTypes(devicesCollection),
  runCommand: (deviceId, command, body) =>
    runCommand(
      deviceId,
      command,
      body,
      driverList,
      devicesCollection,
      schemas,
      jsonValidator
    )
});
