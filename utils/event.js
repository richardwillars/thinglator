
const EventEmitter2 = require('eventemitter2').EventEmitter2;

const newEventEmitter = new EventEmitter2();


// this event emitter will gets used when new event db records are created (models/events.js) and is
// subscribed to by the socket.io handler (socketApi.js). This allows us to send any new events to any
// websocket clients
const utils = {
    newEventCreated(event) {
        newEventEmitter.emit('newEvent', event);
    },
    getEventEmitter() {
        return newEventEmitter;
    }
};

module.exports = utils;
