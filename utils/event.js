const eventValidator = (input, schema, jsonValidator) => {
  const validated = jsonValidator.validate(input, schema);
  if (validated.errors.length !== 0) {
    const e = new Error('the supplied json is invalid');
    e.type = 'Validation';
    e.errors = validated.errors;
    return e;
  }
  return true;
};

const processDeviceEvent = (schema, payload, eventId, EventModel, jsonValidator, eventEmitter, constants) => {
  const validated = eventValidator(payload, schema, jsonValidator);
  if (validated === true) {
    eventEmitter.emit(constants.DEVICE_EVENT, payload);

    const eventObj = new EventModel(payload);
    eventObj.save().catch((err) => {
      console.error('Unable to save event', payload, err);
    });
  } else {
    console.log('Invalid event', payload.driverId, eventId, payload);
    console.error(validated);
  }
};


module.exports = (EventEmitter, constants, models, jsonValidator) => {
  const eventEmitter = new EventEmitter();
  eventEmitter.on(constants.DEVICE_LIGHT_EVENT, (payload) => {
    processDeviceEvent(models.light.schema, payload, constants.LIGHT_EVENT, models.event.model, jsonValidator, eventEmitter, constants);
  });

  eventEmitter.on(constants.DEVICE_SPEAKER_EVENT, (payload) => {
    processDeviceEvent(models.speaker.schema, payload, constants.SPEAKER_EVENT, models.event.model, jsonValidator, eventEmitter, constants);
  });

  eventEmitter.on(constants.DEVICE_SOCKET_EVENT, (payload) => {
    processDeviceEvent(models.socket.schema, payload, constants.SOCKET_EVENT, models.event.model, jsonValidator, eventEmitter, constants);
  });

  eventEmitter.on(constants.DEVICE_SENSOR_EVENT, (payload) => {
    processDeviceEvent(models.sensor.schema, payload, constants.SENSOR_EVENT, models.event.model, jsonValidator, eventEmitter, constants);
  });

  return {
    eventEmitter,
  };
};
