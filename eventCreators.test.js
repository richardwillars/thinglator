const eventCreators = require("./eventCreators");

describe("eventCreators", () => {
  it("should export a function call deviceEvent", () => {
    expect(typeof eventCreators.deviceEvent).toEqual("function");
  });

  it("should map the specified params into an object", () => {
    const eventId = "event id";
    const driverType = "driver type";
    const driverId = "driver id";
    const deviceId = "device id";
    const value = "value";
    const result = eventCreators.deviceEvent(
      eventId,
      driverType,
      driverId,
      deviceId,
      value
    );
    expect(result).toEqual({
      eventType: "device",
      driverType,
      driverId,
      deviceId,
      event: eventId,
      value
    });
  });
});
