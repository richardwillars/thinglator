var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('socketApi', () => {
	var moduleToBeTested, httpServer, drivers;
	var paths = {};
	var authenticateCtrlMock, deviceCtrlMock, driverCtrlMock, eventCtrlMock;

	beforeEach(function(done) {

		//mock out httpServer
		httpServer = {};

		//mock out drivers
		drivers = {};

		//mock out authenticateCtrl, deviceCtrl, eventCtrl, driverCtrl
		var socketMock = {
			on: function(eventName, fn) {
				paths[eventName] = fn;
			}
		}
		var ioMock = function() {
			return {
				//capture the on handler function
				on: function(eventName, cb) {
					cb(socketMock);
				}
			};
		};

		authenticateCtrlMock = {
			getAuthenticationProcess: function(driver, type, drivers) {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			authenticationStep: function(driver, type, drivers, stepId, body) {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			foo: function() {

			}
		};
		driverCtrlMock = {
			discover: function(driver, type, drivers) {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			getDriversWithStats: function(drivers) {
				return Promise.resolve({
					"foo": "bar"
				});
			}
		};
		deviceCtrlMock = {
			getAllDevices: function() {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			getDevicesByType: function(type) {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			getDevicesByTypeAndDriver: function(type, driverId) {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			getDeviceById: function(deviceId) {
				return Promise.resolve({
					"foo": "bar"
				});
			},
			runCommand: function(deviceId, command, body, drivers) {
				return Promise.resolve({
					"foo": "bar"
				});
			}
		};
		eventCtrlMock = {
			getEventsByType: function(type, from) {
				return Promise.resolve({
					"foo": "bar"
				});
			}
		};

		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});
		mockery.registerMock('socket.io', ioMock);
		mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
		mockery.registerMock('./controllers/driver', driverCtrlMock);
		mockery.registerMock('./controllers/device', deviceCtrlMock);
		mockery.registerMock('./controllers/event', eventCtrlMock);

		done();
	});

	afterEach(function(done) {
		mockery.deregisterMock('socket.io');
		mockery.deregisterMock('./controllers/authenticate');
		mockery.deregisterMock('./controllers/driver');
		mockery.deregisterMock('./controllers/device');
		mockery.deregisterMock('./controllers/event');
		mockery.disable();
		done();
	});


	describe('errorHandler', () => {
		it('should setup an error handler', () => {
			//call the module to be tested
			moduleToBeTested = require('../../socketApi');
			expect(moduleToBeTested.errorHandler).to.be.a.function;
			//expect(cb).to.have.been.calledOnce;
		});


		it('the error listener should handle different types of errors correctly', () => {
			moduleToBeTested = require('../../socketApi');
			var error = new Error('This is an error');
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(result.type).to.equal('Internal');
			expect(result.code).to.equal(500);
			expect(result.stack).to.be.a.string

			var error = new Error('This is a driver error');
			error.type = 'Driver';
			error.driver = 'lifx';
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(JSON.stringify(result)).to.equal(JSON.stringify({
				code: 500,
				type: 'Driver',
				driver: 'lifx',
				message: 'This is a driver error'
			}));

			var error = new Error('This is a bad request error');
			error.type = 'BadRequest';
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(JSON.stringify(result)).to.equal(JSON.stringify({
				code: 400,
				type: 'BadRequest',
				message: 'This is a bad request error'
			}));

			var error = new Error('This is a not found error');
			error.type = 'NotFound';
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(JSON.stringify(result)).to.equal(JSON.stringify({
				code: 404,
				type: 'NotFound',
				message: 'This is a not found error'
			}));

			var error = new Error('This is a validation error');
			error.type = 'Validation';
			error.errors = {
				"foo": "bar"
			};
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(JSON.stringify(result)).to.equal(JSON.stringify({
				"code": 400,
				"type": "Validation",
				"message": "This is a validation error",
				"errors": {
					"foo": "bar"
				}
			}));

			var error = new Error('This is a connection error');
			error.type = 'Connection';
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(JSON.stringify(result)).to.equal(JSON.stringify({
				"code": 503,
				"type": "Connection",
				"message": "This is a connection error"
			}));

			var error = new Error('This is an authentication error');
			error.type = 'Authentication';
			var result = moduleToBeTested.errorHandler(error);
			expect(result).to.be.an.object;
			expect(JSON.stringify(result)).to.equal(JSON.stringify({
				code: 401,
				type: 'Authentication',
				message: 'This is an authentication error'
			}));

		});
	});

	describe('API calls', () => {

		describe('getAuthenticationProcess', () => {
			var getAuthenticationProcessSpy;

			it('it should setup a route', () => {
				getAuthenticationProcessSpy = sinon.spy(authenticateCtrlMock, 'getAuthenticationProcess');
				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getAuthenticationProcess']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var type = 'foo';
				var driver = 'bar';
				var callback = sinon.spy();

				paths['getAuthenticationProcess'](type, driver, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getAuthenticationProcessSpy).to.have.been.calledWith(driver, type, {});

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('authenticationStep', () => {
			var authenticationStepSpy;
			it('it should setup a route', () => {
				authenticationStepSpy = sinon.spy(authenticateCtrlMock, 'authenticationStep');
				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['authenticationStep']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var type = 'foo';
				var driver = 'bar';
				var stepId = 0;
				var body = {
					"body": "here"
				};
				var callback = sinon.spy();

				paths['authenticationStep'](type, driver, stepId, body, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(authenticationStepSpy).to.have.been.calledWith(driver, type, {}, stepId, body);

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('discoverDevices', () => {
			var discoverSpy;
			it('it should setup a route', () => {
				discoverSpy = sinon.spy(driverCtrlMock, 'discover');
				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['discoverDevices']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var type = 'foo';
				var driver = 'bar';

				var callback = sinon.spy();

				paths['discoverDevices'](type, driver, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(discoverSpy).to.have.been.calledWith(driver, type, {});

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('getDevices', () => {
			var getAllDevicesSpy;
			it('it should setup a route', () => {
				getAllDevicesSpy = sinon.spy(deviceCtrlMock, 'getAllDevices');

				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getDevices']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var callback = sinon.spy();

				paths['getDevices'](callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getAllDevicesSpy).to.have.been.calledOnce;

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('getDevicesByType', () => {
			var getDevicesByTypeSpy;

			it('it should setup a route', () => {
				getDevicesByTypeSpy = sinon.spy(deviceCtrlMock, 'getDevicesByType');
				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getDevicesByType']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var type = 'foo';
				var callback = sinon.spy();

				paths['getDevicesByType'](type, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDevicesByTypeSpy).to.have.been.calledWith(type);

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('getDevicesByTypeAndDriver', () => {
			var getDevicesByTypeAndDriverSpy;

			it('it should setup a route', () => {
				getDevicesByTypeAndDriverSpy = sinon.spy(deviceCtrlMock, 'getDevicesByTypeAndDriver');

				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getDevicesByTypeAndDriver']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var type = 'foo';
				var driver = 'bar';

				var callback = sinon.spy();

				paths['getDevicesByTypeAndDriver'](type, driver, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDevicesByTypeAndDriverSpy).to.have.been.calledWith(type, driver);

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('getDeviceById', () => {
			var getDeviceByIdSpy;
			it('it should setup a route', () => {
				getDeviceByIdSpy = sinon.spy(deviceCtrlMock, 'getDeviceById');
				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getDeviceById']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var deviceId = 'foo';
				var callback = sinon.spy();

				paths['getDeviceById'](deviceId, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDeviceByIdSpy).to.have.been.calledWith(deviceId);

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('runCommand', () => {
			var runCommandSpy;
			it('it should setup a route', () => {
				runCommandSpy = sinon.spy(deviceCtrlMock, 'runCommand');

				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['runCommand']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var deviceId = 'foo';
				var command = 'bar';
				var body = {
					"foo": "bar"
				};
				var callback = sinon.spy();

				paths['runCommand'](deviceId, command, body, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(runCommandSpy).to.have.been.calledWith(deviceId, command, body, {});

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('getDrivers', () => {
			var getDriversWithStatsSpy;
			it('it should setup a route', () => {
				getDriversWithStatsSpy = sinon.spy(driverCtrlMock, 'getDriversWithStats');

				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getDrivers']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var callback = sinon.spy();

				paths['getDrivers'](callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDriversWithStatsSpy).to.have.been.calledWith({});

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('getEventsByType', () => {
			var getEventsByTypeSpy;
			it('it should setup a route', () => {
				getEventsByTypeSpy = sinon.spy(eventCtrlMock, 'getEventsByType');

				moduleToBeTested = require('../../socketApi').socketApi(httpServer, drivers);
				expect(typeof paths['getEventsByType']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var type = 'foo';
				var from = 'bar';

				var callback = sinon.spy();

				paths['getEventsByType'](type, from, callback);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getEventsByTypeSpy).to.have.been.calledWith(type, from);

					//check that res.json is called with the response.
					expect(callback).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			xit('it should handle errors accordingly', () => {

			});
		});
	});
});