const httpApiModule = require('./httpApi');

describe('httpApi', () => {
  it('should return the app object', () => {
    const bodyParser = {
      json: jest.fn(),
    };
    const authenticateCtrl = {};
    const eventCtrl = {};
    const driverCtrl = {};
    const app = {
      get: jest.fn(),
      post: jest.fn(),
      use: jest.fn(),
    };
    const drivers = {};
    const httpApi = httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

    expect(httpApi).toEqual(app);
  });
  describe('error handler', () => {
    it('should setup an error listener', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      expect(typeof app.use.mock.calls[0][0]).toEqual('function');
    });

    it('should handle Driver errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'Driver';
      err.driver = 'DriverId';

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        type: 'Driver',
        driver: 'DriverId',
        message: 'Error message',
      });
    });

    it('should handle BadRequest errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'BadRequest';

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        type: 'BadRequest',
        message: 'Error message',
      });
    });

    it('should be handle NotFound errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'NotFound';

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        type: 'NotFound',
        message: 'Error message',
      });
    });

    it('should handle Validation errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'Validation';
      err.errors = {
        foo: 'bar',
      };

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        type: 'Validation',
        errors: { foo: 'bar' },
        message: 'Error message',
      });
    });

    it('should handle Connection errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'Connection';

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(503);
      expect(res.json).toHaveBeenCalledWith({
        type: 'Connection',
        message: 'Error message',
      });
    });

    it('should handle Authentication errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'Authentication';

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        type: 'Authentication',
        message: 'Error message',
      });
    });

    it('should handle Internal errors', () => {
      const bodyParser = {
        json: jest.fn(),
      };
      const authenticateCtrl = {};
      const eventCtrl = {};
      const driverCtrl = {};
      const app = {
        get: jest.fn(),
        post: jest.fn(),
        use: jest.fn(),
      };
      const drivers = {};
      httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);

      expect(app.use).toHaveBeenCalledTimes(1);
      const errorHandler = app.use.mock.calls[0][0];

      const err = new Error('Error message');
      err.type = 'Unknown';

      const req = {};
      const res = {
        status: jest.fn(),
        json: jest.fn(),
      };
      const next = jest.fn();
      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        type: 'Internal',
      });
    });
  });

  describe('Endpoints', () => {
    describe('/', () => {
      it('should return json', () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const eventCtrl = {};
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[0][0]).toEqual('/');
        const callback = app.get.mock.calls[0][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        callback(req, res);
        expect(res.json).toHaveBeenCalledWith({ Thinglator: 'Oh, hi!' });
      });
    });

    describe('/authenticate/:driver', () => {
      it('should return json from authenticateCtrl.getAuthenticationProcess', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {
          getAuthenticationProcess: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[1][0]).toEqual('/authenticate/:driver');
        const callback = app.get.mock.calls[1][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(authenticateCtrl.getAuthenticationProcess).toHaveBeenCalledWith(req.params.driver, drivers);
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {
          getAuthenticationProcess: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[1][0]).toEqual('/authenticate/:driver');
        const callback = app.get.mock.calls[1][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/authenticate/:driver/:stepId', () => {
      it('should return json from authenticateCtrl.authenticationStep', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {
          authenticationStep: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.post.mock.calls[0][0]).toEqual('/authenticate/:driver/:stepId');
        const callback = app.post.mock.calls[0][2];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
            stepId: 'stepId',
          },
          body: 'body',
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(authenticateCtrl.authenticationStep).toHaveBeenCalledWith(req.params.driver, req.params.stepId, req.body);
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {
          authenticationStep: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.post.mock.calls[0][0]).toEqual('/authenticate/:driver/:stepId');
        const callback = app.post.mock.calls[0][2];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
            stepId: 'stepId',
          },
          body: 'body',
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/discover/:driver', () => {
      it('should return json from driverCtrl.discover', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          discover: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[2][0]).toEqual('/discover/:driver');
        const callback = app.get.mock.calls[2][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.discover).toHaveBeenCalledWith(req.params.driver, drivers);
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          discover: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[2][0]).toEqual('/discover/:driver');
        const callback = app.get.mock.calls[2][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/devices', () => {
      it('should return json from driverCtrl.getAllDevices', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getAllDevices: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[3][0]).toEqual('/devices');
        const callback = app.get.mock.calls[3][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getAllDevices).toHaveBeenCalledWith();
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getAllDevices: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[3][0]).toEqual('/devices');
        const callback = app.get.mock.calls[3][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/devices/type/:type', () => {
      it('should return json from driverCtrl.getDevicesByType', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getDevicesByType: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[4][0]).toEqual('/devices/type/:type');
        const callback = app.get.mock.calls[4][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            type: 'type',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getDevicesByType).toHaveBeenCalledWith('type');
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getDevicesByType: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[4][0]).toEqual('/devices/type/:type');
        const callback = app.get.mock.calls[4][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            type: 'type',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/devices/driver/:driver', () => {
      it('should return json from driverCtrl.getDevicesByDriver', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getDevicesByDriver: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[5][0]).toEqual('/devices/driver/:driver');
        const callback = app.get.mock.calls[5][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getDevicesByDriver).toHaveBeenCalledWith('driverId');
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getDevicesByDriver: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[5][0]).toEqual('/devices/driver/:driver');
        const callback = app.get.mock.calls[5][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            driver: 'driverId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/device/:deviceId', () => {
      it('should return json from driverCtrl.getDeviceById', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getDeviceById: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[6][0]).toEqual('/device/:deviceId');
        const callback = app.get.mock.calls[6][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            deviceId: 'deviceId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getDeviceById).toHaveBeenCalledWith('deviceId');
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getDeviceById: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[6][0]).toEqual('/device/:deviceId');
        const callback = app.get.mock.calls[6][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            deviceId: 'deviceId',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/device/:deviceId/runCommand', () => {
      it('should return json from driverCtrl.runCommand', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          runCommand: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.post.mock.calls[1][0]).toEqual('/device/:deviceId/:command');
        const callback = app.post.mock.calls[1][2];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            deviceId: 'deviceId',
            command: 'command',
          },
          body: 'body',
        };
        const res = {
          send: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.runCommand).toHaveBeenCalledWith(req.params.deviceId, req.params.command, req.body, drivers);
        expect(res.send).toHaveBeenCalledWith();
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          runCommand: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.post.mock.calls[1][0]).toEqual('/device/:deviceId/:command');
        const callback = app.post.mock.calls[1][2];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            deviceId: 'deviceId',
            command: 'command',
          },
          body: 'body',
        };
        const res = {
          send: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.send).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/drivers', () => {
      it('should return json from driverCtrl.getDriversWithStats', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getDriversWithStats: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[7][0]).toEqual('/drivers');
        const callback = app.get.mock.calls[7][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getDriversWithStats).toHaveBeenCalledWith(drivers);
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getDriversWithStats: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[7][0]).toEqual('/drivers');
        const callback = app.get.mock.calls[7][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/drivers/commands', () => {
      it('should return json from driverCtrl.getCommandDescriptions', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getCommandDescriptions: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[8][0]).toEqual('/drivers/commands');
        const callback = app.get.mock.calls[8][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getCommandDescriptions).toHaveBeenCalledWith();
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getCommandDescriptions: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[8][0]).toEqual('/drivers/commands');
        const callback = app.get.mock.calls[8][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/drivers/events', () => {
      it('should return json from driverCtrl.getEventDescriptions', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const driverCtrl = {
          getEventDescriptions: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[9][0]).toEqual('/drivers/events');
        const callback = app.get.mock.calls[9][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(driverCtrl.getEventDescriptions).toHaveBeenCalledWith();
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const driverCtrl = {
          getEventDescriptions: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const eventCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[9][0]).toEqual('/drivers/events');
        const callback = app.get.mock.calls[9][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/event/latestCommands', () => {
      it('should return json from eventCtrl.getLatestCommandEvents', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const eventCtrl = {
          getLatestCommandEvents: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[10][0]).toEqual('/event/latestCommands');
        const callback = app.get.mock.calls[10][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(eventCtrl.getLatestCommandEvents).toHaveBeenCalledWith();
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const eventCtrl = {
          getLatestCommandEvents: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const driverCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[10][0]).toEqual('/event/latestCommands');
        const callback = app.get.mock.calls[10][1];
        expect(typeof callback).toEqual('function');
        const req = {};
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });

    describe('/event/:eventType', () => {
      it('should return json from eventCtrl.getEventsByType', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const authenticateCtrl = {};
        const eventCtrl = {
          getEventsByType: jest.fn().mockReturnValue(Promise.resolve({ foo: 'bar' })),
        };
        const driverCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[11][0]).toEqual('/event/:eventType');
        const callback = app.get.mock.calls[11][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            eventType: 'eventType',
          },
          query: {
            from: 'from',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(eventCtrl.getEventsByType).toHaveBeenCalledWith(req.params.eventType, req.query.from);
        expect(res.json).toHaveBeenCalledWith({ foo: 'bar' });
        expect(next).toHaveBeenCalledTimes(0);
      });

      it('should catch any errors and pass them to the next callback', async () => {
        const bodyParser = {
          json: jest.fn(),
        };
        const eventCtrl = {
          getEventsByType: jest.fn().mockReturnValue(Promise.reject({ foo: 'bar' })),
        };
        const driverCtrl = {};
        const authenticateCtrl = {};
        const app = {
          get: jest.fn(),
          post: jest.fn(),
          use: jest.fn(),
        };
        const drivers = {};
        httpApiModule(bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers);
        expect(app.get.mock.calls[11][0]).toEqual('/event/:eventType');
        const callback = app.get.mock.calls[11][1];
        expect(typeof callback).toEqual('function');
        const req = {
          params: {
            eventType: 'eventType',
          },
          query: {
            from: 'from',
          },
        };
        const res = {
          json: jest.fn(),
        };
        const next = jest.fn();
        await callback(req, res, next);
        expect(res.json).toHaveBeenCalledTimes(0);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith({ foo: 'bar' });
      });
    });
  });
});
