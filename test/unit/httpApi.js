var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('httpApi', () => {
	var moduleToBeTested, app, drivers;

	beforeEach(function(done) {
		//mock out authenticateCtrl, deviceCtrl, eventCtrl, driverCtrl

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

			authenticateCtrlMock = {
				getAuthenticationProcess: function(driver, type, drivers) {
					return Promise.resolve({
						"foo": "bar"
					});
				}
			};
			mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);

			done();
		});
		afterEach(function(done) {
			mockery.deregisterMock('./controllers/authenticate');
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
					'Homebox': 'Oh, hi!'
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

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('POST /authenticate/:type/:driver/:stepId', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /discover/:type/:driver', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /devices', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /devices/:type', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /devices/:type/:driver', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /device/:deviceId', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('POST /device/:deviceId/:command', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /drivers', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});

		describe('GET /event/:eventType', () => {
			xit('it should setup a route', () => {

			});

			xit('it should call the correct controller method when called', () => {

			});

			xit('it should handle errors accordingly', () => {

			});
		});
	});
});