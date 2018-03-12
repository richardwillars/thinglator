const lightModule = require("./light");
const constants = require("../../constants");
const eventsModule = require("../events");

const events = eventsModule(constants);

describe("models/light", () => {
  it("should export the commands", () => {
    const lightModel = lightModule(events, constants);
    expect(lightModel.commands).toMatchSnapshot();
  });

  it("should export the events", () => {
    const lightModel = lightModule(events, constants);
    expect(lightModel.events).toMatchSnapshot();
  });
});
