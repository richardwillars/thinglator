

const fs = require('fs');
const models = require('../models');

class DriverSettings {
    constructor(driverId) {
        this.driverId = driverId;
    }

    get() {
        const self = this;
        return new Promise((resolve, reject) => {
            models.driver.Model.findOne({
                _id: self.driverId
            }).exec().then((result) => {
                resolve(result.settings);
            }).catch((e) => {
                reject(e);
            });
        });
    }

    set(settings) {
        return models.driver.Model.update({
            _id: this.driverId
        }, {
            settings
        }, {
            upsert: true,
            setDefaultsOnInsert: true
        }).exec();
    }
}

const utils = {
    getDriverSettingsClass() {
        return DriverSettings;
    },

    doesDriverExist(driverId, type, drivers) {
        return new Promise((resolve) => {
            if (!drivers[driverId]) {
                return resolve(false);
            }
            if (drivers[driverId].getType() !== type) {
                return resolve(false);
            }
            return resolve(true);
        });
    },
    loadDrivers() {
        const driversArr = [];
        fs.readdirSync('./node_modules').forEach((file) => {
            if (file.match(/thinglator-driver-/) !== null) {
                const name = file.replace('thinglator-driver-', '');
                const Driver = require(`thinglator-driver-${name}`);

                const interfaces = {
                    http: {}
                };

                driversArr[name] = new Driver(new DriverSettings(name), interfaces);
                driversArr[name].setEventEmitter(models[driversArr[name].getType()].DeviceEventEmitter);

                // get a list of devices for this particular driver
                models.device.Model.find({
                    type: driversArr[name].getType(),
                    driver: name
                }).exec((err, devices) => {
                    if (err) {
                        throw new Error(err);
                    }
                    driversArr[name].initDevices(devices);
                });
            }
        });
        return driversArr;
    }
};

module.exports = utils;
