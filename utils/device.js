const md5 = require('md5');
const models = require('../models');

const utils = {
    createDevice(type, driver, deviceSpecs) {
        const deviceSpecsObj = new models[type].Model(deviceSpecs);
        return deviceSpecsObj.validate()
      .then((validationFailed) => {
          if (validationFailed) {
              const e = new Error(validationFailed);
              e.type = 'Validation';
              throw e;
          }
          const deviceObj = new models.device.Model({
              _id: md5(type + driver + deviceSpecsObj.deviceId),
              type,
              driver,
              specs: deviceSpecsObj
          });
          return deviceObj.save();
      });
    },

    updateDevice(device, specs) {
        const newDevice = device;
        const deviceSpecsObj = new models[device.type].Model(specs);
        return deviceSpecsObj.validate()
      .then((validationFailed) => {
          if (validationFailed) {
              const e = new Error(validationFailed);
              e.type = 'Validation';
              throw e;
          }
          newDevice.specs = specs;
          return newDevice.save();
      });
    }
};

module.exports = utils;
