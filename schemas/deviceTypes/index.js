const lightModule = require("./light");
const sensorModule = require("./sensor");
const socketModule = require("./socket");
const speakerModule = require("./speaker");

module.exports = (events, constants) => ({
  light: lightModule(events, constants),
  sensor: sensorModule(events, constants),
  socket: socketModule(events, constants),
  speaker: speakerModule(events, constants)
});
