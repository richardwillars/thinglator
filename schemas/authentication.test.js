const authenticationSchemas = require("./authentication");

describe("schemas/authentication", () => {
  it("should export the schemas", () => {
    expect(authenticationSchemas).toMatchSnapshot();
  });
});
