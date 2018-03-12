const authenticateModule = require("./authenticate");

describe("controllers/authenticate", () => {
  describe("getAuthenticationProcess", () => {
    it("should return the authentication process for the specified driver", async () => {
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };
      const authenticationSchema = {
        requested: {
          a: {},
          b: {}
        }
      };
      const authenticationSteps = [
        {
          type: "a"
        },
        {
          type: "b"
        }
      ];
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps)
          }
        },
        bar: {}
      };

      const driverId = "foo";
      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );
      const process = await authenticate.getAuthenticationProcess(driverId);
      expect(process).toEqual(authenticationSteps);
      expect(driverUtils.doesDriverExist).toHaveBeenCalledWith(
        "foo",
        driverList
      );
      expect(driverList.foo.api.authentication_getSteps).toHaveBeenCalledTimes(
        1
      );
      expect(jsonValidator.validate).toHaveBeenCalledTimes(2);
      expect(jsonValidator.validate).toHaveBeenCalledWith(
        authenticationSteps[0],
        authenticationSchema.requested.a
      );
      expect(jsonValidator.validate).toHaveBeenCalledWith(
        authenticationSteps[1],
        authenticationSchema.requested.b
      );
    });

    it("should throw an error if the driver cannot be found", async () => {
      const jsonValidator = {};
      const authenticationSchema = {};
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(false))
      };
      const driverList = {
        foo: {},
        bar: {}
      };

      const driverId = "foo";
      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );
      try {
        await authenticate.getAuthenticationProcess(driverId);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("foo driver not found");
      }
    });

    it("should throw an error if the authentication process can not be found", async () => {
      const jsonValidator = {};
      const authenticationSchema = {
        requested: {
          b: {}
        }
      };
      const authenticationSteps = [
        {
          type: "a"
        },
        {
          type: "b"
        }
      ];
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps)
          }
        },
        bar: {}
      };

      const driverId = "foo";
      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      try {
        await authenticate.getAuthenticationProcess(driverId);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("a validation schema not found");
      }
    });

    it("should throw an error if the authentication process does not match the json authentication schema ", async () => {
      const jsonValidator = {
        validate: jest
          .fn()
          .mockReturnValue({ errors: [{ error: "something happened" }] })
      };
      const authenticationSchema = {
        requested: {
          a: {},
          b: {}
        }
      };
      const authenticationSteps = [
        {
          type: "a"
        },
        {
          type: "b"
        }
      ];
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps)
          }
        },
        bar: {}
      };

      const driverId = "foo";
      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      try {
        await authenticate.getAuthenticationProcess(driverId);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual(
          "The foo driver produced invalid authentication steps"
        );
      }
    });
  });

  describe("authenticationStep", () => {
    it("should call the driver with the authentication step (and the specified details", async () => {
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };
      const authenticationSchema = {
        returned: {
          a: {},
          b: {}
        }
      };
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const authenticationSteps = [
        { stepId: 0, type: "a" },
        { stepId: 1, type: "b" }
      ];

      const stepResponse = { response: "bla" };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps),
            authentication_step0: jest.fn().mockReturnValue(stepResponse)
          }
        }
      };

      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      const driverId = "foo";
      const step = 0;
      const body = { someprops: "bla" };
      const result = await authenticate.authenticationStep(
        driverId,
        step,
        body
      );
      expect(result).toEqual(stepResponse);
      expect(driverUtils.doesDriverExist).toHaveBeenCalledWith(
        "foo",
        driverList
      );

      expect(jsonValidator.validate).toHaveBeenCalledTimes(2);
      expect(jsonValidator.validate).toHaveBeenCalledWith(
        body,
        authenticationSchema.returned.a
      );
      expect(jsonValidator.validate).toHaveBeenCalledWith(stepResponse, {
        $schema: "http://json-schema.org/draft-04/schema#",
        properties: {
          message: { type: "string" },
          success: { type: "boolean" }
        },
        required: ["success"],
        type: "object"
      });
    });

    it("should throw an error if the driver cannot be found", async () => {
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };
      const authenticationSchema = {
        returned: {
          a: {},
          b: {}
        }
      };
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(false))
      };
      const authenticationSteps = [
        { stepId: 0, type: "a" },
        { stepId: 1, type: "b" }
      ];

      const stepResponse = { response: "bla" };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps),
            authentication_step0: jest.fn().mockReturnValue(stepResponse)
          }
        }
      };

      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      const driverId = "foo";
      const step = 0;
      const body = { someprops: "bla" };
      try {
        await authenticate.authenticationStep(driverId, step, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("driver not found");
      }
    });

    it("should throw an error if the authentication step cannot be found", async () => {
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };
      const authenticationSchema = {
        returned: {
          a: {},
          b: {}
        }
      };
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const authenticationSteps = [];

      const stepResponse = { response: "bla" };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps),
            authentication_step0: jest.fn().mockReturnValue(stepResponse)
          }
        }
      };

      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      const driverId = "foo";
      const step = 0;
      const body = { someprops: "bla" };
      try {
        await authenticate.authenticationStep(driverId, step, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("authentication step not found");
      }
    });

    it("should throw an error if the body is invalid (does not match the schema)", async () => {
      const jsonValidator = {
        validate: jest
          .fn()
          .mockReturnValue({ errors: [{ error: "something went wrong" }] })
      };
      const authenticationSchema = {
        returned: {
          a: {},
          b: {}
        }
      };
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const authenticationSteps = [
        { stepId: 0, type: "a" },
        { stepId: 1, type: "b" }
      ];

      const stepResponse = { response: "bla" };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps),
            authentication_step0: jest.fn().mockReturnValue(stepResponse)
          }
        }
      };

      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      const driverId = "foo";
      const step = 0;
      const body = { someprops: "bla" };
      try {
        await authenticate.authenticationStep(driverId, step, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("the JSON body is invalid");
      }
    });

    it("should throw an error if the driver returns invalid json in response to the step", async () => {
      const jsonValidator = {
        validate: jest
          .fn()
          .mockReturnValueOnce({ errors: [] })
          .mockReturnValue({ errors: [{ error: "something went wrong" }] })
      };
      const authenticationSchema = {
        returned: {
          a: {},
          b: {}
        }
      };
      const driverUtils = {
        doesDriverExist: jest.fn().mockReturnValue(Promise.resolve(true))
      };
      const authenticationSteps = [
        { stepId: 0, type: "a" },
        { stepId: 1, type: "b" }
      ];

      const stepResponse = { response: "bla" };
      const driverList = {
        foo: {
          api: {
            authentication_getSteps: jest
              .fn()
              .mockReturnValue(authenticationSteps),
            authentication_step0: jest.fn().mockReturnValue(stepResponse)
          }
        }
      };

      const authenticate = authenticateModule(
        jsonValidator,
        authenticationSchema,
        driverUtils,
        driverList
      );

      const driverId = "foo";
      const step = 0;
      const body = { someprops: "bla" };
      try {
        await authenticate.authenticationStep(driverId, step, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("the driver produced invalid json");
      }
    });
  });
});
