const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const EventModel = require('./event').Model;
const eventValidator = require('../utils/event').eventValidator;

const SwitchSchema = new mongoose.Schema({
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


const Switch = mongoose.model('Switch', SwitchSchema);
const deviceEventEmitter = new EventEmitter2();

function processEvent(driverId, deviceId, value, eventName) {
  // validate the event against the schema
    const validated = eventValidator(value, Switch.schema.paths[`events.${eventName}`].options.responseSchema);
    if (validated === true) {
        const eventObj = EventModel({
            eventType: 'device',
            driverType: 'switch',
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

deviceEventEmitter.on('on', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'on');
});

deviceEventEmitter.on('energy', (driverId, deviceId, value) => {
    processEvent(driverId, deviceId, value, 'energy');
});


module.exports = {
    Model: Switch,
    DeviceEventEmitter: deviceEventEmitter
};
