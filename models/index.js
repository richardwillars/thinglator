const authenticationSchemasModel = require('./authenticationSchemas');
const deviceModel = require('./device');
const driverModel = require('./driver');
const eventModel = require('./event');
const eventsModel = require('./events');
const lightModel = require('./light');
const sensorModel = require('./sensor');
const speakerModel = require('./speaker');
const socketModel = require('./socket');

module.exports = (mongoose, constants) => {
  const events = eventsModel(constants);
  return {
    authenticationSchemas: authenticationSchemasModel,
    device: deviceModel(mongoose),
    driver: driverModel(mongoose),
    event: eventModel(mongoose),
    events,
    light: lightModel(mongoose, events, constants),
    sensor: sensorModel(mongoose, events, constants),
    socket: socketModel(mongoose, events, constants),
    speaker: speakerModel(mongoose, events, constants),
  };
};

