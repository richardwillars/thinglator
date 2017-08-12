const mongoose = require('mongoose');

const events = require('../events');
const eventUtils = require('../utils/event');
const EventModel = require('../models/event').Model;

const schema = {
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
        motion: events.motion,
        tamper: events.tamper,
        vibration: events.vibration,
        temperature: events.temperature,
        humidity: events.humidity,
        light: events.light,
        contact: events.contact,
        uv: events.uv,
        batteryLevel: events.batteryLevel
    }
};
const SensorSchema = new mongoose.Schema(schema);


const Sensor = mongoose.model('Sensor', SensorSchema);

module.exports = {
    Model: Sensor,
    DeviceEventEmitter: eventUtils.processIncomingEvents(Sensor.schema, 'sensor', EventModel),
    schema
};
