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
      on: {
        type: Boolean,
        description: 'Turns the socket on',
        friendly: 'Turn on',
      },
      off: {
        type: Boolean,
        description: 'Turns the socket off',
        friendly: 'Turn off',
      },
    },
    events: {},
  };

  Object.keys(constants.socket).forEach((key) => {
    schema.events[key] = events[key];
  });

  return {
    model: mongoose.model('Socket', new mongoose.Schema(schema)),
    schema,
  };
};
// module.exports = {
//   Model: Socket,
//   DeviceEventEmitter: eventUtils.processIncomingEvents(Socket.schema, 'socket', EventModel),
//   schema,
// };
