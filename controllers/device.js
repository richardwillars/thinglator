var models = require('../models');
var Validator = require('jsonschema').Validator;
var jsonValidator = new Validator();

var controller = {
	getAllDevices: function() {
		return models['device'].Model.find().lean().exec()
			.then(function(devices) {
				return devices;
			});
	},
	getDevicesByType: function(type) {
		return models['device'].Model.find({
				type: type
			}).lean().exec()
			.then(function(devices) {
				return devices;
			});
	},
	getDevicesByTypeAndDriver: function(type, driverId) {
		return models['device'].Model.find({
				type: type,
				driver: driverId
			}).lean().exec()
			.then(function(devices) {
				return devices;
			});
	},
	getDeviceById: function(deviceId) {
		return models['device'].Model.findOne({
				_id: deviceId
			}).lean().exec()
			.then(function(device) {
				if (!device) {
					var e = new Error('device not found');
					e.type = 'NotFound';
					throw e;
				}
				return device;
			});
	},
	runCommand: function(deviceId, command, body, drivers) {
		var device;
		var driverObj;
		return models['device'].Model.findOne({
				_id: deviceId
			}).lean().exec()
			.then(function(deviceObj) {
				device = deviceObj;
				if (!deviceObj) {
					var e = new Error('device not found');
					e.type = 'NotFound';
					throw e;
				}
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
				driverObj = drivers[deviceObj.driver];
			})
			.then(function() {
				var fnName = 'capability_' + command;

				//if a schema is specified, confirm that the request body matches it
				var jsonSchema = models[device.type].Model.schema.paths['capabilities.' + command].options.requestSchema;
				if (jsonSchema) {
					var validated = jsonValidator.validate(body, jsonSchema);
					if (validated.errors.length !== 0) {
						var e = new Error('the supplied json is invalid');
						e.type = 'Validation';
						e.errors = validated.errors;
						throw e;
					}
				}
				return driverObj[fnName](device, body);
			})
			.then(function(commandResult) {
				//confirm that the action response matches the schema
				var jsonSchema = models[device.type].Model.schema.paths['capabilities.' + command].options.responseSchema;
				var validated = jsonValidator.validate(commandResult, jsonSchema);
				if (validated.errors.length !== 0) {
					var e = new Error('the driver produced invalid json');
					e.type = 'Validation';
					e.errors = validated.errors;
					throw e;
				}

				var ee = driverObj.getEventEmitter();
				var eventName = models[device.type].Model.schema.paths['capabilities.' + command].options.eventName;
				ee.emit(eventName, driverObj.getName(), device._id, commandResult);

				return;
			});
	}
};

module.exports = controller;