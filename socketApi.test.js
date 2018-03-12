const socketApiModule = require("./socketApi");

describe("socketApi", () => {
  it("should return the instance of the socket", async () => {
    const socket = {
      on: jest.fn()
    };
    const io = {
      emit: jest.fn(),
      on: jest.fn().mockReturnValue(socket)
    };
    const ioLib = jest.fn().mockReturnValue(io);
    const authenticateCtrl = {
      getAuthenticationProcess: jest
        .fn()
        .mockReturnValue(Promise.resolve({ foo: "bar" }))
    };
    const eventCtrl = {};
    const driverCtrl = {};
    const interfaceCtrl = {};

    const eventUtils = {
      eventEmitter: {
        on: jest.fn()
      }
    };
    const httpServer = {};
    const drivers = {};
    const constants = {};
    const socketApi = socketApiModule.initialise(
      ioLib,
      authenticateCtrl,
      eventCtrl,
      driverCtrl,
      interfaceCtrl,
      eventUtils,
      httpServer,
      drivers,
      constants
    );

    expect(socketApi).toEqual(io);
  });

  describe("Error handler", () => {
    it("should handle Driver errors", () => {
      const err = new Error("Error message");
      err.type = "Driver";
      err.driver = "DriverId";
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 500,
        driver: "DriverId",
        message: "Error message",
        type: "Driver"
      });
    });

    it("should handle BadRequest errors", () => {
      const err = new Error("Error message");
      err.type = "BadRequest";
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 400,
        message: "Error message",
        type: "BadRequest"
      });
    });

    it("should handle NotFound errors", () => {
      const err = new Error("Error message");
      err.type = "Driver";
      err.driver = "DriverId";
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 500,
        driver: "DriverId",
        message: "Error message",
        type: "Driver"
      });
    });

    it("should handle Validation errors", () => {
      const err = new Error("Error message");
      err.type = "Validation";
      err.errors = [{ foo: "bar" }];
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 400,
        errors: [{ foo: "bar" }],
        message: "Error message",
        type: "Validation"
      });
    });

    it("should handle Connection errors", () => {
      const err = new Error("Error message");
      err.type = "Connection";
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 503,
        message: "Error message",
        type: "Connection"
      });
    });

    it("should handle Authentication errors", () => {
      const err = new Error("Error message");
      err.type = "Authentication";
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 401,
        message: "Error message",
        type: "Authentication"
      });
    });

    it("should handle Internal errors", () => {
      const err = new Error("Error message");
      const result = socketApiModule.errorHandler(err);
      expect(result).toEqual({
        code: 500,
        type: "Internal"
      });
    });
  });

  describe("Event emitter", () => {
    it("should subcribe to driver events and emit them on the socket", async () => {
      const socket = {
        on: jest.fn()
      };
      const io = {
        emit: jest.fn(),
        on: jest.fn().mockReturnValue(socket)
      };
      const ioLib = jest.fn().mockReturnValue(io);
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const interfaceCtrl = {};
      const eventUtils = {
        eventEmitter: {
          on: jest.fn()
        }
      };
      const httpServer = {};
      const drivers = {};
      const constants = {
        DEVICE_EVENT: "DEVICE_EVENT"
      };
      socketApiModule.initialise(
        ioLib,
        authenticateCtrl,
        eventCtrl,
        driverCtrl,
        interfaceCtrl,
        eventUtils,
        httpServer,
        drivers,
        constants
      );
      expect(eventUtils.eventEmitter.on).toHaveBeenCalledTimes(1);
      expect(eventUtils.eventEmitter.on.mock.calls[0][0]).toEqual(
        "DEVICE_EVENT"
      );
      const callback = eventUtils.eventEmitter.on.mock.calls[0][1];
      expect(typeof callback).toEqual("function");
      callback({ foo: "bar" });
      expect(io.emit).toHaveBeenCalledTimes(1);
      expect(io.emit).toHaveBeenCalledWith("newEvent", { foo: "bar" });
    });
  });

  describe("Endpoints", () => {
    describe("getAuthenticationProcess", () => {
      it("should call authenticateCtrl.getAuthenticationProcess and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const authenticateCtrl = {
          getAuthenticationProcess: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const interfaceCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[0][0]).toEqual("getAuthenticationProcess");
        const callback = socket.on.mock.calls[0][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driverId", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const authenticateCtrl = {
          getAuthenticationProcess: jest
            .fn()
            .mockReturnValue(Promise.reject(err))
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const interfaceCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[0][0]).toEqual("getAuthenticationProcess");
        const callback = socket.on.mock.calls[0][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driverId", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("authenticationStep", () => {
      it("should call authenticateCtrl.authenticationStep and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const authenticateCtrl = {
          authenticationStep: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const interfaceCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[1][0]).toEqual("authenticationStep");
        const callback = socket.on.mock.calls[1][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driverId", "step", "body", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const authenticateCtrl = {
          authenticationStep: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const interfaceCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[1][0]).toEqual("authenticationStep");
        const callback = socket.on.mock.calls[1][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driverId", "step", "body", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("discoverDevices", () => {
      it("should call driverCtrl.discover and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          discover: jest.fn().mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[2][0]).toEqual("discoverDevices");
        const callback = socket.on.mock.calls[2][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driverId", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          discover: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[2][0]).toEqual("discoverDevices");
        const callback = socket.on.mock.calls[2][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driverId", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getDevices", () => {
      it("should call driverCtrl.getAllDevices and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getAllDevices: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[3][0]).toEqual("getDevices");
        const callback = socket.on.mock.calls[3][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getAllDevices: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[3][0]).toEqual("getDevices");
        const callback = socket.on.mock.calls[3][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getDevicesByType", () => {
      it("should call driverCtrl.getDevicesByType and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getDevicesByType: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[4][0]).toEqual("getDevicesByType");
        const callback = socket.on.mock.calls[4][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("type", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";

        const driverCtrl = {
          getDevicesByType: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[4][0]).toEqual("getDevicesByType");
        const callback = socket.on.mock.calls[4][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("type", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getDevicesByDriver", () => {
      it("should call driverCtrl.getDevicesByDriver and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getDevicesByDriver: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[5][0]).toEqual("getDevicesByDriver");
        const callback = socket.on.mock.calls[5][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driver", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getDevicesByDriver: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[5][0]).toEqual("getDevicesByDriver");
        const callback = socket.on.mock.calls[5][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("driver", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getDeviceById", () => {
      it("should call driverCtrl.getDeviceById and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getDeviceById: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[6][0]).toEqual("getDeviceById");
        const callback = socket.on.mock.calls[6][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("deviceId", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getDeviceById: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[6][0]).toEqual("getDeviceById");
        const callback = socket.on.mock.calls[6][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("deviceId", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("runCommand", () => {
      it("should call driverCtrl.runCommand and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          runCommand: jest.fn().mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[7][0]).toEqual("runCommand");
        const callback = socket.on.mock.calls[7][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("deviceId", "command", "body", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith();
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          runCommand: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[7][0]).toEqual("runCommand");
        const callback = socket.on.mock.calls[7][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("deviceId", "command", "body", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getDrivers", () => {
      it("should call driverCtrl.getDrivers and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getDriversWithStats: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[8][0]).toEqual("getDrivers");
        const callback = socket.on.mock.calls[8][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getDriversWithStats: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[8][0]).toEqual("getDrivers");
        const callback = socket.on.mock.calls[8][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getEventsByType", () => {
      it("should call eventCtrl.getEventsByType and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const eventCtrl = {
          getEventsByType: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const driverCtrl = {};
        const interfaceCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[9][0]).toEqual("getEventsByType");
        const callback = socket.on.mock.calls[9][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("eventType", "from", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const eventCtrl = {
          getEventsByType: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const driverCtrl = {};
        const interfaceCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[9][0]).toEqual("getEventsByType");
        const callback = socket.on.mock.calls[9][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback("eventType", "from", cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getLatestCommandEvents", () => {
      it("should call eventCtrl.getLatestCommandEvents and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const eventCtrl = {
          getLatestCommandEvents: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const driverCtrl = {};
        const interfaceCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[10][0]).toEqual("getLatestCommandEvents");
        const callback = socket.on.mock.calls[10][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const eventCtrl = {
          getLatestCommandEvents: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const driverCtrl = {};
        const interfaceCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[10][0]).toEqual("getLatestCommandEvents");
        const callback = socket.on.mock.calls[10][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getCommandDescriptions", () => {
      it("should call driverCtrl.getCommands and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getCommands: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[11][0]).toEqual("getCommands");
        const callback = socket.on.mock.calls[11][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getCommands: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[11][0]).toEqual("getCommands");
        const callback = socket.on.mock.calls[11][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getEventDescriptions", () => {
      it("should call driverCtrl.getEventDescriptions and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getEventDescriptions: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[12][0]).toEqual("getEventDescriptions");
        const callback = socket.on.mock.calls[12][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getEventDescriptions: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[12][0]).toEqual("getEventDescriptions");
        const callback = socket.on.mock.calls[12][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });

    describe("getDeviceTypes", () => {
      it("should call driverCtrl.getDeviceTypes and return the result", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const driverCtrl = {
          getDeviceTypes: jest
            .fn()
            .mockReturnValue(Promise.resolve({ foo: "bar" }))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[13][0]).toEqual("getDeviceTypes");
        const callback = socket.on.mock.calls[13][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({ foo: "bar" });
      });

      it("should catch any errors and return them", async () => {
        const socket = {
          on: jest.fn()
        };
        const io = {
          emit: jest.fn(),
          on: jest.fn().mockReturnValue(socket)
        };
        const ioLib = jest.fn().mockReturnValue(io);
        const err = new Error("the error");
        err.type = "Driver";
        err.driver = "Driver id";
        const driverCtrl = {
          getDeviceTypes: jest.fn().mockReturnValue(Promise.reject(err))
        };
        const interfaceCtrl = {};
        const eventCtrl = {};
        const authenticateCtrl = {};
        const eventUtils = {
          eventEmitter: {
            on: jest.fn()
          }
        };
        const httpServer = {};
        const drivers = {};
        const constants = {};
        socketApiModule.initialise(
          ioLib,
          authenticateCtrl,
          eventCtrl,
          driverCtrl,
          interfaceCtrl,
          eventUtils,
          httpServer,
          drivers,
          constants
        );
        const ioCallback = io.on.mock.calls[0][1];
        ioCallback(socket);
        expect(socket.on.mock.calls[13][0]).toEqual("getDeviceTypes");
        const callback = socket.on.mock.calls[13][1];
        expect(typeof callback).toEqual("function");

        const cb = jest.fn();
        await callback(cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith({
          code: 500,
          driver: "Driver id",
          message: "the error",
          type: "Driver"
        });
      });
    });
  });
});
