const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const EventModel = require('./event').Model;

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
    capabilities: {
        motion: {
            type: 'object',
            default: false,
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
            type: 'object',
            default: false,
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
            type: 'object',
            default: false,
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
            type: 'object',
            default: false,
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
            type: 'object',
            default: false,
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
            type: 'object',
            default: false,
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
        uv: {
            type: 'object',
            default: false,
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
        batteryLevel: {
            type: 'object',
            default: false,
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

deviceEventEmitter.on('on', (driverId, deviceId, value) => {
    console.log('sensor turned', driverId, deviceId);
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'sensor',
        driverId,
        deviceId,
        event: 'on',
        value: value.on
    });
    eventObj.save().catch((err) => {
        console.log('Unable to save event..', eventObj, err);
    });
});


module.exports = {
    Model: Sensor,
    DeviceEventEmitter: deviceEventEmitter
};
