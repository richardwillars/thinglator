const eventModule = require('./event');

describe('utils/event', () => {
  describe('eventEmitter', () => {
    it('should listen for the various device events', () => {
      const onMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) { onMock(arg1, arg2); }
      };
      const constants = {
        DEVICE_LIGHT_EVENT: 'DEVICE_LIGHT_EVENT',
        DEVICE_SPEAKER_EVENT: 'DEVICE_SPEAKER_EVENT',
        DEVICE_SOCKET_EVENT: 'DEVICE_SOCKET_EVENT',
        DEVICE_SENSOR_EVENT: 'DEVICE_SENSOR_EVENT',
      };
      const models = {};
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({}),
      };

      const event = eventModule(EventEmitter, constants, models, jsonValidator);
      expect(onMock).toHaveBeenCalledTimes(4);
      expect(onMock.mock.calls[0][0]).toEqual('DEVICE_LIGHT_EVENT');
      expect(typeof onMock.mock.calls[0][1]).toEqual('function');

      expect(onMock.mock.calls[1][0]).toEqual('DEVICE_SPEAKER_EVENT');
      expect(typeof onMock.mock.calls[1][1]).toEqual('function');

      expect(onMock.mock.calls[2][0]).toEqual('DEVICE_SOCKET_EVENT');
      expect(typeof onMock.mock.calls[2][1]).toEqual('function');

      expect(onMock.mock.calls[3][0]).toEqual('DEVICE_SENSOR_EVENT');
      expect(typeof onMock.mock.calls[3][1]).toEqual('function');

      expect(event.eventEmitter instanceof EventEmitter).toEqual(true);
    });

    it('should save the event into the database when the event emitter receives an event', () => {
      const onMock = jest.fn();
      const emitMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) { onMock(arg1, arg2); }
        emit(arg1, arg2) { emitMock(arg1, arg2); }
      };
      const constants = {
        LIGHT_EVENT: 'LIGHT_EVENT',
        DEVICE_LIGHT_EVENT: 'DEVICE_LIGHT_EVENT',
        DEVICE_SPEAKER_EVENT: 'DEVICE_SPEAKER_EVENT',
        DEVICE_SOCKET_EVENT: 'DEVICE_SOCKET_EVENT',
        DEVICE_SENSOR_EVENT: 'DEVICE_SENSOR_EVENT',
      };
      const eventModelConstructorMock = jest.fn();
      const saveMock = jest.fn().mockReturnValue(Promise.resolve());
      const models = {
        light: {
          schema: {
            foo: 'bar',
          },
        },
        event: {
          model: class EventModel {
            constructor(spec) {
              eventModelConstructorMock(spec);
            }
            save() {
              return saveMock();
            }
          },
        },
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] }),
      };

      eventModule(EventEmitter, constants, models, jsonValidator);
      const onEventCallback = onMock.mock.calls[0][1];
      onEventCallback({ payload: 'this is the payload' });
      expect(eventModelConstructorMock).toHaveBeenCalledTimes(1);
      expect(eventModelConstructorMock).toHaveBeenCalledWith({ payload: 'this is the payload' });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should gracefully handle any errors that happen when trying to save an event', () => {
      const onMock = jest.fn();
      const emitMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) { onMock(arg1, arg2); }
        emit(arg1, arg2) { emitMock(arg1, arg2); }
      };
      const constants = {
        LIGHT_EVENT: 'LIGHT_EVENT',
        DEVICE_LIGHT_EVENT: 'DEVICE_LIGHT_EVENT',
        DEVICE_SPEAKER_EVENT: 'DEVICE_SPEAKER_EVENT',
        DEVICE_SOCKET_EVENT: 'DEVICE_SOCKET_EVENT',
        DEVICE_SENSOR_EVENT: 'DEVICE_SENSOR_EVENT',
      };
      const eventModelConstructorMock = jest.fn();
      const saveMock = jest.fn().mockReturnValue(Promise.reject(new Error('something went wrong')));
      const models = {
        light: {
          schema: {
            foo: 'bar',
          },
        },
        event: {
          model: class EventModel {
            constructor(spec) {
              eventModelConstructorMock(spec);
            }
            save() {
              return saveMock();
            }
          },
        },
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] }),
      };

      eventModule(EventEmitter, constants, models, jsonValidator);
      const onEventCallback = onMock.mock.calls[0][1];
      onEventCallback({ payload: 'this is the payload' });
      expect(eventModelConstructorMock).toHaveBeenCalledTimes(1);
      expect(eventModelConstructorMock).toHaveBeenCalledWith({ payload: 'this is the payload' });
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should validate the event data before saving it', () => {
      const onMock = jest.fn();
      const emitMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) { onMock(arg1, arg2); }
        emit(arg1, arg2) { emitMock(arg1, arg2); }
      };
      const constants = {
        LIGHT_EVENT: 'LIGHT_EVENT',
        DEVICE_LIGHT_EVENT: 'DEVICE_LIGHT_EVENT',
        DEVICE_SPEAKER_EVENT: 'DEVICE_SPEAKER_EVENT',
        DEVICE_SOCKET_EVENT: 'DEVICE_SOCKET_EVENT',
        DEVICE_SENSOR_EVENT: 'DEVICE_SENSOR_EVENT',
      };
      const eventModelConstructorMock = jest.fn();
      const saveMock = jest.fn().mockReturnValue(Promise.resolve());
      const models = {
        light: {
          schema: {
            foo: 'bar',
          },
        },
        event: {
          model: class EventModel {
            constructor(spec) {
              eventModelConstructorMock(spec);
            }
            save() {
              return saveMock();
            }
          },
        },
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] }),
      };

      eventModule(EventEmitter, constants, models, jsonValidator);
      const onEventCallback = onMock.mock.calls[0][1];
      onEventCallback({ payload: 'this is the payload' });
      expect(jsonValidator.validate).toHaveBeenCalledTimes(1);
      expect(jsonValidator.validate).toHaveBeenCalledWith({ payload: 'this is the payload' }, { foo: 'bar' });
    });

    it('should not save the event if the validation fails', () => {
      const onMock = jest.fn();
      const emitMock = jest.fn();
      const EventEmitter = class EventEmitter {
        on(arg1, arg2) { onMock(arg1, arg2); }
        emit(arg1, arg2) { emitMock(arg1, arg2); }
      };
      const constants = {
        LIGHT_EVENT: 'LIGHT_EVENT',
        DEVICE_LIGHT_EVENT: 'DEVICE_LIGHT_EVENT',
        DEVICE_SPEAKER_EVENT: 'DEVICE_SPEAKER_EVENT',
        DEVICE_SOCKET_EVENT: 'DEVICE_SOCKET_EVENT',
        DEVICE_SENSOR_EVENT: 'DEVICE_SENSOR_EVENT',
      };
      const eventModelConstructorMock = jest.fn();
      const saveMock = jest.fn().mockReturnValue(Promise.resolve());
      const models = {
        light: {
          schema: {
            foo: 'bar',
          },
        },
        event: {
          model: class EventModel {
            constructor(spec) {
              eventModelConstructorMock(spec);
            }
            save() {
              return saveMock();
            }
          },
        },
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [{ msg: 'Validation error' }] }),
      };

      eventModule(EventEmitter, constants, models, jsonValidator);
      const onEventCallback = onMock.mock.calls[0][1];
      onEventCallback({ payload: 'this is the payload' });
      expect(jsonValidator.validate).toHaveBeenCalledTimes(1);
      expect(jsonValidator.validate).toHaveBeenCalledWith({ payload: 'this is the payload' }, { foo: 'bar' });
      expect(saveMock).toHaveBeenCalledTimes(0);
    });
  });
});

