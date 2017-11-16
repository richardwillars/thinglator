module.exports = {
  deviceEvent: (eventId, driverType, driverId, deviceId, value) => ({
    eventType: 'device',
    driverType,
    driverId,
    deviceId,
    event: eventId,
    value,
  }),
};
