var authenticateCtrl = require('./controllers/authenticate');
var deviceCtrl = require('./controllers/device');
var eventCtrl = require('./controllers/event');
var driverCtrl = require('./controllers/driver');
var eventUtils = require('./utils/event');


var errorHandler = function(err) {
	switch (err.type) {
		case 'Driver':
			console.log('Driver Error', err);
			return {
				code: 500,
				type: err.type,
				driver: err.driver,
				message: err.message
			};
		case 'BadRequest':
			return {
				code: 400,
				type: err.type,
				message: err.message
			};
		case 'NotFound':
			return {
				code: 404,
				type: err.type,
				message: err.message
			};
		case 'Validation':
			return {
				code: 400,
				type: err.type,
				message: err.message,
				errors: err.errors
			};
		case 'Connection':
			return {
				code: 503,
				type: err.type,
				message: err.message
			};
		case 'Authentication':
			return {
				code: 401,
				type: err.type,
				message: err.message
			};
		default:
			console.log('Internal Error', err);
			console.log(err.stack);
			return {
				type: 'Internal',
				code: 500,
				stack: err.stack
			};
	}
};

var socketApi = function(httpServer, drivers) {
	var io = require('socket.io')(httpServer);
	eventUtils.getEventEmitter().on('newEvent', function(event) {
		io.emit('newEvent', event);
	});
	io.on('connection', function(socket) {

		socket.on('getAuthenticationProcess', function(type, driver, cb) {
			authenticateCtrl.getAuthenticationProcess(driver, type, drivers).then(function(result) {
				cb(result);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('authenticationStep', function(type, driver, stepId, body, cb) {
			authenticateCtrl.authenticationStep(driver, type, drivers, stepId, body).then(function(result) {
				cb(result);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('discoverDevices', function(type, driver, cb) {
			driverCtrl.discover(driver, type, drivers).then(function(results) {
				cb(results);
			}).catch(function(err) {
				cb(errorHandler(err));
			})
		});

		socket.on('getDevices', function(cb) {
			deviceCtrl.getAllDevices().then(function(results) {
				cb(results);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('getDevicesByType', function(type, cb) {
			deviceCtrl.getDevicesByType(type).then(function(results) {
				cb(results);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('getDevicesByTypeAndDriver', function(type, driver, cb) {
			deviceCtrl.getDevicesByTypeAndDriver(type, driver).then(function(results) {
				cb(results);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('getDeviceById', function(deviceId, cb) {
			deviceCtrl.getDeviceById(deviceId).then(function(result) {
				cb(result);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('runCommand', function(deviceId, command, body, cb) {
			deviceCtrl.runCommand(deviceId, command, body, drivers).then(function(result) {
				cb(result);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('getDrivers', function(cb) {
			driverCtrl.getDriversWithStats(drivers).then(function(results) {
				cb(results);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});

		socket.on('getEventsByType', function(eventType, from, cb) {
			eventCtrl.getEventsByType(eventType, from).then(function(results) {
				cb(results);
			}).catch(function(err) {
				cb(errorHandler(err));
			});
		});
	});
	return io;
};

module.exports = {
	socketApi: socketApi,
	errorHandler: errorHandler
}