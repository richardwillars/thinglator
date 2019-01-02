const doorbellModule = require("./doorbell");
const constants = require("../../constants");
const eventsModule = require("../events");

const events = eventsModule(constants);

describe("models/doorbell", () => {
  it("should export the commands", () => {
    const doorbellModel = doorbellModule(events, constants);
    expect(doorbellModel.commands).toMatchSnapshot();
  });

  it("should export the events", () => {
    const doorbellModel = doorbellModule(events, constants);
    expect(doorbellModel.events).toMatchSnapshot();
  });
});
