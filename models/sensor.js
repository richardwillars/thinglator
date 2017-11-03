module.exports = (mongoose, events, constants) => {
  const schema = {
    _id: false,
    name: {
      type: String,
      required: true,
    },
    originalId: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: Object,
      required: false,
      default: {},
    },
    commands: {

    },
    events: {},
  };

  Object.keys(constants.sensor).forEach((key) => {
    schema.events[key] = events[key];
  });

  return {
    model: mongoose.model('Sensor', new mongoose.Schema(schema)),
    schema,
  };
};

// module.exports = {
//   Model: Sensor,
//   DeviceEventEmitter: eventUtils.processIncomingEvents(Sensor.schema, 'sensor', EventModel),
//   schema,
// };
