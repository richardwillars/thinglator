const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;

const EventModel = require('./event').Model;
const eventValidator = require('../utils/event').eventValidator;

// colour must be specifed in the following format: "hue:120 saturation:1.0 brightness:0.5"
const LightSchema = new mongoose.Schema({
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
        toggle: {
            type: Boolean
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
                                maxiumum: 360
                            },
                            saturation: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            },
                            brightness: {
                                type: 'double',
                                minimum: 0.01,
                                maximum: 1
                            }
                        },
                        required: [
                            'hue',
                            'saturation',
                            'brightness'
                        ]
                    },

                    duration: {
                        type: 'integer',
                        minimum: 0,
                        maxiumum: 99999
                    }
                },
                required: [
                    'colour',
                    'duration'
                ]
            }
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
                                maximum: 1
                            }
                        },
                        required: [
                            'brightness'
                        ]
                    },
                    duration: {
                        type: 'integer',
                        minimum: 0,
                        maxiumum: 99999
                    }
                },
                required: [
                    'colour',
                    'duration'
                ]
            }
        },
        setBooleanState: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    on: {
                        type: 'boolean'
                    },
                    duration: {
                        type: 'integer',
                        minimum: 0,
                        maxiumum: 99999
                    }
                },
                required: [
                    'on',
                    'duration'
                ]
            }

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
                                maxiumum: 360
                            },
                            saturation: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            },
                            brightness: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            }
                        },
                        required: [
                            'hue',
                            'saturation',
                            'brightness'
                        ]
                    },
                    fromColour: {
                        type: 'object',
                        properties: {
                            hue: {
                                type: 'integer',
                                minimum: 0,
                                maxiumum: 360
                            },
                            saturation: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            },
                            brightness: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            }
                        },
                        required: [
                            'hue',
                            'saturation',
                            'brightness'
                        ]
                    },
                    period: {
                        type: 'double',
                        minimum: 0.01,
                        maximum: 100
                    },
                    cycles: {
                        duration: 'double',
                        minimum: 0.01,
                        maxiumum: 99999
                    },
                    persist: {
                        type: 'boolean'
                    },
                    peak: {
                        type: 'double',
                        minimum: 0,
                        maximum: 1
                    }
                },
                required: [
                    'colour',
                    'period',
                    'cycles',
                    'persist',
                    'peak'
                ]

            }
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
                                maxiumum: 360
                            },
                            saturation: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            },
                            brightness: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            }
                        },
                        required: [
                            'hue',
                            'saturation',
                            'brightness'
                        ]
                    },
                    fromColour: {
                        type: 'object',
                        properties: {
                            hue: {
                                type: 'integer',
                                minimum: 0,
                                maxiumum: 360
                            },
                            saturation: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            },
                            brightness: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            }
                        },
                        required: [
                            'hue',
                            'saturation',
                            'brightness'
                        ]
                    },
                    period: {
                        type: 'double',
                        minimum: 0.01,
                        maximum: 100
                    },
                    cycles: {
                        duration: 'double',
                        minimum: 0.01,
                        maxiumum: 99999
                    },
                    persist: {
                        type: 'boolean'
                    }
                },
                required: [
                    'colour',
                    'period',
                    'cycles',
                    'persist'
                ]

            }
        }
    },
    events: {
        breatheEffect: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    breatheEffect: {
                        type: 'boolean'
                    }
                },
                required: [
                    'breatheEffect'
                ]
            }
        },
        pulseEffect: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    pulseEffect: {
                        type: 'boolean'
                    }
                },
                required: [
                    'pulseEffect'
                ]
            }
        },
        state: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    on: {
                        type: 'boolean'
                    },
                    colour: {
                        type: 'object',
                        properties: {
                            hue: {
                                type: 'integer',
                                minimum: 0,
                                maxiumum: 360
                            },
                            saturation: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            },
                            brightness: {
                                type: 'double',
                                minimum: 0,
                                maximum: 1
                            }
                        }
                    }
                },
                required: [
                    'colour',
                    'on'
                ]
            }
        }
    }
});


const Light = mongoose.model('Light', LightSchema);
const deviceEventEmitter = new EventEmitter2();

function processEvent(driverId, deviceId, value, eventName) {
  // validate the event against the schema
    const validated = eventValidator(value, Light.schema.paths[`events.${eventName}`].options.responseSchema);
    if (validated === true) {
        const eventObj = EventModel({
            eventType: 'device',
            driverType: 'sensor',
            driverId,
            deviceId,
            event: eventName,
            value
        });
        eventObj.save().catch((err) => {
            console.log('Unable to save event..', eventObj, err);
        });
    } else {
        console.log('Invalid event', driverId, eventName, value);
        console.error(validated);
    }
}

deviceEventEmitter.on('state', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'state');
});

deviceEventEmitter.on('pulseEffect', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'pulseEffect');
});

deviceEventEmitter.on('breatheEffect', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'breatheEffect');
});

module.exports = {
    Model: Light,
    DeviceEventEmitter: deviceEventEmitter
};
