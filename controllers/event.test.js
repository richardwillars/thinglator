const eventModule = require("./event");

describe("controllers/event", () => {
  describe("getLatestCommandEvents", () => {
    it("should get a list of latest command events grouped for each device/event", async () => {
      const events = [
        { foo: "bar", event: "a", $loki: 1 },
        { moo: "boo", event: "b", $loki: 2 },
        { moo: "boo", event: "b", $loki: 3 },
        { moo: "boo", event: "c", $loki: 4 }
      ];
      const eventsCollection = {
        find: jest.fn().mockReturnValue(events)
      };

      const event = eventModule(eventsCollection);
      const eventType = "device";
      const result = await event.getLatestCommandEvents(eventType);

      expect(result).toEqual([
        { event: "a", eventId: 1, foo: "bar" },
        { event: "b", eventId: 3, moo: "boo" },
        { event: "c", eventId: 4, moo: "boo" }
      ]);
    });
  });

  describe("getEventsByType", () => {
    it("should get a list of events of the specified type", async () => {
      const events = [{ foo: "bar", $loki: 1 }, { moo: "boo", $loki: 2 }];
      const eventsCollection = {
        find: jest.fn().mockReturnValue(events)
      };

      const event = eventModule(eventsCollection);
      const eventType = "device";
      const result = await event.getEventsByType(eventType);

      expect(result).toEqual([
        { eventId: 1, foo: "bar" },
        { eventId: 2, moo: "boo" }
      ]);
    });

    it("should get a list of events of the specified type and from the specified date", async () => {
      const events = [{ foo: "bar", $loki: 1 }, { moo: "boo", $loki: 2 }];
      const fromEvent = { boo: "bar", $loki: 3, meta: { created: 12345 } };
      const chainMock = jest.fn();
      const findMock = jest.fn();
      const limitMock = jest.fn();
      const dataMock = jest.fn();
      const eventsCollection = {
        get: jest.fn().mockReturnValue(fromEvent),
        chain: chainMock.mockReturnValue({
          find: findMock.mockReturnValue({
            limit: limitMock.mockReturnValue({
              data: dataMock.mockReturnValue(events)
            })
          })
        })
      };

      const event = eventModule(eventsCollection);
      const eventType = "device";
      const from = "12345678";
      const result = await event.getEventsByType(eventType, from);

      expect(result).toEqual([
        { eventId: 1, foo: "bar" },
        { eventId: 2, moo: "boo" }
      ]);

      expect(eventsCollection.get).toHaveBeenCalledTimes(1);
      expect(eventsCollection.get).toHaveBeenCalledWith("12345678");

      expect(chainMock).toHaveBeenCalledTimes(1);

      expect(findMock).toHaveBeenCalledTimes(1);
      expect(findMock).toHaveBeenCalledWith({
        $loki: { $ne: 3 },
        eventType: "device",
        "meta.created": { $gte: 12345 }
      });

      expect(limitMock).toHaveBeenCalledTimes(1);
      expect(limitMock).toHaveBeenCalledWith(100);

      expect(dataMock).toHaveBeenCalledTimes(1);
    });

    it("should get no events back if there are no events after the specified from date", async () => {
      const events = [{ foo: "bar", $loki: 1 }, { moo: "boo", $loki: 2 }];
      const fromEvent = null;

      const findMock = jest.fn();
      const eventsCollection = {
        get: jest.fn().mockReturnValue(fromEvent),
        chain: jest.fn().mockReturnValue({
          find: findMock.mockReturnValue({
            limit: jest.fn().mockReturnValue({
              data: jest.fn().mockReturnValue(events)
            })
          })
        })
      };

      const event = eventModule(eventsCollection);
      const eventType = "device";
      const from = "12345678";
      const result = await event.getEventsByType(eventType, from);

      expect(eventsCollection.get).toHaveBeenCalledWith("12345678");
      expect(result).toEqual([]);
    });

    it("should throw an error if the from parameter is not a valid id", async () => {
      const eventsCollection = {};

      const event = eventModule(eventsCollection);
      const eventType = "device";
      const from = 123;
      try {
        await event.getEventsByType(eventType, from);
      } catch (err) {
        expect(err.message).toEqual("From parameter is not a valid id");
      }
    });
  });
});
