

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

describe('models/speaker', () => {
    let moduleToBeTested;
    let speakerConstructorSpy;
    const modelSpy = sinon.spy();
    const eventEmitterConstructorSpy = sinon.spy();
    const eventEmitterOnSpy = sinon.spy();

    let eventCreateSpy;
    let eventSaveSpy;

    beforeEach((done) => {
        speakerConstructorSpy = sinon.spy();
        eventCreateSpy = sinon.spy();
        eventSaveSpy = sinon.spy();

        const schemaClass = class Event {
            constructor(props) {
                speakerConstructorSpy(props);
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

    it('should create a mongoose schema representing a speaker', () => {
		// call the module to be tested

        moduleToBeTested = require('../../models/speaker');
        expect(speakerConstructorSpy).to.have.been.calledOnce;
        expect(speakerConstructorSpy).to.have.been.calledWith({
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
                getCurrentTrack: {
                    type: Boolean
                },

                flushQueue: {
                    type: Boolean
                },

                getLEDState: {
                    type: Boolean
                },

                getMuted: {
                    type: Boolean
                },

                getVolume: {
                    type: Boolean
                },

                next: {
                    type: Boolean
                },

                pause: {
                    type: Boolean
                },

                play: {
                    type: Boolean
                },

                previous: {
                    type: Boolean
                },

                addToQueueBottom: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            uri: {
                                type: 'string'
                            }
                        },
                        required: [
                            'uri'
                        ]
                    }
                },

                addToQueueNext: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            uri: {
                                type: 'string'
                            }
                        },
                        required: [
                            'uri'
                        ]
                    }
                },

                seek: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            position: {
                                type: 'integer',
                                minimum: 0
                            }
                        },
                        required: [
                            'position'
                        ]
                    }
                },

                setLEDState: {
                    type: Boolean,
                    requestSchema: {
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
                },

                setMuted: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            muted: {
                                type: 'boolean'
                            }
                        },
                        required: [
                            'muted'
                        ]
                    }
                },

                setName: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            }
                        },
                        required: [
                            'name'
                        ]
                    }
                },

                setPlayMode: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            playMode: {
                                type: 'string',
                                enum: [
                                    'normal', 'repeat_all', 'shuffle', 'shuffle_norepeat'
                                ]
                            }
                        },
                        required: [
                            'playMode'
                        ]
                    }
                },

                setVolume: {
                    type: Boolean,
                    requestSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            volume: {
                                type: 'integer',
                                minimum: 0,
                                maximum: 100
                            }
                        },
                        required: [
                            'volume'
                        ]
                    }
                },

                stop: {
                    type: Boolean
                }
            },
            events: {
                currentTrack: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            artist: {
                                type: 'string'
                            },
                            track: {
                                type: 'string'
                            },
                            album: {
                                type: 'string'
                            },
                            length: {
                                type: 'integer'
                            },
                            currentPosition: {
                                type: 'integer'
                            },
                            artUrl: {
                                type: 'string'
                            }
                        },
                        required: [
                            'artist',
                            'track'
                        ]
                    }
                },
                queueFlushed: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            queueFlushed: {
                                type: 'boolean'
                            }
                        },
                        required: [
                            'queueFlushed'
                        ]
                    }
                },
                ledState: {
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
                },
                muted: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            muted: {
                                type: 'boolean'
                            }
                        },
                        required: [
                            'muted'
                        ]
                    }
                },
                volume: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            volume: {
                                type: 'integer'
                            }
                        },
                        required: [
                            'volume'
                        ]
                    }
                },
                next: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            muted: {
                                next: 'boolean'
                            }
                        },
                        required: [
                            'next'
                        ]
                    }
                },
                playingState: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            paused: {
                                paused: 'boolean'
                            },
                            playing: {
                                paused: 'boolean'
                            },
                            stopped: {
                                paused: 'boolean'
                            }
                        },
                        required: [
                            'paused', 'playing', 'stopped'
                        ]
                    }
                },
                previous: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            previous: {
                                type: 'boolean'
                            }
                        },
                        required: [
                            'previous'
                        ]
                    }
                },
                addedToQueueBottom: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            uri: {
                                type: 'string'
                            }
                        },
                        required: [
                            'queued'
                        ]
                    }
                },
                addedToQueueNext: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            uri: {
                                type: 'string'
                            }
                        },
                        required: [
                            'queued'
                        ]
                    }
                },
                seek: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            position: {
                                type: 'integer',
                                minimum: 0
                            }
                        },
                        required: [
                            'position'
                        ]
                    }
                },
                name: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string'
                            }
                        },
                        required: [
                            'name'
                        ]
                    }
                },
                playMode: {
                    type: Boolean,
                    responseSchema: {
                        $schema: 'http://json-schema.org/draft-04/schema#',
                        type: 'object',
                        properties: {
                            playMode: {
                                type: 'string',
                                enum: [
                                    'normal', 'repeat_all', 'shuffle', 'shuffle_norepeat'
                                ]
                            }
                        },
                        required: [
                            'playMode'
                        ]
                    }
                }
            }
        });
    });

    it('should create a mongoose model from the schema', () => {
        moduleToBeTested = require('../../models/speaker');
        expect(modelSpy).have.been.calledOnce;
        expect(modelSpy).to.have.been.calledWith('Speaker');
        expect(moduleToBeTested.Model).to.be.an.object;
    });

    describe('events', () => {
        it('should setup an event listener and expose it', () => {
            moduleToBeTested = require('../../models/speaker');
            expect(eventEmitterConstructorSpy).to.have.been.calledOnce;
            expect(moduleToBeTested.DeviceEventEmitter).to.be.an.object;
        });

        it('should have created 13 event listeners', () => {
            moduleToBeTested = require('../../models/speaker');
            expect(eventEmitterOnSpy).to.have.been.callCount(13);
        });

        describe('\'playMode\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[0][0]).to.equal('playMode');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[0][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'playMode',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[0][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'name\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[1][0]).to.equal('name');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[1][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'name',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[1][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'LEDState\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[2][0]).to.equal('LEDState');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[2][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'LEDState',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[2][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'addedToQueueBottom\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[3][0]).to.equal('addedToQueueBottom');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[3][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'addedToQueueBottom',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[3][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'addedToQueueNext\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[4][0]).to.equal('addedToQueueNext');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[4][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'addedToQueueNext',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[4][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'previous\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[5][0]).to.equal('previous');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[5][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'previous',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[5][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'next\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[6][0]).to.equal('next');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[6][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'next',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[6][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'queueFlushed\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[7][0]).to.equal('queueFlushed');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[7][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'queueFlushed',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[7][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'playingState\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[8][0]).to.equal('playingState');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[8][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'playingState',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[8][1];
				// call the function
                eventCallback('abc123', 'def456');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'currentTrack\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[9][0]).to.equal('currentTrack');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[9][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'currentTrack',
                    value: 'ghi789'
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[9][1];
				// call the function
                eventCallback('abc123', 'def456', 'ghi789');
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'volume\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[10][0]).to.equal('volume');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[10][1];
				// call the function
                eventCallback('abc123', 'def456', 10);
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'volume',
                    value: 10
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[10][1];
				// call the function
                eventCallback('abc123', 'def456', 10);
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'muted\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[11][0]).to.equal('muted');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[11][1];
				// call the function
                eventCallback('abc123', 'def456', true);
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'muted',
                    value: true
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[11][1];
				// call the function
                eventCallback('abc123', 'def456', false);
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });

        describe('\'seek\' event', () => {
            it('should register the event listener', () => {
                moduleToBeTested = require('../../models/speaker');
                expect(eventEmitterOnSpy.args[12][0]).to.equal('seek');
            });

            it('should create a new event', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[12][1];
				// call the function
                eventCallback('abc123', 'def456', 123);
                expect(eventCreateSpy).to.have.been.calledOnce;
                expect(eventCreateSpy).to.have.been.calledWith({
                    eventType: 'device',
                    driverType: 'speaker',
                    driverId: 'abc123',
                    deviceId: 'def456',
                    event: 'seek',
                    value: 123
                });
            });

            it('should save the event to the database', () => {
                moduleToBeTested = require('../../models/speaker');
                const eventCallback = eventEmitterOnSpy.args[12][1];
				// call the function
                eventCallback('abc123', 'def456', 123);
				// check that the save function has been called
                expect(eventSaveSpy).to.have.been.calledOnce;
            });

            xit('should handle a failed save accordingly', () => {

            });
        });
    });
});
