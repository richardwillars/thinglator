const deviceSchema = require("./device");

describe("schemas/device", () => {
  it("should export the schema", () => {
    expect(deviceSchema).toMatchSnapshot();
  });
});
