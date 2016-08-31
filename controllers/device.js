var models = require('../models');
var Validator = require('jsonschema').Validator;
var jsonValidator = new Validator();

var controller = {
	getAllDevices: function() {
		return models['device'].Model.find().exec()
			.then(function(devices) {
				return devices;
			});
	},
	getDevicesByType: function(type) {
		return models['device'].Model.find({
				type: type
			}).exec()
			.then(function(devices) {
				return devices;
			});
	},
	getDevicesByTypeAndDriver: function(type, driverId) {
		return models['device'].Model.find({
				type: type,
				driver: driverId
			}).exec()
			.then(function(devices) {
				return devices;
			});
	},
	getDeviceById: function(deviceId) {
		return models['device'].Model.findOne({
				_id: deviceId
			}).exec()
			.then(function(device) {
				return device;
			});
	},
	runCommand: function(deviceId, command, body, drivers) {
		var device;
		return models['device'].Model.findOne({
				_id: deviceId
			}).exec()
			.then(function(deviceObj) {
				device = deviceObj;
				if (typeof device.specs.capabilities[command] === "undefined") {
					var e = new Error('capability not found');
					e.type = 'BadRequest';
					throw e;
				}
				if (device.specs.capabilities[command] === false) {
					var e = new Error('capability not supported');
					e.type = 'BadRequest';
					throw e;
				}
				return drivers[deviceObj.driver];
			})
			.then(function(driver) {
				var fnName = 'capability_' + command;

				//if a schema is specified, confirm that the request body matches it
				var jsonSchema = models[device.type].Model.schema.paths['capabilities.' + command].options.requestSchema;
				if (jsonSchema) {
					var validated = jsonValidator.validate(body, jsonSchema);
					if (validated.errors.length !== 0) {
						var e = new Error(validated);
						e.type = 'BadRequest';
						throw e;
					}
				}
				return driver[fnName](device, body);
			})
			.then(function(commandResult) {
				//confirm that the action response matches the schema
				var jsonSchema = models[device.type].Model.schema.paths['capabilities.' + command].options.responseSchema;
				var validated = jsonValidator.validate(commandResult, jsonSchema);
				if (validated.errors.length !== 0) {
					var e = new Error(validated);
					e.type = 'Driver';
					throw e;
				}
				return commandResult;
			});
	}
};

module.exports = controller;