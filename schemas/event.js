module.exports = {
  eventType: {
    type: String,
    required: true,
    enum: ["request", "device"]
  },
  driverType: {
    type: String,
    required: true
  },
  driverId: {
    type: String,
    required: true
  },
  deviceId: {
    type: String,
    required: true
  },
  event: {
    type: String,
    required: true
  },
  value: {
    type: Object,
    required: false,
    default: {}
  }
};
