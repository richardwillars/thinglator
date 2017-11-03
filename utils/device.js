// const md5 = require('md5');
// const models = require('../models');

module.exports = (md5, models) => ({
  createDevice: async (type, driverId, deviceSpecs) => {
    const deviceSpecsObj = new models[type].model(deviceSpecs);
    const validationFailed = await deviceSpecsObj.validate();
    if (validationFailed) {
      const e = new Error(validationFailed);
      e.type = 'Validation';
      throw e;
    }
    const deviceObj = new models.device.model({
      _id: md5(`${type}${driverId}${deviceSpecsObj.originalId}`),
      type,
      driver: driverId,
      specs: deviceSpecsObj,
    });
    await deviceObj.save();
  },

  updateDevice: async (device, specs) => {
    const newDevice = device;
    const deviceSpecsObj = new models[device.type].model(specs);
    const validationFailed = await deviceSpecsObj.validate();

    if (validationFailed) {
      const e = new Error(validationFailed);
      e.type = 'Validation';
      throw e;
    }
    newDevice.specs = specs;
    await newDevice.save();
  },
});
