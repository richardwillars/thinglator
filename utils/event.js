
const Validator = require('jsonschema').Validator;
const jsonValidator = new Validator();
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
    },
    eventValidator(input, schema) {
        const validated = jsonValidator.validate(input, schema);
        if (validated.errors.length !== 0) {
            const e = new Error('the supplied json is invalid');
            e.type = 'Validation';
            e.errors = validated.errors;
            return e;
        }
        return true;
    }
};

module.exports = utils;
