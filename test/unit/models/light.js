'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('models/light', () => {
	var moduleToBeTested;
	var lightConstructorSpy;
	var modelSpy = sinon.spy();
	var eventEmitterConstructorSpy = sinon.spy();
	var eventEmitterOnSpy = sinon.spy();

	var eventCreateSpy;
	var eventSaveSpy;

	beforeEach((done) => {
		lightConstructorSpy = sinon.spy();
		eventCreateSpy = sinon.spy();
		eventSaveSpy = sinon.spy();

		var schemaClass = class Event {
			constructor(props) {
				lightConstructorSpy(props);
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

	it('should create a mongoose schema representing a light', () => {
		//call the module to be tested

		moduleToBeTested = require('../../../models/light');
		expect(lightConstructorSpy).to.have.been.calledOnce;
		expect(lightConstructorSpy).to.have.been.calledWith({
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
				toggle: {
					type: Boolean,
					default: false,
					eventName: 'state',
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"toggled": {
								"type": "boolean"
							}
						},
						"required": [
							"toggled"
						]
					}
				},
				setHSBState: {
					type: Boolean,
					default: false,
					eventName: 'state',
					requestSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"on": {
								"type": "boolean"
							},
							"colour": {
								"type": "object",
								"properties": {
									"hue": {
										"type": "integer",
										"minimum": 0,
										"maxiumum": 360
									},
									"saturation": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									},
									"brightness": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									}
								},
								"required": [
									"hue",
									"saturation",
									"brightness"
								]
							},

							"duration": {
								"duration": "integer",
								"minimum": 0,
								"maxiumum": 99999
							}
						},
						"required": [
							"colour",
							"duration",
							"on"
						]
					},
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"processed": {
								"type": "boolean"
							}
						},
						"required": [
							"processed"
						]
					}

				},
				setBrightnessState: {
					type: Boolean,
					default: false,
					eventName: 'state',
					requestSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"on": {
								"type": "boolean"
							},
							"colour": {
								"type": "object",
								"properties": {
									"brightness": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									}
								},
								"required": [
									"brightness"
								]
							},

							"duration": {
								"duration": "integer",
								"minimum": 0,
								"maxiumum": 99999
							}
						},
						"required": [
							"colour",
							"duration",
							"on"
						]
					},
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"processed": {
								"type": "boolean"
							}
						},
						"required": [
							"processed"
						]
					}

				},
				setBooleanState: {
					type: Boolean,
					default: false,
					eventName: 'state',
					requestSchema: {
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
					},
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"processed": {
								"type": "boolean"
							}
						},
						"required": [
							"processed"
						]
					}

				},
				breatheEffect: {
					type: Boolean,
					default: false,
					eventName: 'breatheEffect',
					requestSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"colour": {
								"type": "object",
								"properties": {
									"hue": {
										"type": "integer",
										"minimum": 0,
										"maxiumum": 360
									},
									"saturation": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									},
									"brightness": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									}
								},
								"required": [
									"hue",
									"saturation",
									"brightness"
								]
							},
							"fromColour": {
								"type": "object",
								"properties": {
									"hue": {
										"type": "integer",
										"minimum": 0,
										"maxiumum": 360
									},
									"saturation": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									},
									"brightness": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									}
								},
								"required": [
									"hue",
									"saturation",
									"brightness"
								]
							},
							"period": {
								"type": "double",
								"minimum": 0.01,
								"maximum": 100
							},
							"cycles": {
								"duration": "double",
								"minimum": 0.01,
								"maxiumum": 99999
							},
							"persist": {
								"type": "boolean"
							},
							"peak": {
								"type": "double",
								"minimum": 0,
								"maximum": 1
							}
						},
						"required": [
							"colour",
							"period",
							"cycles",
							"persist",
							"peak"
						]

					},
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"processed": {
								"type": "boolean"
							}
						},
						"required": [
							"processed"
						]
					}
				},
				pulseEffect: {
					type: Boolean,
					default: false,
					eventName: 'pulseEffect',
					requestSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"colour": {
								"type": "object",
								"properties": {
									"hue": {
										"type": "integer",
										"minimum": 0,
										"maxiumum": 360
									},
									"saturation": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									},
									"brightness": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									}
								},
								"required": [
									"hue",
									"saturation",
									"brightness"
								]
							},
							"fromColour": {
								"type": "object",
								"properties": {
									"hue": {
										"type": "integer",
										"minimum": 0,
										"maxiumum": 360
									},
									"saturation": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									},
									"brightness": {
										"type": "double",
										"minimum": 0,
										"maximum": 1
									}
								},
								"required": [
									"hue",
									"saturation",
									"brightness"
								]
							},
							"period": {
								"type": "double",
								"minimum": 0.01,
								"maximum": 100
							},
							"cycles": {
								"duration": "double",
								"minimum": 0.01,
								"maxiumum": 99999
							},
							"persist": {
								"type": "boolean"
							}
						},
						"required": [
							"colour",
							"period",
							"cycles",
							"persist"
						]

					},
					responseSchema: {
						"$schema": "http://json-schema.org/draft-04/schema#",
						"type": "object",
						"properties": {
							"processed": {
								"type": "boolean"
							}
						},
						"required": [
							"processed"
						]
					}
				}
			}
		});

	});

	it('should create a mongoose model from the schema', () => {
		moduleToBeTested = require('../../../models/light');
		expect(modelSpy).have.been.calledOnce;
		expect(modelSpy).to.have.been.calledWith('Light');
		expect(moduleToBeTested.Model).to.be.an.object;
	});

	describe('events', () => {
		it('should setup an event listener and expose it', () => {
			moduleToBeTested = require('../../../models/light');
			expect(eventEmitterConstructorSpy).to.have.been.calledOnce;
			expect(moduleToBeTested.DeviceEventEmitter).to.be.an.object;
		});

		it('should have created 1 event listener', () => {
			moduleToBeTested = require('../../../models/light');
			expect(eventEmitterOnSpy).to.have.been.calledOnce;
		});

		describe('\'state\' event', () => {
			it('should register the event listener', () => {
				moduleToBeTested = require('../../../models/light');
				expect(eventEmitterOnSpy.firstCall).to.have.been.calledWith('state');
			});

			it('should create a new event', () => {
				moduleToBeTested = require('../../../models/light');
				var eventCallback = eventEmitterOnSpy.firstCall.args[1];
				//call the function
				eventCallback('abc123', 'def456', 'foo');
				expect(eventCreateSpy).to.have.been.calledOnce;
				expect(eventCreateSpy).to.have.been.calledWith({
					eventType: 'device',
					driverType: 'light',
					driverId: 'abc123',
					deviceId: 'def456',
					event: 'state',
					value: 'foo'
				});
			});

			it('should save the event to the database', () => {
				moduleToBeTested = require('../../../models/light');
				var eventCallback = eventEmitterOnSpy.firstCall.args[1];
				//call the function
				eventCallback('abc123', 'def456', 'foo');
				//check that the save function has been called
				expect(eventSaveSpy).to.have.been.calledOnce;
			});

			xit('should handle a failed save accordingly', () => {

			});
		});
	});
});