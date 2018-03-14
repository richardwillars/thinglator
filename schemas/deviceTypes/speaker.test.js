const speakerModule = require("./speaker");
const constants = require("../../constants");
const eventsModule = require("../events");

const events = eventsModule(constants);

describe("models/speaker", () => {
  it("should export the commands", () => {
    const speakerModel = speakerModule(events, constants);
    expect(speakerModel.commands).toMatchSnapshot();
  });

  it("should export the events", () => {
    const speakerModel = speakerModule(events, constants);
    expect(speakerModel.events).toMatchSnapshot();
  });
});
