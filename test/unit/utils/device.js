const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

describe('utils/device', () => {
    let moduleToBeTested,
        app,
        drivers;
    let modelsMock;


    afterEach((done) => {
        mockery.deregisterMock('../models');
        mockery.disable();
        done();
    });

    describe('createDevice', () => {
        it('should create a new device', (done) => {
            modelsMock = {
                light: {
                    Model(deviceSpecs) {
                        deviceSpecs.validate = function () {
                            return Promise.resolve();
                        };
                        return deviceSpecs;
                    }
                },

                device: {
                    Model(props) {
                        return {
                            save() {
                                return Promise.resolve(props);
                            }
                        };
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

			// call the module to be tested
            moduleToBeTested = require('../../../utils/device');


            const type = 'light';
            const driver = 'foo';
            const deviceSpecs = {
                foo: 'bar',
                bee: 'boo'
            };
            const promise = moduleToBeTested.createDevice(type, driver, deviceSpecs);
            expect(promise).to.be.an.object;

            promise.then((result) => {
                expect(result._id).to.equal('8dcc4387d8e0de6cf7ce74a278ce24c0');
                expect(result.type).to.equal('light');
                expect(result.driver).to.equal('foo');
                expect(result.specs.foo).to.equal('bar');
                expect(result.specs.bee).to.equal('boo');
                done();
            });
        });

        it('should have error validation', (done) => {
            modelsMock = {
                light: {
                    Model(deviceSpecs) {
                        deviceSpecs.validate = function () {
                            return Promise.resolve('errrrooorrr');
                        };
                        return deviceSpecs;
                    }
                },

                device: {
                    Model(props) {
                        return {
                            save() {
                                return Promise.resolve(props);
                            }
                        };
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

			// call the module to be tested
            moduleToBeTested = require('../../../utils/device');


            const type = 'light';
            const driver = 'foo';
            const deviceSpecs = {
                foo: 'bar',
                bee: 'boo'
            };
            const promise = moduleToBeTested.createDevice(type, driver, deviceSpecs);
            expect(promise).to.be.an.object;

            promise.catch((err) => {
                expect(err.message).to.equal('errrrooorrr');
                expect(err.type).to.equal('Validation');
                done();
            });
        });
    });

    describe('updateDevice', () => {
        it('should update an existing device', (done) => {
            modelsMock = {
                light: {
                    Model(deviceSpecs) {
                        deviceSpecs.validate = function () {
                            return Promise.resolve();
                        };
                        return deviceSpecs;
                    }
                },

                device: {
                    Model(props) {
                        return {
                            save() {
                                return Promise.resolve(props);
                            }
                        };
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

			// call the module to be tested
            moduleToBeTested = require('../../../utils/device');

            const device = {
                type: 'light',
                driver: 'foo',
                specs: {
                    foo: 'bar',
                    bee: 'boo'
                },
                save() {
                    return Promise.resolve(this);
                }
            };

            const newSpecs = {
                foo: 'bar',
                bee: 'boo2'
            };

            const promise = moduleToBeTested.updateDevice(device, newSpecs);
            expect(promise).to.be.an.object;

            promise.then((result) => {
                expect(result.type).to.equal('light');
                expect(result.driver).to.equal('foo');
                expect(result.specs.foo).to.equal('bar');
                expect(result.specs.bee).to.equal('boo2');
                done();
            });
        });

        it('should have error validation', (done) => {
            modelsMock = null;
            modelsMock = {
                light: {
                    Model(deviceSpecs) {
                        deviceSpecs.validate = function () {
                            return Promise.resolve('errrrooorrr');
                        };
                        return deviceSpecs;
                    }
                },

                device: {
                    Model(props) {
                        return {
                            save() {
                                return Promise.resolve(props);
                            }
                        };
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

			// call the module to be tested
            moduleToBeTested = require('../../../utils/device');

            const device = {
                type: 'light',
                driver: 'foo',
                specs: {
                    foo: 'bar',
                    bee: 'boo'
                },
                save() {
                    return Promise.resolve(this);
                }
            };

            const newSpecs = {
                foo: 'bar',
                bee: 'boo2'
            };

            const promise = moduleToBeTested.updateDevice(device, newSpecs);
            expect(promise).to.be.an.object;

            promise.catch((err) => {
                expect(err.message).to.equal('errrrooorrr');
                expect(err.type).to.equal('Validation');
                done();
            });
        });
    });
});
