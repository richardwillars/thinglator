module.exports = (mongoose) => {
  const schema = {
    eventType: {
      type: String,
      required: true,
      enum: ['request', 'device'],
    },
    driverType: {
      type: String,
      required: true,
    },
    driverId: {
      type: String,
      required: true,
    },
    deviceId: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
    },
    value: {
      type: Object,
      required: false,
      default: {},
    },
    when: {
      type: Date,
      required: false,
      default: Date.now,
    },
  };

  const EventSchema = new mongoose.Schema(schema);

  return {
    model: mongoose.model('Event', EventSchema),
    schema,
  };
};
