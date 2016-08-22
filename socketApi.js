var authenticateCtrl = require('./controllers/authenticate');
var deviceCtrl = require('./controllers/device');
var eventCtrl = require('./controllers/event');
var driverCtrl = require('./controllers/driver');

module.exports = function(httpServer, drivers) {
	var io = require('socket.io')(httpServer);
	io.on('connection', function(socket) {
		socket.on('getAuthenticationProcess', function(type, driver) {
			authenticateCtrl.getAuthenticationProcess(driver, type, drivers).then(function(result) {
				socket.emit('authenticationProcess', result);
			}).catch(function(e) {
				next(e);
			});
		});

		socket.on('authenticationStep', function(type, driver, stepId, body) {
			authenticateCtrl.authenticationStep(driver, type, drivers, stepId, body).then(function(result) {
				socket.emit('authenticationStepResult', result);
			}).catch(function(e) {
				next(e);
			});
		});

		socket.on('discoverDevices', function(type, driver) {
			driverCtrl.discover(driver, type, drivers).then(function(results) {
				socket.emit('discoveredDevices', results);
			}).catch(function(err) {
				next(err);
			})
		});

		socket.on('getDevices', function() {
			deviceCtrl.getAllDevices().then(function(results) {
				socket.emit('devices', results);
			}).catch(function(err) {
				next(err);
			});
		});

		socket.on('getDevicesByType', function(type) {
			deviceCtrl.getDevicesByType(type).then(function(results) {
				socket.emit('devicesByType', results);
			}).catch(function(err) {
				next(err);
			});
		});

		socket.on('getDevicesByTypeAndDriver', function(type, driver) {
			deviceCtrl.getDevicesByTypeAndDriver(type, driver).then(function(results) {
				socket.emit('devicesByTypeAndDriver', results);
			}).catch(function(err) {
				next(err);
			});
		});

		socket.on('getDeviceById', function() {
			deviceCtrl.getDeviceById(req.params.deviceId).then(function(result) {
				socket.emit('deviceById', result);
			}).catch(function(err) {
				next(err);
			});
		});

		socket.on('runCommand', function(deviceId, command, body) {
			deviceCtrl.runCommand(deviceId, command, body, drivers, instanceId).then(function(result) {
				socket.emit('commandResult', result, instanceId);
			}).catch(function(err) {
				next(err);
			});
		});

		socket.on('getDrivers', function() {
			driverCtrl.getDriversWithStats(drivers).then(function(results) {
				socket.emit('drivers', results);
			}).catch(function(err) {
				next(err);
			});
		});

		socket.on('getEventsByType', function() {
			eventCtrl.getEventsByType(req.params.eventType, req.query.from).then(function(results) {
				socket.emit('eventsByType', results);
			}).catch(function(err) {
				next(err);
			});
		});
	});
};