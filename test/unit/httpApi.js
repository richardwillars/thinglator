var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('httpApi', () => {
	var moduleToBeTested, app, drivers;

	beforeEach(function(done) {


		//mock out app
		app = {
			use: function(fn) {},
			get: function(path, cb) {},
			post: function(path, cb) {}
		};

		//mock out drivers
		drivers = {};

		done();
	});

	it('should setup an error listener', () => {
		var cb = sinon.spy();
		app.use = cb;
		//call the module to be tested
		moduleToBeTested = require('../../httpApi')(app, drivers);
		expect(cb).to.have.been.calledOnce;
	});

	it('the error listener should handle different types of errors correctly', () => {
		//capture the error handler function..
		var errorHandler;
		app.use = function(fn) {
			errorHandler = fn;
		};
		moduleToBeTested = require('../../httpApi')(app, drivers);

		//build up a fake call to the error handler function..
		var reqObject = {};
		var resObject = {}
		var next = function() {};

		var resStatusCb = sinon.spy();
		var resJsonCb = sinon.spy();

		resObject.status = sinon.spy();
		resObject.json = sinon.spy();

		var errorObject = {
			"foo": "bar"
		};
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(500);
		expect(resObject.json).to.have.been.calledWith({
			"code": 500,
			"stack": undefined,
			"type": "Internal"
		});

		var errorObject = {
			"foo": "bar"
		};
		errorObject.stack = [
			"bla", "bla", "bla"
		]
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(500);
		expect(resObject.json).to.have.been.calledWith({
			"code": 500,
			"stack": ["bla", "bla", "bla"],
			"type": "Internal"
		});

		var errorObject = new Error('This is a driver error');
		errorObject.type = 'Driver';
		errorObject.driver = 'lifx';
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(500);
		expect(resObject.json).to.have.been.calledWith({
			"code": 500,
			"type": "Driver",
			"driver": "lifx",
			"message": "This is a driver error"
		});

		var errorObject = new Error('This is a bad request');
		errorObject.type = 'BadRequest';
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(400);
		expect(resObject.json).to.have.been.calledWith({
			"code": 400,
			"type": "BadRequest",
			"message": "This is a bad request"
		});

		var errorObject = new Error('This is not found');
		errorObject.type = 'NotFound';
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(404);
		expect(resObject.json).to.have.been.calledWith({
			"code": 404,
			"type": "NotFound",
			"message": "This is not found"
		});

		var errorObject = new Error('This is validation');
		errorObject.type = 'Validation';
		errorObject.errors = {
			"foo": "bar"
		};
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(400);
		expect(resObject.json).to.have.been.calledWith({
			"code": 400,
			"type": "Validation",
			"message": "This is validation",
			"errors": {
				"foo": "bar"
			}
		});

		var errorObject = new Error('This is connection');
		errorObject.type = 'Connection';
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(503);
		expect(resObject.json).to.have.been.calledWith({
			"code": 503,
			"type": "Connection",
			"message": "This is connection"
		});

		var errorObject = new Error('This is authentication');
		errorObject.type = 'Authentication';
		errorHandler(errorObject, reqObject, resObject, next);
		expect(resObject.status).to.have.been.calledWith(401);
		expect(resObject.json).to.have.been.calledWith({
			"code": 401,
			"type": "Authentication",
			"message": "This is authentication"
		});
	});

	describe('API calls', () => {
		var paths = {};
		var authenticateCtrlMock;

		beforeEach(function(done) {
			//capture the get handler function..
			app.get = function(path, fn) {
				paths[path] = fn;
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});

			//mock out authenticateCtrl, deviceCtrl, eventCtrl, driverCtrl
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
			mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
			mockery.registerMock('./controllers/driver', driverCtrlMock);
			mockery.registerMock('./controllers/device', deviceCtrlMock);
			mockery.registerMock('./controllers/event', eventCtrlMock);

			done();
		});

		afterEach(function(done) {
			mockery.deregisterMock('./controllers/authenticate');
			mockery.deregisterMock('./controllers/driver');
			mockery.deregisterMock('./controllers/device');
			mockery.deregisterMock('./controllers/event');
			mockery.disable();
			done();
		});

		describe('GET /', () => {

			it('it should setup a route', () => {
				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/']).to.equal('function');
			});

			it('it should call the correct controller method when called', () => {
				var req = {};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/'](req, res, next);

				expect(res.json).to.have.been.calledWith({
					'Thinglator': 'Oh, hi!'
				});
			});
		});

		describe('GET /authenticate/:type/:driver', () => {
			var paths = {};
			var getAuthenticationProcessSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getAuthenticationProcessSpy = sinon.spy(authenticateCtrlMock, 'getAuthenticationProcess');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/authenticate/:type/:driver']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						type: 'foo',
						driver: 'bar'
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/authenticate/:type/:driver'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getAuthenticationProcessSpy).to.have.been.calledWith(req.params.driver, req.params.type, {});

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/authenticate');
				var err = new Error('something went wrong 1');
				authenticateCtrlMock = {
					getAuthenticationProcess: function(driver, type, drivers) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						type: 'foo',
						driver: 'bar'
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/authenticate/:type/:driver'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('POST /authenticate/:type/:driver/:stepId', () => {
			var paths = {};
			var getAuthenticationProcessSpy;
			beforeEach(function(done) {
				//capture the post handler function..
				app.post = function(path, jsonParser, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				authenticationStepSpy = sinon.spy(authenticateCtrlMock, 'authenticationStep');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/authenticate/:type/:driver/:stepId']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						type: 'foo',
						driver: 'bar',
						stepId: 0
					},
					body: {
						"body": "here"
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/authenticate/:type/:driver/:stepId'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(authenticationStepSpy).to.have.been.calledWith(req.params.driver, req.params.type, {}, req.params.stepId, req.body);

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/authenticate');
				var err = new Error('something went wrong 2');
				authenticateCtrlMock = {
					authenticationStep: function(driverId, type, drivers, stepId, body) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						type: 'foo',
						driver: 'bar',
						stepId: 0
					},
					body: {
						"body": "here"
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/authenticate/:type/:driver/:stepId'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /discover/:type/:driver', () => {
			var paths = {};
			var getAuthenticationProcessSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				discoverSpy = sinon.spy(driverCtrlMock, 'discover');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/discover/:type/:driver']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						type: 'foo',
						driver: 'bar'
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/discover/:type/:driver'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(discoverSpy).to.have.been.calledWith(req.params.driver, req.params.type, {});

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/driver');
				var err = new Error('something went wrong 3');
				driverCtrlMock = {
					discover: function(drivers) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/driver', driverCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						type: 'foo',
						driver: 'bar'
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/discover/:type/:driver'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /devices', () => {
			var paths = {};
			var getAllDevicesSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getAllDevicesSpy = sinon.spy(deviceCtrlMock, 'getAllDevices');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/devices']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/devices'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getAllDevicesSpy).to.have.been.calledOnce;

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/device');
				var err = new Error('something went wrong 4');
				deviceCtrlMock = {
					getAllDevices: function() {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/device', deviceCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {};
				var res = {};
				var next = sinon.spy();

				paths['/devices'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /devices/:type', () => {
			var paths = {};
			var getDevicesByTypeSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getDevicesByTypeSpy = sinon.spy(deviceCtrlMock, 'getDevicesByType');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/devices/:type']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						type: 'foo'
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/devices/:type'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDevicesByTypeSpy).to.have.been.calledWith(req.params.type);

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/device');
				var err = new Error('something went wrong 5');
				deviceCtrlMock = {
					getDevicesByType: function(type) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/device', deviceCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						type: 'foo'
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/devices/:type'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /devices/:type/:driver', () => {
			var paths = {};
			var getDevicesByTypeAndDriverSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getDevicesByTypeAndDriverSpy = sinon.spy(deviceCtrlMock, 'getDevicesByTypeAndDriver');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/devices/:type/:driver']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						type: 'foo',
						driver: 'bar'
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/devices/:type/:driver'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDevicesByTypeAndDriverSpy).to.have.been.calledWith(req.params.type, req.params.driver);

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/device');
				var err = new Error('something went wrong 6');
				deviceCtrlMock = {
					getDevicesByTypeAndDriver: function(type, driverId) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/device', deviceCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						type: 'foo',
						driver: 'bar'
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/devices/:type/:driver'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /device/:deviceId', () => {
			var paths = {};
			var getDeviceByIdSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getDeviceByIdSpy = sinon.spy(deviceCtrlMock, 'getDeviceById');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/device/:deviceId']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						deviceId: 'foo'
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/device/:deviceId'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDeviceByIdSpy).to.have.been.calledWith(req.params.deviceId);

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/device');
				var err = new Error('something went wrong 7');
				deviceCtrlMock = {
					getDeviceById: function(driverId) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/device', deviceCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						deviceId: 'foo'
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/device/:deviceId'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('POST /device/:deviceId/:command', () => {
			var paths = {};
			var runCommandSpy;
			beforeEach(function(done) {
				//capture the post handler function..
				app.post = function(path, jsonParser, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				runCommandSpy = sinon.spy(deviceCtrlMock, 'runCommand');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/device/:deviceId/:command']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						deviceId: 'foo',
						command: 'bar'
					},
					body: {
						"foo": "bar"
					}
				};
				var res = {
					send: sinon.spy()
				};
				var next = function() {};

				paths['/device/:deviceId/:command'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(runCommandSpy).to.have.been.calledWith(req.params.deviceId, req.params.command, req.body, {});

					//check that res.send is called with the response.
					expect(res.send).to.have.been.calledOnce;

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/device');
				var err = new Error('something went wrong 8');
				deviceCtrlMock = {
					runCommand: function(deviceId, command, body, drivers) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/device', deviceCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						deviceId: 'foo',
						command: 'bar'
					},
					body: {
						"foo": "bar"
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/device/:deviceId/:command'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /drivers', () => {
			var paths = {};
			var getDriversWithStatsSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getDriversWithStatsSpy = sinon.spy(driverCtrlMock, 'getDriversWithStats');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/drivers']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/drivers'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getDriversWithStatsSpy).to.have.been.calledWith({});

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/driver');
				var err = new Error('something went wrong 9');
				driverCtrlMock = {
					getDriversWithStats: function(deviceId, command, body, drivers) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/driver', driverCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {};
				var res = {};
				var next = sinon.spy();

				paths['/drivers'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});

		describe('GET /event/:eventType', () => {
			var paths = {};
			var getEventsByTypeSpy;
			beforeEach(function(done) {
				//capture the get handler function..
				app.get = function(path, fn) {
					paths[path] = fn;
				};
				done();
			});
			it('it should setup a route', () => {
				getEventsByTypeSpy = sinon.spy(eventCtrlMock, 'getEventsByType');

				moduleToBeTested = require('../../httpApi')(app, drivers);
				expect(typeof paths['/event/:eventType']).to.equal('function');
			});

			it('it should call the correct controller method when called', (done) => {
				var req = {
					params: {
						type: 'foo'
					},
					query: {
						from: 'bar'
					}
				};
				var res = {
					json: sinon.spy()
				};
				var next = function() {};

				paths['/event/:eventType'](req, res, next);


				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that the controller method is called
					expect(getEventsByTypeSpy).to.have.been.calledWith(req.params.eventType, req.query.from);

					//check that res.json is called with the response.
					expect(res.json).to.have.been.calledWith({
						"foo": "bar"
					});

					done();
				}, 0);
			});

			it('it should handle errors accordingly', (done) => {
				mockery.deregisterMock('./controllers/event');
				var err = new Error('something went wrong 10');
				eventCtrlMock = {
					getEventsByType: function(eventType, from) {
						return Promise.reject(err);
					}
				};
				mockery.registerMock('./controllers/event', eventCtrlMock);

				moduleToBeTested = require('../../httpApi')(app, drivers);

				var req = {
					params: {
						type: 'foo'
					},
					query: {
						from: 'bar'
					}
				};
				var res = {};
				var next = sinon.spy();

				paths['/event/:eventType'](req, res, next);

				//We put it in a timeout to ensure the promise executes first
				setTimeout(function() {
					//check that next is called with the error
					expect(next).to.have.been.calledWith(err);
					done();
				}, 0);
			});
		});
	});
});