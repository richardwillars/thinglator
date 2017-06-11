
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
    },

    processIncomingEvents(schema, driverType, EventModel) {
        const deviceEventEmitter = new EventEmitter2();
        Object.keys(schema.paths).forEach((schemaItem) => {
            if (schemaItem.startsWith('events.') === true) {
                utils.processIncomingEvent(
                  deviceEventEmitter,
                  schema.paths[schemaItem].options.responseSchema,
                  schemaItem.substring(7),
                  driverType,
                  EventModel
                );
            }
        });
        return deviceEventEmitter;
    },

    processIncomingEvent(deviceEventEmitter, eventSchema, eventId, driverType, EventModel) {
        deviceEventEmitter.on(eventId, (driverId, deviceId, value) => {
            // validate the event against the schema
            const validated = utils.eventValidator(value, eventSchema);
            if (validated === true) {
                const eventObj = EventModel({
                    eventType: 'device',
                    driverType,
                    driverId,
                    deviceId,
                    event: eventId,
                    value
                });
                eventObj.save().catch((err) => {
                    console.log('Unable to save event..', eventObj, err);
                });
            } else {
                console.log('Invalid event', driverId, eventId, value);
                console.error(validated);
            }
        });
    }
};

module.exports = utils;
