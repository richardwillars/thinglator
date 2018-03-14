const indexModule = require("./index");
const constants = require("../constants");

describe("models/index", () => {
  it("should export the list of models", () => {
    const index = indexModule(constants);
    expect(index).toMatchSnapshot();
  });
});
