const fs = require('fs');
const chalk = require('chalk');
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
                if (result) {
                    return resolve(result.settings);
                }
                return resolve({});
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

    doesDriverExist(driverId, drivers) {
        return new Promise((resolve) => {
            if (!drivers[driverId]) {
                return resolve(false);
            }
            return resolve(true);
        });
    },
    loadDrivers(interfaces) {
        const driversArr = [];
        fs.readdirSync('./node_modules').forEach((file) => {
            if (file.match(/thinglator-driver-/) !== null) {
                const name = file.replace('thinglator-driver-', '');
                const Driver = require(`thinglator-driver-${name}`);

                console.log(chalk.blue(`Loading driver: ${chalk.white(name)}`)); // eslint-disable-line no-console

                driversArr[name] = new Driver();
                driversArr[name].init(
                  new DriverSettings(name),
                  interfaces[driversArr[name].getInterface()],
                  models[driversArr[name].getType()].DeviceEventEmitter
                ).then(() =>
                  // get a list of devices for this particular driver
                   models.device.Model.find({
                       type: driversArr[name].getType(),
                       driver: name
                   }).exec((err, devices) => {
                       if (err) {
                           throw new Error(err);
                       }
                       driversArr[name].initDevices(devices);
                   })).catch((err) => {
                       console.error(err); // eslint-disable-line no-console
                   });
            }
        });
        return driversArr;
    }
};

module.exports = utils;
