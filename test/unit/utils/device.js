var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('utils/device', () => {
	var moduleToBeTested, app, drivers;
	var modelsMock;


	afterEach(function(done) {
		mockery.deregisterMock('../models');
		mockery.disable();
		done();
	});

	describe('createDevice', () => {

		it('should create a new device', (done) => {
			modelsMock = {
				light: {
					Model: function(deviceSpecs) {
						deviceSpecs.validate = function() {
							return Promise.resolve();
						};
						return deviceSpecs;
					}
				},

				device: {
					Model: function(props) {
						return {
							save: function() {
								return Promise.resolve(props);
							}
						}
					}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});

			mockery.registerMock('../models', modelsMock);

			//call the module to be tested
			moduleToBeTested = require('../../../utils/device');


			var type = 'light';
			var driver = 'foo';
			var deviceSpecs = {
				foo: 'bar',
				bee: 'boo'
			};
			var promise = moduleToBeTested.createDevice(type, driver, deviceSpecs);
			expect(promise).to.be.an.object;

			promise.then(function(result) {
				expect(result._id).to.equal('8dcc4387d8e0de6cf7ce74a278ce24c0');
				expect(result.type).to.equal('light');
				expect(result.driver).to.equal('foo');
				expect(result.specs.foo).to.equal('bar');
				expect(result.specs.bee).to.equal('boo');
				done();
			});

		});

		it('should have error validation', (done) => {
			modelsMock = {
				light: {
					Model: function(deviceSpecs) {
						deviceSpecs.validate = function() {
							return Promise.reject('errrrooorrr');
						};
						return deviceSpecs;
					}
				},

				device: {
					Model: function(props) {
						return {
							save: function() {
								return Promise.resolve(props);
							}
						}
					}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});

			mockery.registerMock('../models', modelsMock);

			//call the module to be tested
			moduleToBeTested = require('../../../utils/device');


			var type = 'light';
			var driver = 'foo';
			var deviceSpecs = {
				foo: 'bar',
				bee: 'boo'
			};
			var promise = moduleToBeTested.createDevice(type, driver, deviceSpecs);
			expect(promise).to.be.an.object;

			promise.catch(function(err) {
				expect(err).to.equal('errrrooorrr');
				done();
			});
		});
	});

	describe('updateDevice', () => {
		it('should update an existing device', (done) => {
			modelsMock = {
				light: {
					Model: function(deviceSpecs) {
						deviceSpecs.validate = function() {
							return Promise.resolve();
						};
						return deviceSpecs;
					}
				},

				device: {
					Model: function(props) {
						return {
							save: function() {
								return Promise.resolve(props);
							}
						}
					}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});

			mockery.registerMock('../models', modelsMock);

			//call the module to be tested
			moduleToBeTested = require('../../../utils/device');

			var device = {
				type: 'light',
				driver: 'foo',
				specs: {
					foo: 'bar',
					bee: 'boo'
				},
				save: function() {
					return Promise.resolve(this);
				}
			};

			var newSpecs = {
				foo: 'bar',
				bee: 'boo2'
			};

			var promise = moduleToBeTested.updateDevice(device, newSpecs);
			expect(promise).to.be.an.object;

			promise.then(function(result) {
				expect(result.type).to.equal('light');
				expect(result.driver).to.equal('foo');
				expect(result.specs.foo).to.equal('bar');
				expect(result.specs.bee).to.equal('boo2');
				done();
			});
		});

		it('should have error validation', (done) => {
			modelsMock = null;
			modelsMock = {
				light: {
					Model: function(deviceSpecs) {
						deviceSpecs.validate = function() {
							return Promise.reject('errrrooorrr');
						};
						return deviceSpecs;
					}
				},

				device: {
					Model: function(props) {
						return {
							save: function() {
								return Promise.resolve(props);
							}
						}
					}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});

			mockery.registerMock('../models', modelsMock);

			//call the module to be tested
			moduleToBeTested = require('../../../utils/device');

			var device = {
				type: 'light',
				driver: 'foo',
				specs: {
					foo: 'bar',
					bee: 'boo'
				},
				save: function() {
					return Promise.resolve(this);
				}
			};

			var newSpecs = {
				foo: 'bar',
				bee: 'boo2'
			};

			var promise = moduleToBeTested.updateDevice(device, newSpecs);
			expect(promise).to.be.an.object;

			promise.catch(function(err) {
				expect(err).to.equal('errrrooorrr');
				done();
			});
		});
	});

});