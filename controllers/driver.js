var _ = require('underscore');
var models = require('../models');
var md5 = require('md5');
var driverUtils = require('../utils/driver');
var deviceUtils = require('../utils/device');

var controller = {
	getDriversWithStats: function(drivers) {
		var devicesGroupedByDrivers = [];
		return models['device'].Model.aggregate([{
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
			.then(function(results) {
				devicesGroupedByDrivers = results;
				var driversWithStats = [];
				for (var i in drivers) {
					var obj = {
						_id: drivers[i].getName(),
						type: drivers[i].getType(),
						deviceCount: 0
					};
					var foundStats = _.findWhere(devicesGroupedByDrivers, {
						_id: drivers[i].getName()
					});
					if (foundStats) {
						obj.deviceCount = foundStats.deviceCount;
					}
					driversWithStats.push(obj);
				}
				return driversWithStats;
			});
	},
	discover: function(driverId, type, drivers) {
		//check that the driver exists and that it matches the specified type
		var foundDevices = [];
		var existingDevices = [];
		var finalDevices = [];

		return driverUtils.doesDriverExist(driverId, type, drivers)
			.then(function(foundDriver) {
				//if found, load it
				if (foundDriver === false) {
					var e = new Error('driver not found');
					e.type = 'NotFound';
					throw e;
				}
				return drivers[driverId];
			})
			.then(function(driver) {
				//call the discover method on the driver and wait for it to return devices
				return driver.discover();
			})
			.then(function(devices) {
				foundDevices = devices;
				//get a list of existing devices from the db
				return models['device'].Model.find({
					type: type,
					driver: driverId
				}).exec();
			})
			.then(function(existingDevicesArr) {
				existingDevices = existingDevicesArr;

				//loop through existingDevices and determine if they exist in the discovery list
				var toUpdate = [];
				_.filter(existingDevices, function(obj) {
					return _.find(foundDevices, function(obj2) {
						if (obj._id === md5(type + driverId + obj2.deviceId)) {
							toUpdate.push({
								device: obj,
								specs: obj2
							});
							return true;
						}
						return false;
					});
				});
				//if they do exist in the discovery list, update them
				var promises = [];
				for (var i in toUpdate) {
					promises.push(deviceUtils.updateDevice(toUpdate[i].device, toUpdate[i].specs));
				}
				return Promise.all(promises);
			})
			.then(function() {
				//loop through existingDevices and determine if they don't exist in the discovery list
				var noLongerExists = _.filter(existingDevices, function(obj) {
					return !_.find(foundDevices, function(obj2) {
						return obj._id === md5(type + driverId + obj2.deviceId);
					});
				});
				//if they don't exist in the discovery list, delete them
				if (noLongerExists.length === 0) {
					return;
				}
				var noLongerExistsIds = _.pluck(noLongerExists, '_id');
				return models['device'].Model.remove({
					_id: {
						$in: noLongerExistsIds
					}
				}).exec();
			})
			.then(function() {
				//loop through foundDevices and determine if they don't exist in the discovery list
				var newDevices = _.filter(foundDevices, function(obj) {
					return !_.find(existingDevices, function(obj2) {
						return obj2._id === md5(type + driverId + obj.deviceId);
					});
				});
				//if there are any other devices in discovery list, create them
				var promises = [];
				for (var i in newDevices) {
					promises.push(deviceUtils.createDevice(type, driverId, newDevices[i]));
				}
				return Promise.all(promises);
			})
			.then(function() {
				//get the entire list of devices from the db
				return models['device'].Model.find({
					type: type,
					driver: driverId
				}).exec();
			})
			.then(function(devices) {
				finalDevices = devices;
				drivers[driverId].initDevices(finalDevices);
			}).then(function() {
				return finalDevices;
			})
			.catch(function(e) {
				if (e.type) {
					if (e.type === 'Driver') {
						e.driver = driverId;
					}
				}
				throw e;
			});
	}
};

module.exports = controller;