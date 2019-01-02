/* eslint-disable no-console */
const eventValidator = (input, schema, jsonValidator) => {
  const validated = jsonValidator.validate(input, schema);
  if (validated.errors.length !== 0) {
    const e = new Error("the supplied json is invalid");
    e.type = "Validation";
    e.errors = validated.errors;
    return e;
  }
  return true;
};

const processDeviceEvent = (
  schema,
  payload,
  eventId,
  eventsCollection,
  jsonValidator,
  eventEmitter,
  constants
) => {
  const validated = eventValidator(payload, schema, jsonValidator);
  if (validated === true) {
    eventEmitter.emit(constants.DEVICE_EVENT, payload);
    eventsCollection.insert(payload);
  } else {
    console.log("Invalid event", payload.driverId, eventId, payload);
    console.error(validated);
  }
};

module.exports = (
  EventEmitter,
  constants,
  schemas,
  jsonValidator,
  eventsCollection
) => {
  const eventEmitter = new EventEmitter();
  eventEmitter.on(constants.DEVICE_LIGHT_EVENT, payload => {
    processDeviceEvent(
      schemas.deviceTypes.light,
      payload,
      constants.DEVICE_LIGHT_EVENT,
      eventsCollection,
      jsonValidator,
      eventEmitter,
      constants
    );
  });

  eventEmitter.on(constants.DEVICE_SPEAKER_EVENT, payload => {
    processDeviceEvent(
      schemas.deviceTypes.speaker,
      payload,
      constants.DEVICE_SPEAKER_EVENT,
      eventsCollection,
      jsonValidator,
      eventEmitter,
      constants
    );
  });

  eventEmitter.on(constants.DEVICE_SOCKET_EVENT, payload => {
    processDeviceEvent(
      schemas.deviceTypes.socket,
      payload,
      constants.DEVICE_SOCKET_EVENT,
      eventsCollection,
      jsonValidator,
      eventEmitter,
      constants
    );
  });

  eventEmitter.on(constants.DEVICE_SENSOR_EVENT, payload => {
    processDeviceEvent(
      schemas.deviceTypes.sensor,
      payload,
      constants.DEVICE_SENSOR_EVENT,
      eventsCollection,
      jsonValidator,
      eventEmitter,
      constants
    );
  });

  eventEmitter.on(constants.DEVICE_DOORBELL_EVENT, payload => {
    processDeviceEvent(
      schemas.deviceTypes.doorbell,
      payload,
      constants.DEVICE_DOORBELL_EVENT,
      eventsCollection,
      jsonValidator,
      eventEmitter,
      constants
    );
  });

  return {
    eventEmitter
  };
};
