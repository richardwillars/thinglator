

const chai = require('chai');

const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const mockery = require('mockery');

describe('models/light', () => {
  let moduleToBeTested;
  let lightConstructorSpy;
  const modelSpy = sinon.spy();
  const eventEmitterConstructorSpy = sinon.spy();
  const eventEmitterOnSpy = sinon.spy();

  let eventCreateSpy;
  let eventSaveSpy;

  beforeEach((done) => {
    lightConstructorSpy = sinon.spy();
    eventCreateSpy = sinon.spy();
    eventSaveSpy = sinon.spy();

    const schemaClass = class Event {
      constructor(props) {
        lightConstructorSpy(props);
      }
    };

    const mongooseMock = {
      Schema: schemaClass,
      model: (schemaId, schema) => {
        modelSpy(schemaId, schema);
        return schema;
      },
    };

    const eventEmitterMock = {
      EventEmitter2: class EventEmitterMock {
        constructor() {
          eventEmitterConstructorSpy();
        }

        on(event, callback) {
          eventEmitterOnSpy(event, callback);
        }
      },
    };

    const eventMock = {
      Model: (props) => {
        eventCreateSpy(props);
        return {
          save: () => {
            eventSaveSpy();
            return Promise.resolve();
          },
        };
      },
    };

    const eventUtilsMock = {
      eventValidator: () => true,
    };


    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
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
    mockery.deregisterMock('./event');
    mockery.deregisterMock('../utils/event');
    done();
  });

  it('should create a mongoose schema representing a light', () => {
    // call the module to be tested

    moduleToBeTested = require('../../models/light');
    expect(lightConstructorSpy).to.have.been.calledOnce;
    expect(lightConstructorSpy).to.have.been.calledWith({
      _id: false,
      name: {
        type: String,
        required: true,
      },
      deviceId: {
        type: String,
        required: true,
      },
      additionalInfo: {
        type: Object,
        required: false,
        default: {},
      },
      commands: {
        toggle: {
          type: Boolean,
        },
        setHSBState: {
          type: Boolean,
          requestSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              colour: {
                type: 'object',
                properties: {
                  hue: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 360,
                  },
                  saturation: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                  brightness: {
                    type: 'double',
                    minimum: 0.01,
                    maximum: 1,
                  },
                },
                required: [
                  'hue',
                  'saturation',
                  'brightness',
                ],
              },

              duration: {
                type: 'integer',
                minimum: 0,
                maxiumum: 99999,
              },
            },
            required: [
              'colour',
              'duration',
            ],
          },
        },
        setBrightnessState: {
          type: Boolean,
          requestSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              colour: {
                type: 'object',
                properties: {
                  brightness: {
                    type: 'double',
                    minimum: 0.01,
                    maximum: 1,
                  },
                },
                required: [
                  'brightness',
                ],
              },
              duration: {
                type: 'integer',
                minimum: 0,
                maxiumum: 99999,
              },
            },
            required: [
              'colour',
              'duration',
            ],
          },
        },
        setBooleanState: {
          type: Boolean,
          requestSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              on: {
                type: 'boolean',
              },
              duration: {
                type: 'integer',
                minimum: 0,
                maxiumum: 99999,
              },
            },
            required: [
              'on',
              'duration',
            ],
          },

        },
        breatheEffect: {
          type: Boolean,
          requestSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              colour: {
                type: 'object',
                properties: {
                  hue: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 360,
                  },
                  saturation: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                  brightness: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                },
                required: [
                  'hue',
                  'saturation',
                  'brightness',
                ],
              },
              fromColour: {
                type: 'object',
                properties: {
                  hue: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 360,
                  },
                  saturation: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                  brightness: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                },
                required: [
                  'hue',
                  'saturation',
                  'brightness',
                ],
              },
              period: {
                type: 'double',
                minimum: 0.01,
                maximum: 100,
              },
              cycles: {
                duration: 'double',
                minimum: 0.01,
                maxiumum: 99999,
              },
              persist: {
                type: 'boolean',
              },
              peak: {
                type: 'double',
                minimum: 0,
                maximum: 1,
              },
            },
            required: [
              'colour',
              'period',
              'cycles',
              'persist',
              'peak',
            ],

          },
        },
        pulseEffect: {
          type: Boolean,
          requestSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              colour: {
                type: 'object',
                properties: {
                  hue: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 360,
                  },
                  saturation: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                  brightness: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                },
                required: [
                  'hue',
                  'saturation',
                  'brightness',
                ],
              },
              fromColour: {
                type: 'object',
                properties: {
                  hue: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 360,
                  },
                  saturation: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                  brightness: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                },
                required: [
                  'hue',
                  'saturation',
                  'brightness',
                ],
              },
              period: {
                type: 'double',
                minimum: 0.01,
                maximum: 100,
              },
              cycles: {
                duration: 'double',
                minimum: 0.01,
                maxiumum: 99999,
              },
              persist: {
                type: 'boolean',
              },
            },
            required: [
              'colour',
              'period',
              'cycles',
              'persist',
            ],

          },
        },
      },
      events: {
        breatheEffect: {
          type: Boolean,
          responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              breatheEffect: {
                type: 'boolean',
              },
            },
            required: [
              'breatheEffect',
            ],
          },
        },
        pulseEffect: {
          type: Boolean,
          responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              pulseEffect: {
                type: 'boolean',
              },
            },
            required: [
              'pulseEffect',
            ],
          },
        },
        state: {
          type: Boolean,
          responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
              on: {
                type: 'boolean',
              },
              colour: {
                type: 'object',
                properties: {
                  hue: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 360,
                  },
                  saturation: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                  brightness: {
                    type: 'double',
                    minimum: 0,
                    maximum: 1,
                  },
                },
              },
            },
            required: [
              'colour',
              'on',
            ],
          },
        },
      },
    });
  });

  it('should create a mongoose model from the schema', () => {
    moduleToBeTested = require('../../models/light');
    expect(modelSpy).have.been.calledOnce;
    expect(modelSpy).to.have.been.calledWith('Light');
    expect(moduleToBeTested.Model).to.be.an.object;
  });

  describe('events', () => {
    it('should setup an event listener and expose it', () => {
      moduleToBeTested = require('../../models/light');
      expect(eventEmitterConstructorSpy).to.have.been.calledOnce;
      expect(moduleToBeTested.DeviceEventEmitter).to.be.an.object;
    });

    it('should have created 3 event listeners', () => {
      moduleToBeTested = require('../../models/light');
      expect(eventEmitterOnSpy).to.have.been.calledThrice;
    });

    describe('\'state\' event', () => {
      it('should register the event listener', () => {
        moduleToBeTested = require('../../models/light');
        expect(eventEmitterOnSpy.firstCall).to.have.been.calledWith('state');
      });
    });

    describe('\'pulseEffect\' event', () => {
      it('should register the event listener', () => {
        moduleToBeTested = require('../../models/light');
        expect(eventEmitterOnSpy.secondCall).to.have.been.calledWith('pulseEffect');
      });
    });

    describe('\'breatheEffect\' event', () => {
      it('should register the event listener', () => {
        moduleToBeTested = require('../../models/light');
        expect(eventEmitterOnSpy.thirdCall).to.have.been.calledWith('breatheEffect');
      });
    });
  });
});
