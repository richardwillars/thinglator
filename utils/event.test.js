const eventModule = require("./event");
const constants = require("../constants");

describe("utils/event", () => {
  describe("eventEmitter", () => {
    it("should listen for the various device events", () => {
      const onMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1) {
          onMock(arg1);
        }
      };

      const schemas = {};
      const jsonValidator = {};
      const eventsCollection = {};

      const events = eventModule(
        EventEmitter,
        constants,
        schemas,
        jsonValidator,
        eventsCollection
      );

      expect(events instanceof EventEmitter);
      expect(onMock).toHaveBeenCalledTimes(4);
      expect(onMock).toHaveBeenCalledWith(constants.DEVICE_LIGHT_EVENT);
      expect(onMock).toHaveBeenCalledWith(constants.DEVICE_SPEAKER_EVENT);
      expect(onMock).toHaveBeenCalledWith(constants.DEVICE_SOCKET_EVENT);
      expect(onMock).toHaveBeenCalledWith(constants.DEVICE_SENSOR_EVENT);
    });

    it("should save the event into the database when the event emitter receives an event", () => {
      const onMock = jest.fn();
      const emitMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) {
          onMock(arg1, arg2);
        }
        emit(arg1, arg2) {
          emitMock(arg1, arg2);
        }
      };

      const schemas = {
        deviceTypes: {
          light: {}
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };
      const eventsCollection = {
        insert: jest.fn()
      };

      const events = eventModule(
        EventEmitter,
        constants,
        schemas,
        jsonValidator,
        eventsCollection
      );

      expect(events instanceof EventEmitter);
      const lightEventCb = onMock.mock.calls[0][1];
      const payload = { foo: "bar" };
      lightEventCb(payload);
      expect(jsonValidator.validate).toHaveBeenCalledTimes(1);

      expect(jsonValidator.validate).toHaveBeenCalledWith(
        payload,
        schemas.deviceTypes.light
      );

      expect(emitMock).toHaveBeenCalledTimes(1);
      expect(emitMock).toHaveBeenCalledWith(constants.DEVICE_EVENT, payload);

      expect(eventsCollection.insert).toHaveBeenCalledTimes(1);
      expect(eventsCollection.insert).toHaveBeenCalledWith(payload);
    });

    it("should gracefully handle any errors that happen when trying to save an event", () => {
      const onMock = jest.fn();
      const emitMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) {
          onMock(arg1, arg2);
        }
        emit(arg1, arg2) {
          emitMock(arg1, arg2);
        }
      };

      const schemas = {
        deviceTypes: {
          light: {}
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: ["some error"] })
      };
      const eventsCollection = {
        insert: jest.fn()
      };

      eventModule(
        EventEmitter,
        constants,
        schemas,
        jsonValidator,
        eventsCollection
      );

      const lightEventCb = onMock.mock.calls[0][1];
      const payload = { foo: "bar" };

      lightEventCb(payload);
      expect(emitMock).toHaveBeenCalledTimes(0);
      expect(eventsCollection.insert).toHaveBeenCalledTimes(0);
    });
  });
});
