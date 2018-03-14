const eventSchema = require("./event");

describe("schemas/event", () => {
  it("should export the schema", () => {
    expect(eventSchema).toMatchSnapshot();
  });
});
