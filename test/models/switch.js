

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

describe('models/switch', () => {
    let moduleToBeTested;
    let switchConstructorSpy;
    const modelSpy = sinon.spy();
    const eventEmitterConstructorSpy = sinon.spy();
    const eventEmitterOnSpy = sinon.spy();

    let eventCreateSpy;
    let eventSaveSpy;

    beforeEach((done) => {
        switchConstructorSpy = sinon.spy();
        eventCreateSpy = sinon.spy();
        eventSaveSpy = sinon.spy();

        const schemaClass = class Event {
            constructor(props) {
                switchConstructorSpy(props);
            }
		};

        const mongooseMock = {
            Schema: schemaClass,
            model: (schemaId, schema) => {
                modelSpy(schemaId, schema);
                return schema;
            }
        };

        const eventEmitterMock = {
            EventEmitter2: class EventEmitterMock {
                constructor() {
                    eventEmitterConstructorSpy();
                }

                on(event, callback) {
                    eventEmitterOnSpy(event, callback);
                }
          }
        };

        const eventMock = {
            Model: (props) => {
                eventCreateSpy(props);
                return {
                    save: () => {
                        eventSaveSpy();
                        return Promise.resolve();
                    }
                };
            }
        };

        const eventUtilsMock = {
            eventValidator: () => true
        };


        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        mockery.registerMock('mongoose', mongooseMock);
        mockery.registerMock('eventemitter2', eventEmitterMock);
        mockery.registerMock('../utils/event', eventUtilsMock);
        mockery.registerMock('./event', eventMock);
        done();
    });

    afterEach((done) => {
        mockery.deregisterMock('mongoose');
        mockery.deregisterMock('eventemitter2');
        mockery.deregisterMock('../utils/event');
        mockery.deregisterMock('./event');
        done();
    });

    it('should create a mongoose schema representing a switch', () => {
		// call the module to be tested

        moduleToBeTested = require('../../models/switch');
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
            commands: {
                on: {
                    type: Boolean
                },
                off: {
                    type: Boolean
                }
            },
            events: {
                energy: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            energy: {
                                type: 'number'
                            }
                        },
                        required: [
                            'energy'
                        ]
                    }
                },
                on: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            on: {
                                type: 'boolean'
                            }
                        },
                        required: [
                            'on'
                        ]
                    }
                }
            }
        });
    });

    it('should create a mongoose model from the schema', () => {
        moduleToBeTested = require('../../models/switch');
        expect(modelSpy).have.been.calledOnce;
        expect(modelSpy).to.have.been.calledWith('Switch');
        expect(moduleToBeTested.Model).to.be.an.object;
    });

    describe('events', () => {
        it('should setup an event listener and expose it', () => {
            moduleToBeTested = require('../../models/switch');
            expect(eventEmitterConstructorSpy).to.have.been.calledOnce;
            expect(moduleToBeTested.DeviceEventEmitter).to.be.an.object;
        });

        it('should have created 3 event listeners', () => {
            moduleToBeTested = require('../../models/switch');
            expect(eventEmitterOnSpy).to.have.been.calledThrice;
        });

        describe('\'on\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/switch');
                expect(eventEmitterOnSpy.secondCall).to.have.been.calledWith('on');
            });
        });

        describe('\'energy\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/switch');
                expect(eventEmitterOnSpy.thirdCall).to.have.been.calledWith('energy');
            });
        });

        describe('\'batteryLevel\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/switch');
                expect(eventEmitterOnSpy.firstCall).to.have.been.calledWith('batteryLevel');
            });
        });
    });
});
