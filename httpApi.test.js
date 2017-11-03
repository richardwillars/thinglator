const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const mockery = require('mockery');

const expect = chai.expect;
chai.use(sinonChai);


describe('httpApi', () => {
    let moduleToBeTested,
        app,
        drivers;

    beforeEach((done) => {
      // mock out app
        app = {
            use(fn) {},
            get(path, cb) {},
            post(path, cb) {}
        };

        // mock out drivers
        drivers = {};

        done();
    });

    it('should setup an error listener', () => {
        const cb = sinon.spy();
        app.use = cb;
        // call the module to be tested
        moduleToBeTested = require('../httpApi')(app, drivers);
        expect(cb).to.have.been.calledOnce;
    });

    it('the error listener should handle different types of errors correctly', () => {
      // capture the error handler function..
        let errorHandler;
        app.use = function (fn) {
            errorHandler = fn;
        };
        moduleToBeTested = require('../httpApi')(app, drivers);

        // build up a fake call to the error handler function..
        const reqObject = {};
        const resObject = {};
        const next = function () {};

        const resStatusCb = sinon.spy();
        const resJsonCb = sinon.spy();

        resObject.status = sinon.spy();
        resObject.json = sinon.spy();

        var errorObject = {
            foo: 'bar'
        };
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(500);
        expect(resObject.json).to.have.been.calledWith({
            type: 'Internal'
        });

        var errorObject = {
            foo: 'bar'
        };
        errorObject.stack = [
            'bla', 'bla', 'bla'
        ];
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(500);
        expect(resObject.json).to.have.been.calledWith({
            type: 'Internal'
        });

        var errorObject = new Error('This is a driver error');
        errorObject.type = 'Driver';
        errorObject.driver = 'lifx';
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(500);
        expect(resObject.json).to.have.been.calledWith({
            type: 'Driver',
            driver: 'lifx',
            message: 'This is a driver error'
        });

        var errorObject = new Error('This is a bad request');
        errorObject.type = 'BadRequest';
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(400);
        expect(resObject.json).to.have.been.calledWith({
            type: 'BadRequest',
            message: 'This is a bad request'
        });

        var errorObject = new Error('This is not found');
        errorObject.type = 'NotFound';
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(404);
        expect(resObject.json).to.have.been.calledWith({
            type: 'NotFound',
            message: 'This is not found'
        });

        var errorObject = new Error('This is validation');
        errorObject.type = 'Validation';
        errorObject.errors = {
            foo: 'bar'
        };
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(400);
        expect(resObject.json).to.have.been.calledWith({
            type: 'Validation',
            message: 'This is validation',
            errors: {
                foo: 'bar'
            }
        });

        var errorObject = new Error('This is connection');
        errorObject.type = 'Connection';
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(503);
        expect(resObject.json).to.have.been.calledWith({
            type: 'Connection',
            message: 'This is connection'
        });

        var errorObject = new Error('This is authentication');
        errorObject.type = 'Authentication';
        errorHandler(errorObject, reqObject, resObject, next);
        expect(resObject.status).to.have.been.calledWith(401);
        expect(resObject.json).to.have.been.calledWith({
            type: 'Authentication',
            message: 'This is authentication'
        });
    });

    describe('API calls', () => {
        const paths = {};
        let authenticateCtrlMock;

        beforeEach((done) => {
          // capture the get handler function..
            app.get = function (path, fn) {
                paths[path] = fn;
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            // mock out authenticateCtrl, deviceCtrl, eventCtrl, driverCtrl
            authenticateCtrlMock = {
                getAuthenticationProcess(driver, type, drivers) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                },
                authenticationStep(driver, type, drivers, stepId, body) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                }
            };
            driverCtrlMock = {
                discover(driver, type, drivers) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                },
                getDriversWithStats(drivers) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                }
            };
            deviceCtrlMock = {
                getAllDevices() {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                },
                getDevicesByType(type) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                },
                getDevicesByTypeAndDriver(type, driverId) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                },
                getDeviceById(deviceId) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                },
                runCommand(deviceId, command, body, drivers) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                }
            };
            eventCtrlMock = {
                getEventsByType(type, from) {
                    return Promise.resolve({
                        foo: 'bar'
                    });
                }
            };
            mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
            mockery.registerMock('./controllers/driver', driverCtrlMock);
            mockery.registerMock('./controllers/device', deviceCtrlMock);
            mockery.registerMock('./controllers/event', eventCtrlMock);

            done();
        });

        afterEach((done) => {
            mockery.deregisterMock('./controllers/authenticate');
            mockery.deregisterMock('./controllers/driver');
            mockery.deregisterMock('./controllers/device');
            mockery.deregisterMock('./controllers/event');
            mockery.disable();
            done();
        });

        describe('GET /', () => {
            it('it should setup a route', () => {
                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/']).to.equal('function');
            });

            it('it should call the correct controller method when called', () => {
                const req = {};
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/'](req, res, next);

                expect(res.json).to.have.been.calledWith({
                    Thinglator: 'Oh, hi!'
                });
            });
        });

        describe('GET /authenticate/:driver', () => {
            const paths = {};
            let getAuthenticationProcessSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getAuthenticationProcessSpy = sinon.spy(authenticateCtrlMock, 'getAuthenticationProcess');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/authenticate/:driver']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/authenticate/:driver'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                    // check that the controller method is called
                    expect(getAuthenticationProcessSpy).to.have.been.calledWith(req.params.driver, {});

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/authenticate');
                const err = new Error('something went wrong 1');
                authenticateCtrlMock = {
                    getAuthenticationProcess(driver, type, drivers) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/authenticate/:driver'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('POST /authenticate/:driver/:stepId', () => {
            const paths = {};
            let getAuthenticationProcessSpy;
            beforeEach((done) => {
              // capture the post handler function..
                app.post = function (path, jsonParser, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                authenticationStepSpy = sinon.spy(authenticateCtrlMock, 'authenticationStep');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/authenticate/:driver/:stepId']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar',
                        stepId: 0
                    },
                    body: {
                        body: 'here'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/authenticate/:driver/:stepId'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(authenticationStepSpy).to.have.been.calledWith(req.params.driver, {}, req.params.stepId, req.body);

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/authenticate');
                const err = new Error('something went wrong 2');
                authenticateCtrlMock = {
                    authenticationStep(driverId, type, drivers, stepId, body) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/authenticate', authenticateCtrlMock);
                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar',
                        stepId: 0
                    },
                    body: {
                        body: 'here'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/authenticate/:driver/:stepId'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /discover/:driver', () => {
            const paths = {};
            let getAuthenticationProcessSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                discoverSpy = sinon.spy(driverCtrlMock, 'discover');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/discover/:driver']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/discover/:driver'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(discoverSpy).to.have.been.calledWith(req.params.driver, {});

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/driver');
                const err = new Error('something went wrong 3');
                driverCtrlMock = {
                    discover(drivers) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/driver', driverCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/discover/:driver'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /devices', () => {
            const paths = {};
            let getAllDevicesSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getAllDevicesSpy = sinon.spy(deviceCtrlMock, 'getAllDevices');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/devices']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {};
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/devices'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(getAllDevicesSpy).to.have.been.calledOnce;

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/device');
                const err = new Error('something went wrong 4');
                deviceCtrlMock = {
                    getAllDevices() {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/device', deviceCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {};
                const res = {};
                const next = sinon.spy();

                paths['/devices'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /devices/type/:type', () => {
            const paths = {};
            let getDevicesByTypeSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getDevicesByTypeSpy = sinon.spy(deviceCtrlMock, 'getDevicesByType');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/devices/type/:type']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        type: 'foo'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/devices/type/:type'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(getDevicesByTypeSpy).to.have.been.calledWith(req.params.type);

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/device');
                const err = new Error('something went wrong 5');
                deviceCtrlMock = {
                    getDevicesByType(type) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/device', deviceCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        type: 'foo'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/devices/type/:type'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /devices/driver/:driver', () => {
            const paths = {};
            let getDevicesByTypeAndDriverSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getDevicesByTypeAndDriverSpy = sinon.spy(deviceCtrlMock, 'getDevicesByTypeAndDriver');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/devices/driver/:driver']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/devices/driver/:driver'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(getDevicesByTypeAndDriverSpy).to.have.been.calledWith(req.params.type, req.params.driver);

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/device');
                const err = new Error('something went wrong 6');
                deviceCtrlMock = {
                    getDevicesByTypeAndDriver(type, driverId) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/device', deviceCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        type: 'foo',
                        driver: 'bar'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/devices/driver/:driver'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /device/:deviceId', () => {
            const paths = {};
            let getDeviceByIdSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getDeviceByIdSpy = sinon.spy(deviceCtrlMock, 'getDeviceById');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/device/:deviceId']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        deviceId: 'foo'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/device/:deviceId'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(getDeviceByIdSpy).to.have.been.calledWith(req.params.deviceId);

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/device');
                const err = new Error('something went wrong 7');
                deviceCtrlMock = {
                    getDeviceById(driverId) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/device', deviceCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        deviceId: 'foo'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/device/:deviceId'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('POST /device/:deviceId/:command', () => {
            const paths = {};
            let runCommandSpy;
            beforeEach((done) => {
              // capture the post handler function..
                app.post = function (path, jsonParser, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                runCommandSpy = sinon.spy(deviceCtrlMock, 'runCommand');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/device/:deviceId/:command']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        deviceId: 'foo',
                        command: 'bar'
                    },
                    body: {
                        foo: 'bar'
                    }
                };
                const res = {
                    send: sinon.spy()
                };
                const next = function () {};

                paths['/device/:deviceId/:command'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(runCommandSpy).to.have.been.calledWith(req.params.deviceId, req.params.command, req.body, {});

                    // check that res.send is called with the response.
                    expect(res.send).to.have.been.calledOnce;

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/device');
                const err = new Error('something went wrong 8');
                deviceCtrlMock = {
                    runCommand(deviceId, command, body, drivers) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/device', deviceCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        deviceId: 'foo',
                        command: 'bar'
                    },
                    body: {
                        foo: 'bar'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/device/:deviceId/:command'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /drivers', () => {
            const paths = {};
            let getDriversWithStatsSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getDriversWithStatsSpy = sinon.spy(driverCtrlMock, 'getDriversWithStats');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/drivers']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {};
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/drivers'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(getDriversWithStatsSpy).to.have.been.calledWith({});

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/driver');
                const err = new Error('something went wrong 9');
                driverCtrlMock = {
                    getDriversWithStats(deviceId, command, body, drivers) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/driver', driverCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {};
                const res = {};
                const next = sinon.spy();

                paths['/drivers'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });

        describe('GET /event/:eventType', () => {
            const paths = {};
            let getEventsByTypeSpy;
            beforeEach((done) => {
              // capture the get handler function..
                app.get = function (path, fn) {
                    paths[path] = fn;
                };
                done();
            });
            it('it should setup a route', () => {
                getEventsByTypeSpy = sinon.spy(eventCtrlMock, 'getEventsByType');

                moduleToBeTested = require('../httpApi')(app, drivers);
                expect(typeof paths['/event/:eventType']).to.equal('function');
            });

            it('it should call the correct controller method when called', (done) => {
                const req = {
                    params: {
                        type: 'foo'
                    },
                    query: {
                        from: 'bar'
                    }
                };
                const res = {
                    json: sinon.spy()
                };
                const next = function () {};

                paths['/event/:eventType'](req, res, next);


                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that the controller method is called
                    expect(getEventsByTypeSpy).to.have.been.calledWith(req.params.eventType, req.query.from);

                    // check that res.json is called with the response.
                    expect(res.json).to.have.been.calledWith({
                        foo: 'bar'
                    });

                    done();
                }, 0);
            });

            it('it should handle errors accordingly', (done) => {
                mockery.deregisterMock('./controllers/event');
                const err = new Error('something went wrong 10');
                eventCtrlMock = {
                    getEventsByType(eventType, from) {
                        return Promise.reject(err);
                    }
                };
                mockery.registerMock('./controllers/event', eventCtrlMock);

                moduleToBeTested = require('../httpApi')(app, drivers);

                const req = {
                    params: {
                        type: 'foo'
                    },
                    query: {
                        from: 'bar'
                    }
                };
                const res = {};
                const next = sinon.spy();

                paths['/event/:eventType'](req, res, next);

                // We put it in a timeout to ensure the promise executes first
                setTimeout(() => {
                  // check that next is called with the error
                    expect(next).to.have.been.calledWith(err);
                    done();
                }, 0);
            });
        });
    });
});
