const sensorModule = require("./sensor");
const constants = require("../../constants");
const eventsModule = require("../events");

const events = eventsModule(constants);

describe("models/sensor", () => {
  it("should export the commands", () => {
    const sensorModel = sensorModule(events, constants);
    expect(sensorModel.commands).toMatchSnapshot();
  });

  it("should export the events", () => {
    const sensorModel = sensorModule(events, constants);
    expect(sensorModel.events).toMatchSnapshot();
  });
});
