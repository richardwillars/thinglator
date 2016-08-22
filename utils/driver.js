'use strict';

var fs = require('fs');

class DriverSettings {
	constructor(driverId) {
		this.driverId = driverId;
	}

	get() {
		var self = this;
		return new Promise(function(resolve, reject) {
			models['driver'].Model.findOne({
				_id: self.driverId
			}).exec().then(function(result) {
				resolve(result.settings);
			}).catch(function(e) {
				reject(e);
			});
		})

	}

	set(settings) {
		return models['driver'].Model.update({
			_id: this.driverId
		}, {
			settings: settings
		}, {
			upsert: true,
			setDefaultsOnInsert: true
		}).exec();
	}
};

var utils = {
	doesDriverExist: function(driverId, type, drivers) {
		return new Promise(function(resolve, reject) {
			if (!drivers[driverId]) {
				return resolve(false);
			}
			if (drivers[driverId].getType() !== type) {
				return resolve(false);
			}
			resolve(true);
		});
	},
	loadDrivers: function() {
		var driversArr = [];
		fs.readdirSync('./node_modules').forEach(function(file) {
			if (file.match(/homebox-driver-/) !== null) {
				var name = file.replace('homebox-driver-', '');
				var Driver = require('homebox-driver-' + name);

				var interfaces = {
					http: {}
				};

				driversArr[name] = new Driver(new DriverSettings(name), interfaces);
				driversArr[name].setEventEmitter(models[driversArr[name].getType()].DeviceEventEmitter);

				//get a list of devices for this particular driver
				models['device'].Model.find({
					type: driversArr[name].getType(),
					driver: name
				}).exec(function(err, devices) {
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