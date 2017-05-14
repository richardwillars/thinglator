const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const EventModel = require('./event').Model;

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
    capabilities: {

        on: {
            type: Boolean,
            default: false,
            eventName: 'on',
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

        off: {
            type: Boolean,
            default: false,
            eventName: 'on',
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

deviceEventEmitter.on('on', (driverId, deviceId, value) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'switch',
        driverId,
        deviceId,
        event: 'on',
        value: value.on
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});


module.exports = {
    Model: Switch,
    DeviceEventEmitter: deviceEventEmitter
};
