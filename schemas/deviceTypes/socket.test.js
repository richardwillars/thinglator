const socketModule = require("./socket");
const constants = require("../../constants");
const eventsModule = require("../events");

const events = eventsModule(constants);

describe("models/socket", () => {
  it("should export the commands", () => {
    const socketModel = socketModule(events, constants);
    expect(socketModel.commands).toMatchSnapshot();
  });

  it("should export the events", () => {
    const socketModel = socketModule(events, constants);
    expect(socketModel.events).toMatchSnapshot();
  });
});
