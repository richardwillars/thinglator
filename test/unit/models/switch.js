'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('models/switch', () => {
	var moduleToBeTested;
	var switchConstructorSpy;
	var modelSpy = sinon.spy();
	var eventEmitterConstructorSpy = sinon.spy();
	var eventEmitterOnSpy = sinon.spy();

	var eventCreateSpy;
	var eventSaveSpy;

	beforeEach((done) => {
		switchConstructorSpy = sinon.spy();
		eventCreateSpy = sinon.spy();
		eventSaveSpy = sinon.spy();

		var schemaClass = class Event {
			constructor(props) {
				switchConstructorSpy(props);
			}
		};

		var mongooseMock = {
			Schema: schemaClass,
			model: (schemaId, schema) => {
				modelSpy(schemaId, schema);
				return schema;
			}
		};

		var eventEmitterMock = {
			EventEmitter2: class EventEmitterMock {
				constructor() {
					eventEmitterConstructorSpy();
				}

				on(event, callback) {
					eventEmitterOnSpy(event, callback);
				}
			}
		};

		var eventMock = {
			Model: (props) => {
				eventCreateSpy(props);
				return {
					save: () => {
						eventSaveSpy();
						return Promise.resolve();
					}
				}
			}
		};



		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});

		mockery.registerMock('mongoose', mongooseMock);
		mockery.registerMock('eventemitter2', eventEmitterMock);
		mockery.registerMock('./event', eventMock);
		done();
	});

	afterEach(function(done) {
		mockery.deregisterMock('mongoose');
		mockery.deregisterMock('eventemitter2');
		mockery.deregisterMock('./event');
		done();
	});

	it('should create a mongoose schema representing a switch', () => {
		//call the module to be tested

		moduleToBeTested = require('../../../models/switch');
		expect(switchConstructorSpy).to.have.been.calledOnce;
		expect(switchConstructorSpy).to.have.been.calledWith({
			_id: false,
			name: {
				type: String,
				required: true
			},
			deviceId: {
				type: String,
				required: true
			},
			additionalInfo: {
				type: Object,
				required: false,
				default: {}
			},
			capabilities: {

				on: {
					type: Boolean,
					default: false,
					eventName: 'on',
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"on": {
								"type": "boolean"
							}
						},
						"required": [
							"on"
						]
					}
				},

				off: {
					type: Boolean,
					default: false,
					eventName: 'on',
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"on": {
								"type": "boolean"
							}
						},
						"required": [
							"on"
						]
					}
				}
			}
		});

	});

	it('should create a mongoose model from the schema', () => {
		moduleToBeTested = require('../../../models/switch');
		expect(modelSpy).have.been.calledOnce;
		expect(modelSpy).to.have.been.calledWith('Switch');
		expect(moduleToBeTested.Model).to.be.an.object;
	});

	describe('events', () => {
		it('should setup an event listener and expose it', () => {
			moduleToBeTested = require('../../../models/switch');
			expect(eventEmitterConstructorSpy).to.have.been.calledOnce;
			expect(moduleToBeTested.DeviceEventEmitter).to.be.an.object;
		});

		it('should have created 1 event listener', () => {
			moduleToBeTested = require('../../../models/switch');
			expect(eventEmitterOnSpy).to.have.been.callCount(1);
		});

		describe('\'on\' event', () => {
			it('should register the event listener', () => {
				moduleToBeTested = require('../../../models/switch');
				expect(eventEmitterOnSpy.args[0][0]).to.equal('on');
			});

			it('should create a new event', () => {
				moduleToBeTested = require('../../../models/switch');
				var eventCallback = eventEmitterOnSpy.args[0][1];
				//call the function
				eventCallback('abc123', 'def456', {
					on: true
				});
				expect(eventCreateSpy).to.have.been.calledOnce;
				expect(eventCreateSpy).to.have.been.calledWith({
					eventType: 'device',
					driverType: 'switch',
					driverId: 'abc123',
					deviceId: 'def456',
					event: 'on',
					value: true
				});
			});

			it('should save the event to the database', () => {
				moduleToBeTested = require('../../../models/switch');
				var eventCallback = eventEmitterOnSpy.args[0][1];

				//call the function
				eventCallback('abc123', 'def456', {
					on: true
				});
				//check that the save function has been called
				expect(eventSaveSpy).to.have.been.calledOnce;
			});

			xit('should handle a failed save accordingly', () => {

			});
		});
	});
});