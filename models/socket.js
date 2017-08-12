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
        on: {
            type: Boolean,
            description: 'Turns the socket on',
            friendly: 'Turn on'
        },
        off: {
            type: Boolean,
            description: 'Turns the socket off',
            friendly: 'Turn off'
        }
    },
    events: {
        energy: events.energy,
        on: events.on
    }
};
const SocketSchema = new mongoose.Schema(schema);


const Socket = mongoose.model('Socket', SocketSchema);

module.exports = {
    Model: Socket,
    DeviceEventEmitter: eventUtils.processIncomingEvents(Socket.schema, 'socket', EventModel),
    schema
};
