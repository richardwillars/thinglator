'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('utils/driver', () => {
	var moduleToBeTested, app, drivers;

	describe('doesDriverExist', () => {

		it('should return true if the driver exists and is of the correct type', (done) => {
			//call the module to be tested
			moduleToBeTested = require('../../../utils/driver');

			expect(moduleToBeTested.doesDriverExist).to.be.a.function;


			var driverId = 'abc';
			var type = 'light';
			var drivers = {
				def: {
					getType: function() {
						return 'foo';
					}
				},
				abc: {
					getType: function() {
						return 'light';
					}
				},
				ghi: {
					getType: function() {
						return 'foo';
					}
				}
			};

			var promise = moduleToBeTested.doesDriverExist(driverId, type, drivers);

			expect(promise).to.be.an.object;
			promise.then(function(exists) {
				expect(exists).to.equal(true);
				done();
			});
		});

		it('should return false if the driver exists but is not of the correct type', (done) => {
			//call the module to be tested
			moduleToBeTested = require('../../../utils/driver');

			expect(moduleToBeTested.doesDriverExist).to.be.a.function;


			var driverId = 'abc';
			var type = 'light';
			var drivers = {
				def: {
					getType: function() {
						return 'foo';
					}
				},
				abc: {
					getType: function() {
						return 'bar';
					}
				},
				ghi: {
					getType: function() {
						return 'foo';
					}
				}
			};

			var promise = moduleToBeTested.doesDriverExist(driverId, type, drivers);

			expect(promise).to.be.an.object;
			promise.then(function(exists) {
				expect(exists).to.equal(false);
				done();
			});
		});

		it('should return false if the driver does not exist', (done) => {
			//call the module to be tested
			moduleToBeTested = require('../../../utils/driver');

			expect(moduleToBeTested.doesDriverExist).to.be.a.function;


			var driverId = 'xyz';
			var type = 'light';
			var drivers = {
				def: {
					getType: function() {
						return 'foo';
					}
				},
				abc: {
					getType: function() {
						return 'light';
					}
				},
				ghi: {
					getType: function() {
						return 'foo';
					}
				}
			};

			var promise = moduleToBeTested.doesDriverExist(driverId, type, drivers);

			expect(promise).to.be.an.object;
			promise.then(function(exists) {
				expect(exists).to.equal(false);
				done();
			});
		});
	});

	describe('loadDrivers', () => {
		beforeEach(function(done) {
			//mock out fs
			var fsMock = {
				readdirSync: function(dirName) {
					return ['thinglator-driver-foo', 'thinglator-zoo-boo', 'something-else', 'bla.js', 'thinglator-driver-bla'];
				}
			};

			var modelsMock = {
				light: {
					DeviceEventEmitter: {}
				},

				device: {
					Model: {
						find: function(query) {
							return {
								exec: function(cb) {
									cb(null, [{
										_id: 'abc123'
									}, {
										_id: 'def234'
									}]);
								}
							};
						}
					}
				}
			};

			var driverFooMock = class FooDriver {
				constructor(driverSettingsObj, interfaces) {

				}

				getType() {
					return 'light';
				}

				setEventEmitter(eventEmitter) {

				}

				initDevices() {

				}
			};

			var driverBlaMock = class BlaDriver {
				constructor(driverSettingsObj, interfaces) {

				}

				getType() {
					return 'light';
				}

				setEventEmitter(eventEmitter) {

				}

				initDevices() {

				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});

			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('fs', fsMock);

			mockery.registerMock('thinglator-driver-foo', driverFooMock);
			mockery.registerMock('thinglator-driver-bla', driverBlaMock);
			done();
		});

		afterEach(function(done) {
			mockery.deregisterMock('fs');
			mockery.deregisterMock('thinglator-driver-bla');
			mockery.deregisterMock('thinglator-driver-foo');
			mockery.deregisterMock('../models');
			mockery.disable();
			done();
		});

		it('should load valid drivers', () => {
			//call the module to be tested
			moduleToBeTested = require('../../../utils/driver');
			expect(moduleToBeTested.loadDrivers).to.be.a.function;

			var loadedDrivers = moduleToBeTested.loadDrivers();
			expect(Object.keys(loadedDrivers).length).to.equal(2);

			expect(loadedDrivers.foo).to.be.an.object;
			expect(loadedDrivers.foo.getType()).to.equal('light');

			expect(loadedDrivers.bla).to.be.an.object;
			expect(loadedDrivers.bla.getType()).to.equal('light');
		});
	});

	describe('DriverSettings class', () => {

		afterEach(function(done) {
			mockery.deregisterMock('../models');
			mockery.disable();
			done();
		});


		it('should get the DriverSettings class', () => {
			moduleToBeTested = require('../../../utils/driver');
			expect(moduleToBeTested.getDriverSettingsClass).to.be.a.function;
			var classObj = moduleToBeTested.getDriverSettingsClass();
			expect(classObj).to.be.a.function;
		});

		it('should create a new instance of the DriverSettings class', () => {
			moduleToBeTested = require('../../../utils/driver');
			var classObj = moduleToBeTested.getDriverSettingsClass();
			var instance = new classObj('foo');
			expect(instance).to.be.an.object;
		});

		it('the get method should return the settings for the driver', (done) => {
			var modelsMock = {
				driver: {
					Model: {
						findOne: function(query) {
							return {
								exec: function() {
									return Promise.resolve({
										settings: {
											foo: 'bar',
											boo: 'zoo'
										}
									});
								}
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

			moduleToBeTested = require('../../../utils/driver');
			var classObj = moduleToBeTested.getDriverSettingsClass();
			var instance = new classObj('foo');
			var promise = instance.get();
			expect(promise).to.be.an.object;
			promise.then(function(settings) {
				expect(settings.foo).to.equal('bar');
				expect(settings.boo).to.equal('zoo');
				done();
			});
		});

		it('the get method should broadcast errors appropriately', (done) => {
			var modelsMock = {
				driver: {
					Model: {
						findOne: function(query) {
							return {
								exec: function() {
									throw new Error('example error thrown by the db');
								}
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

			moduleToBeTested = require('../../../utils/driver');
			var classObj = moduleToBeTested.getDriverSettingsClass();
			var instance = new classObj('foo');
			var promise = instance.get();
			expect(promise).to.be.an.object;
			promise.catch(function(err) {
				expect(err.message).to.equal('example error thrown by the db');
				done();
			});
		});

		it('the set method should save the settings for the driver', (done) => {
			var modelsMock = {
				driver: {
					Model: {
						update: function(query, obj, updateSettings) {
							return {
								exec: function() {
									return Promise.resolve();
								}
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

			moduleToBeTested = require('../../../utils/driver');
			var classObj = moduleToBeTested.getDriverSettingsClass();
			var instance = new classObj('foo');
			var promise = instance.set({
				foo: 'bar',
				boo: 'zoo'
			});
			expect(promise).to.be.an.object;
			promise.then(function() {
				done();
			});
		});

	});
});