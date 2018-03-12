const constants = require("./constants");

describe("Constants", () => {
  it("should export all the constants", () => {
    expect(constants).toMatchSnapshot();
  });
});
