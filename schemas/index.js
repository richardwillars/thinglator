const authentication = require("./authentication");
const device = require("./device");
const deviceTypes = require("./deviceTypes");
const driver = require("./driver");
const event = require("./event");
const eventsModel = require("./events");

module.exports = constants => {
  const events = eventsModel(constants);
  return {
    authentication,
    device,
    deviceTypes: deviceTypes(events, constants),
    driver,
    event,
    events
  };
};
