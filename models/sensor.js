const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const EventModel = require('./event').Model;
const eventValidator = require('../utils/event').eventValidator;

const SensorSchema = new mongoose.Schema({
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

    },
    events: {
        motion: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    detected: {
                        type: 'boolean'
                    }
                },
                required: [
                    'detected'
                ]
            }
        },
        tamper: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    detected: {
                        type: 'boolean'
                    }
                },
                required: [
                    'detected'
                ]
            }
        },
        vibration: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    level: {
                        type: 'double',
                        minimum: 0,
                        maxiumum: 100
                    }
                },
                required: [
                    'level'
                ]
            }
        },
        temperature: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    level: {
                        type: 'double',
                        minimum: -50,
                        maxiumum: 100
                    }
                },
                required: [
                    'level'
                ]
            }
        },
        humidity: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    level: {
                        type: 'double',
                        minimum: 0,
                        maxiumum: 100
                    }
                },
                required: [
                    'level'
                ]
            }
        },
        light: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    level: {
                        type: 'double',
                        minimum: 0,
                        maxiumum: 30000
                    }
                },
                required: [
                    'level'
                ]
            }
        },
        contact: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    contact: {
                        type: Boolean
                    }
                },
                required: [
                    'contact'
                ]
            }
        },
        uv: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    level: {
                        type: 'double',
                        minimum: 0,
                        maxiumum: 15
                    }
                },
                required: [
                    'level'
                ]
            }
        },
        batteryLevel: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    level: {
                        type: 'double',
                        minimum: 0,
                        maxiumum: 100
                    }
                },
                required: [
                    'level'
                ]
            }
        }
    }
});


const Sensor = mongoose.model('Sensor', SensorSchema);
const deviceEventEmitter = new EventEmitter2();

function processEvent(driverId, deviceId, value, eventName) {
  // validate the event against the schema
    const validated = eventValidator(value, Sensor.schema.paths[`events.${eventName}`].options.responseSchema);
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

deviceEventEmitter.on('batteryLevel', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'batteryLevel');
});

deviceEventEmitter.on('uv', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'uv');
});

deviceEventEmitter.on('temperature', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'temperature');
});

deviceEventEmitter.on('humidity', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'humidity');
});

deviceEventEmitter.on('light', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'light');
});

deviceEventEmitter.on('motion', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'motion');
});

deviceEventEmitter.on('contact', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'contact');
});


module.exports = {
    Model: Sensor,
    DeviceEventEmitter: deviceEventEmitter
};
