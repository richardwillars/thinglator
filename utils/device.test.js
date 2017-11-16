const deviceModule = require('./device');

describe('utils/device', () => {
  describe('createDevice', () => {
    it('should create a device in the database', async () => {
      const md5 = jest.fn().mockReturnValue('md5Id');
      const lightModelMock = jest.fn();
      const deviceModelMock = jest.fn();
      const validateMock = jest.fn().mockReturnValue(Promise.resolve());
      const saveMock = jest.fn().mockReturnValue(Promise.resolve);
      const models = {
        light: {
          model: class model {
            constructor(props) {
              lightModelMock(props);
            }
            validate(args) { return validateMock(args); }
          },
        },
        device: {
          model: class model {
            constructor(props) {
              deviceModelMock(props);
            }
            save(args) { return saveMock(args); }
          },
        },
      };
      const deviceUtils = deviceModule(md5, models);

      await deviceUtils.createDevice('light', 'driverId', { foo: 'bar' });
      expect(lightModelMock).toHaveBeenCalledWith({ foo: 'bar' });
      expect(deviceModelMock).toHaveBeenCalledWith({
        _id: 'md5Id', driver: 'driverId', specs: {}, type: 'light',
      });
      expect(validateMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should catch validation errors and throw them', async () => {
      const md5 = jest.fn().mockReturnValue('md5Id');
      const lightModelMock = jest.fn();
      const deviceModelMock = jest.fn();
      const validateMock = jest.fn().mockReturnValue(Promise.resolve('validation error'));
      const saveMock = jest.fn().mockReturnValue(Promise.resolve);
      const models = {
        light: {
          model: class model {
            constructor(props) {
              lightModelMock(props);
            }
            validate(args) { return validateMock(args); }
          },
        },
        device: {
          model: class model {
            constructor(props) {
              deviceModelMock(props);
            }
            save(args) { return saveMock(args); }
          },
        },
      };
      const deviceUtils = deviceModule(md5, models);
      try {
        await deviceUtils.createDevice('light', 'driverId', { foo: 'bar' });
        expect(1).toEqual(2); // ensure we don't hit this and we actually go in the catch
      } catch (err) {
        expect(err.message).toEqual('validation error');
      }
    });
  });

  describe('updateDevice', () => {
    it('update a device in the database', async () => {
      const md5 = jest.fn().mockReturnValue('md5Id');
      const lightModelMock = jest.fn();
      const validateMock = jest.fn().mockReturnValue(Promise.resolve());
      const saveMock = jest.fn().mockReturnValue(Promise.resolve);
      const models = {
        light: {
          model: class model {
            constructor(props) {
              lightModelMock(props);
            }
            validate(args) { return validateMock(args); }
          },
        },
      };
      const deviceUtils = deviceModule(md5, models);

      const device = {
        type: 'light',
        specs: {},
        save: saveMock,
      };
      await deviceUtils.updateDevice(device, { foo: 'bar' });
      expect(lightModelMock).toHaveBeenCalledWith({ foo: 'bar' });
      expect(validateMock).toHaveBeenCalledTimes(1);
      expect(saveMock).toHaveBeenCalledTimes(1);
    });

    it('should catch validation errors and throw them', async () => {
      const md5 = jest.fn().mockReturnValue('md5Id');
      const lightModelMock = jest.fn();
      const validateMock = jest.fn().mockReturnValue(Promise.resolve('validation error'));
      const models = {
        light: {
          model: class model {
            constructor(props) {
              lightModelMock(props);
            }
            validate(args) { return validateMock(args); }
          },
        },
      };
      const deviceUtils = deviceModule(md5, models);

      const device = {
        type: 'light',
        specs: {},
      };

      try {
        await deviceUtils.updateDevice(device, { foo: 'bar' });
        expect(1).toEqual(2); // ensure we don't hit this and we actually go in the catch
      } catch (err) {
        expect(err.message).toEqual('validation error');
      }
    });
  });
});
