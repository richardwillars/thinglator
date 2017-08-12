const _ = require('underscore');
const models = require('../models');
const md5 = require('md5');
const driverUtils = require('../utils/driver');
const deviceUtils = require('../utils/device');
const events = require('../events');

const controller = {
    getDriversWithStats(drivers) {
        let devicesGroupedByDrivers = [];
        return models.device.Model.aggregate([{
            $group: {
                _id: '$driver',
                type: {
                    $first: '$type'
                },
                deviceCount: {
                    $sum: 1
                }
            }
        }]).exec()
        .then((results) => {
            devicesGroupedByDrivers = results;

            const driversWithStats = [];
            Object.keys(drivers).forEach((driverId) => {
                const obj = {
                    _id: drivers[driverId].getName(),
                    type: drivers[driverId].getType(),
                    deviceCount: 0
                };
                const foundStats = _.findWhere(devicesGroupedByDrivers, {
                    _id: drivers[driverId].getName()
                });
                if (foundStats) {
                    obj.deviceCount = foundStats.deviceCount;
                }
                driversWithStats.push(obj);
            });
            return driversWithStats;
        });
    },
    discover(driverId, drivers) {
      // check that the driver exists and that it matches the specified type
        let foundDevices = [];
        let existingDevices = [];
        let finalDevices = [];
        let type = '';
        return driverUtils.doesDriverExist(driverId, drivers)
        .then((foundDriver) => {
          // if found, load it
            if (foundDriver === false) {
                const e = new Error('driver not found');
                e.type = 'NotFound';
                throw e;
            }
            return drivers[driverId];
        })
        .then((driver) => {
            type = driver.getType();
            return driver.discover();
        }) // call the discover method on the driver and wait for it to return devices
        .then((devices) => {
            foundDevices = devices;
            // get a list of existing devices from the db
            return models.device.Model.find({
                type,
                driver: driverId
            }).exec();
        })
        .then((existingDevicesArr) => {
            existingDevices = existingDevicesArr;

            // loop through existingDevices and determine if they exist in the discovery list
            const toUpdate = [];
            _.filter(existingDevices, obj => _.find(foundDevices, (obj2) => {
                if (obj._id === md5(type + driverId + obj2.deviceId)) {
                    toUpdate.push({
                        device: obj,
                        specs: obj2
                    });
                    return true;
                }
                return false;
            }));
            // if they do exist in the discovery list, update them
            const promises = [];
            toUpdate.forEach((r) => {
                promises.push(deviceUtils.updateDevice(r.device, r.specs));
            });
            return Promise.all(promises);
        })
        .then(() => {
          // loop through existingDevices and determine if they don't exist in the discovery list
            const noLongerExists = _.filter(existingDevices, obj =>
              !_.find(foundDevices, obj2 => obj._id === md5(type + driverId + obj2.deviceId))
            );
            // if they don't exist in the discovery list, delete them
            if (noLongerExists.length === 0) {
                return false;
            }
            const noLongerExistsIds = _.pluck(noLongerExists, '_id');
            return models.device.Model.remove({
                _id: {
                    $in: noLongerExistsIds
                }
            }).exec();
        })
        .then(() => {
          // loop through foundDevices and determine if they don't exist in the discovery list
            const newDevices = _.filter(foundDevices, obj =>
              !_.find(existingDevices, obj2 => obj2._id === md5(type + driverId + obj.deviceId))
            );
            // if there are any other devices in discovery list, create them
            const promises = [];
            newDevices.forEach((r) => {
                promises.push(deviceUtils.createDevice(type, driverId, r));
            });
            return Promise.all(promises);
        })
        .then(() => models.device.Model.find({ // get the entire list of devices from the db
            type,
            driver: driverId
        }).exec())
        .then((devices) => {
            finalDevices = devices;
            drivers[driverId].initDevices(finalDevices);
        }).then(() => finalDevices)
        .catch((e) => {
            if (e.type) {
                if (e.type === 'Driver') {
                    e.driver = driverId;
                }
            }
            throw e;
        });
    },
    getEventDescriptions() {
        return Promise.resolve().then(() => {
            const descriptions = {};
            Object.keys(events).forEach((eventId) => {
                if (events[eventId].description) {
                    descriptions[eventId] = {
                        description: events[eventId].description,
                        friendly: events[eventId].friendly,
                        fields: events[eventId].responseSchema.properties
                    };
                }
            });

            return descriptions;
        });
    },
    getCommandDescriptions() {
        return Promise.resolve().then(() => {
            // loop through each model
            const descriptions = {};
            Object.keys(models).forEach((modelId) => {
                if (models[modelId].Model) {
                    const schema = models[modelId].Model.schema.paths;
                    Object.keys(schema).forEach((fieldId) => {
                        if (fieldId.startsWith('commands.') && schema[fieldId].options && schema[fieldId].options.description) {
                            if (descriptions[modelId] === undefined) {
                                descriptions[modelId] = {};
                            }
                            descriptions[modelId][fieldId.substring(9)] = {
                                description: schema[fieldId].options.description,
                                friendly: schema[fieldId].options.friendly
                            };
                        }
                    });
                }
            });
            return descriptions;
        });
    }
};

module.exports = controller;
