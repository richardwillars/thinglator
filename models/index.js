const authenticationSchemasModel = require('./authenticationSchemas');
const deviceModel = require('./device');
const driverModel = require('./driver');
const eventModel = require('./event');
const lightModel = require('./light');
const sensorModel = require('./sensor');
const speakerModel = require('./speaker');
const switchModel = require('./switch');


module.exports = {
    authenticationSchemas: authenticationSchemasModel,
    device: deviceModel,
    driver: driverModel,
    event: eventModel,
    light: lightModel,
    sensor: sensorModel,
    speaker: speakerModel,
    switch: switchModel
};
