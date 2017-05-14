const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;

const EventModel = require('./event').Model;

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
    capabilities: {
        toggle: {
            type: Boolean,
            default: false,
            eventName: 'state',
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
        },
        setHSBState: {
            type: Boolean,
            default: false,
            eventName: 'state',
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
            },
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
        },
        setBrightnessState: {
            type: Boolean,
            default: false,
            eventName: 'state',
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
            },
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
        },
        setBooleanState: {
            type: Boolean,
            default: false,
            eventName: 'state',
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
            },
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

        },
        breatheEffect: {
            type: Boolean,
            default: false,
            eventName: 'breatheEffect',
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

            },
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
            default: false,
            eventName: 'pulseEffect',
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

            },
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
        }
    }
});


const Light = mongoose.model('Light', LightSchema);
const deviceEventEmitter = new EventEmitter2();

deviceEventEmitter.on('state', (driverId, deviceId, state) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'light',
        driverId,
        deviceId,
        event: 'state',
        value: state
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

module.exports = {
    Model: Light,
    DeviceEventEmitter: deviceEventEmitter
};
