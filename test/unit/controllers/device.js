'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

var moduleToBeTested;

describe('controllers/device', () => {
	var modelsMock;

	afterEach((done) => {
		mockery.deregisterMock('../models');
		mockery.disable();
		done();
	});

	describe('getAllDevices', () => {
		it('should return a list of devices', () => {
			var deviceModel = {
				find: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(deviceModel, 'find', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve([{
					'foo': 'bar'
				}, {
					'foo': 'bar'
				}]);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.getAllDevices).to.be.a.function;
			return moduleToBeTested.getAllDevices()
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([{
						'foo': 'bar'
					}, {
						'foo': 'bar'
					}]));

					expect(findStub).to.have.been.calledOnce;
					expect(findStub).to.have.been.calledWith();

					expect(leanStub).to.have.been.calledOnce;

					expect(execStub).to.have.been.calledOnce;
				});


		});

		it('should catch any errors and throw them up the promise', () => {
			var deviceModel = {
				find: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(deviceModel, 'find', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var err = new Error('something went wrong');
			err.type = 'BadRequest';

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.reject(err);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');
			expect(moduleToBeTested.getAllDevices).to.be.a.function;
			return moduleToBeTested.getAllDevices().catch(function(errThrown) {
				expect(errThrown).to.equal(err);
			});
		});
	});

	describe('getDevicesByType', () => {
		it('should return a list of devices of a certain type', () => {
			var deviceModel = {
				find: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(deviceModel, 'find', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve([{
					'foo': 'bar'
				}, {
					'foo': 'bar'
				}]);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.getDevicesByType).to.be.a.function;
			return moduleToBeTested.getDevicesByType('foo')
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([{
						'foo': 'bar'
					}, {
						'foo': 'bar'
					}]));

					expect(findStub).to.have.been.calledOnce;
					expect(findStub).to.have.been.calledWith({
						type: 'foo'
					});

					expect(leanStub).to.have.been.calledOnce;

					expect(execStub).to.have.been.calledOnce;
				});


		});

		it('should catch any errors and throw them up the promise', () => {
			var deviceModel = {
				find: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(deviceModel, 'find', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var err = new Error('something went wrong');
			err.type = 'BadRequest';

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.reject(err);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');
			expect(moduleToBeTested.getDevicesByType).to.be.a.function;
			return moduleToBeTested.getDevicesByType('bar').catch(function(errThrown) {
				expect(errThrown).to.equal(err);
			});
		});
	});

	describe('getDevicesByTypeAndDriver', () => {
		it('should return a list of devices of a certain type and belong to a certain driver', () => {
			var deviceModel = {
				find: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(deviceModel, 'find', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve([{
					'foo': 'bar'
				}, {
					'foo': 'bar'
				}]);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.getDevicesByTypeAndDriver).to.be.a.function;
			return moduleToBeTested.getDevicesByTypeAndDriver('foo', 'bar')
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([{
						'foo': 'bar'
					}, {
						'foo': 'bar'
					}]));

					expect(findStub).to.have.been.calledOnce;
					expect(findStub).to.have.been.calledWith({
						type: 'foo',
						driver: 'bar'
					});

					expect(leanStub).to.have.been.calledOnce;

					expect(execStub).to.have.been.calledOnce;
				});


		});

		it('should catch any errors and throw them up the promise', () => {
			var deviceModel = {
				find: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(deviceModel, 'find', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var err = new Error('something went wrong');
			err.type = 'BadRequest';

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.reject(err);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');
			expect(moduleToBeTested.getDevicesByTypeAndDriver).to.be.a.function;
			return moduleToBeTested.getDevicesByTypeAndDriver('bar', 'foo').catch(function(errThrown) {
				expect(errThrown).to.equal(err);
			});
		});
	});

	describe('getDeviceById', () => {
		it('should return a list of devices of a certain type', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					'foo': 'bar'
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.getDeviceById).to.be.a.function;
			return moduleToBeTested.getDeviceById('foo')
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify({
						'foo': 'bar'
					}));

					expect(findOneStub).to.have.been.calledOnce;
					expect(findOneStub).to.have.been.calledWith({
						_id: 'foo'
					});

					expect(leanStub).to.have.been.calledOnce;

					expect(execStub).to.have.been.calledOnce;
				});


		});

		it('should throw a NotFound error if the device isn\'t found', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve(null); //how mongoose sends back 0 records
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');
			expect(moduleToBeTested.getDeviceById).to.be.a.function;

			return moduleToBeTested.getDeviceById('bar').catch(function(errThrown) {
				expect(errThrown.message).to.equal('device not found');
				expect(errThrown.type).to.equal('NotFound');
			});
		});

		it('should catch any errors and throw them up the promise', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var err = new Error('something went wrong');
			err.type = 'BadRequest';

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.reject(err);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			moduleToBeTested = require('../../../controllers/device');
			expect(moduleToBeTested.getDeviceById).to.be.a.function;
			return moduleToBeTested.getDeviceById('bar').catch(function(errThrown) {
				expect(errThrown).to.equal(err);
			});
		});
	});

	describe('runCommand', () => {
		it('should validate the command and then call the driver to run the command for the specified device', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					_id: 'fee',
					type: 'deviceType',
					driver: 'foo',
					specs: {
						capabilities: {
							commandTruthy: true,
							commandFalsy: false
						}
					}
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				},
				deviceType: {
					Model: {
						schema: {
							paths: {
								'capabilities.commandTruthy': {
									options: {
										requestSchema: {
											foo: 'bar'
										},
										responseSchema: {
											bar: 'foo'
										},
										eventName: 'on'
									}
								}
							}
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: []
				};
			});


			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			var drivers = {
				foo: {
					capability_commandTruthy: function() {},
					getEventEmitter: function() {},
					getName: function() {
						return 'foo';
					}
				}
			};

			var driverActionStub = sinon.stub(drivers.foo, 'capability_commandTruthy', function() {
				return {
					on: true
				};
			});

			var eventEmitterEmitStub = sinon.stub();
			var getEventEmitterActionStub = sinon.stub(drivers.foo, 'getEventEmitter', function() {
				return {
					emit: eventEmitterEmitStub
				};
			});

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.then(function(result) {
					expect(findOneStub).to.have.been.calledOnce;
					expect(findOneStub).to.have.been.calledWith({
						_id: 'foo'
					});

					expect(leanStub).to.have.been.calledOnce;

					expect(execStub).to.have.been.calledOnce;

					expect(jsonValidatorStub).to.have.been.calledTwice;
					expect(jsonValidatorStub.firstCall).to.have.been.calledWith('fee', {
						"foo": "bar"
					});

					expect(driverActionStub).to.have.been.calledOnce;
					expect(driverActionStub).to.have.been.calledWith({
						_id: 'fee',
						type: 'deviceType',
						driver: 'foo',
						specs: {
							capabilities: {
								commandTruthy: true,
								commandFalsy: false
							}
						}
					}, 'fee');

					expect(jsonValidatorStub.secondCall).to.have.been.calledWith({
						'on': true
					}, {
						"bar": "foo"
					});

					expect(getEventEmitterActionStub).to.have.been.calledOnce;
					expect(eventEmitterEmitStub).to.have.been.calledWith('on', 'foo', 'fee', {
						on: true
					})
				});


		});

		it('should continue to work even if the request schema isn\'t specified', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					_id: 'fee',
					type: 'deviceType',
					driver: 'foo',
					specs: {
						capabilities: {
							commandTruthy: true,
							commandFalsy: false
						}
					}
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				},
				deviceType: {
					Model: {
						schema: {
							paths: {
								'capabilities.commandTruthy': {
									options: {
										responseSchema: {
											bar: 'foo'
										},
										eventName: 'on'
									}
								}
							}
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: []
				};
			});


			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			var eventEmitterEmitStub = sinon.stub();

			var drivers = {
				foo: {
					capability_commandTruthy: function() {},
					getEventEmitter: function() {
						return {
							emit: eventEmitterEmitStub
						};
					},
					getName: function() {
						return 'foo';
					}
				}
			};

			var driverActionStub = sinon.stub(drivers.foo, 'capability_commandTruthy', function() {
				return {
					on: true
				};
			});

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.then(function() {
					expect(eventEmitterEmitStub).to.have.been.calledOnce;
					expect(eventEmitterEmitStub).to.have.been.calledWith('on', 'foo', 'fee', {
						on: true
					});
				});
		});


		it('should throw an error if the specified device doesn\'t exist', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve(null);
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};


			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			var drivers = {};


			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('device not found');
					expect(error.type).to.equal('NotFound');
				});

		});

		it('should throw an error if the specified capability doesn\'t exist', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					type: 'deviceType',
					driver: 'foo',
					specs: {
						capabilities: {
							commandTruthy: true,
							commandFalsy: false
						}
					}
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};


			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			var drivers = {};


			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandNotExist', 'fee', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('capability not found');
					expect(error.type).to.equal('BadRequest');
				});

		});

		it('should throw an error if the specified capability isn\'t supported', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					type: 'deviceType',
					driver: 'foo',
					specs: {
						capabilities: {
							commandTruthy: true,
							commandFalsy: false
						}
					}
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				}
			};


			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);

			var drivers = {};


			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandFalsy', 'fee', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('capability not supported');
					expect(error.type).to.equal('BadRequest');
				});

		});

		it('should should throw an error if the request body doesn\'t match the schema', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					type: 'deviceType',
					driver: 'foo',
					specs: {
						capabilities: {
							commandTruthy: true,
							commandFalsy: false
						}
					}
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				},
				deviceType: {
					Model: {
						schema: {
							paths: {
								'capabilities.commandTruthy': {
									options: {
										requestSchema: {
											foo: 'bar'
										},
										responseSchema: {
											bar: 'foo'
										}
									}
								}
							}
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: [{
						property: 'instance',
						message: 'is not of a type(s) string',
						schema: [Object],
						instance: 4,
						name: 'type',
						argument: [Object],
						stack: 'instance is not of a type(s) string'
					}]
				};
			});

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			var drivers = {};

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('the supplied json is invalid');
					expect(error.type).to.equal('Validation');
					expect(error.errors[0].message).to.equal('is not of a type(s) string');
				});
		});


		it('should should throw an error if the response body doesn\'t match the schema', () => {
			var deviceModel = {
				findOne: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findOneStub = sinon.stub(deviceModel, 'findOne', function() {
				return deviceModel;
			});

			var leanStub = sinon.stub(deviceModel, 'lean', function() {
				return deviceModel;
			});

			var execStub = sinon.stub(deviceModel, 'exec', function() {
				return Promise.resolve({
					type: 'deviceType',
					driver: 'foo',
					specs: {
						capabilities: {
							commandTruthy: true,
							commandFalsy: false
						}
					}
				});
			});

			modelsMock = {
				device: {
					Model: deviceModel
				},
				deviceType: {
					Model: {
						schema: {
							paths: {
								'capabilities.commandTruthy': {
									options: {
										requestSchema: {
											foo: 'bar'
										},
										responseSchema: {
											bar: 'foo'
										}
									}
								}
							}
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate');
			jsonValidatorStub.onFirstCall().returns(function() {
				return {
					errors: []
				};
			}());

			jsonValidatorStub.onSecondCall().returns(function() {
				return {
					errors: [{
						property: 'instance',
						message: 'is not of a type(s) string',
						schema: [Object],
						instance: 4,
						name: 'type',
						argument: [Object],
						stack: 'instance is not of a type(s) string'
					}]
				};
			}());

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			var drivers = {
				foo: {
					capability_commandTruthy: function() {
						return {
							processed: true
						}
					}
				}
			};

			moduleToBeTested = require('../../../controllers/device');

			expect(moduleToBeTested.runCommand).to.be.a.function;
			return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('the driver produced invalid json');
					expect(error.type).to.equal('Validation');
					expect(error.errors[0].message).to.equal('is not of a type(s) string');
				});
		});
	});
});