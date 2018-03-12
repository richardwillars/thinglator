const driverSchema = require("./driver");

describe("schemas/driver", () => {
  it("should export the schema", () => {
    expect(driverSchema).toMatchSnapshot();
  });
});
