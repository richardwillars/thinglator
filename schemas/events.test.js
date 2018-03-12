const eventsModule = require("./events");
const constants = require("../constants");

describe("models/events", () => {
  it("should export the list of events", () => {
    const events = eventsModule(constants);
    expect(events).toMatchSnapshot();
  });
});
