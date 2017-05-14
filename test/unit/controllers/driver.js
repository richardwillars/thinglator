

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

let moduleToBeTested;

describe('controllers/driver', () => {
    let modelsMock;

    afterEach((done) => {
        mockery.deregisterMock('../models');
        mockery.deregisterMock('../utils/driver');
        mockery.deregisterMock('../utils/device');
        mockery.disable();
        done();
    });

    describe('getDriversWithStats', () => {
        it('should return a list of drivers with stats', () => {
            const deviceModel = {
                aggregate() {},
                exec() {}
            };

            const aggregateStub = sinon.stub(deviceModel, 'aggregate', () => deviceModel);


            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve([
					{ _id: 'driverA', type: 'foo', deviceCount: 3 },
  					{ _id: 'driverB', type: 'bar', deviceCount: 2 },
  					{ _id: 'driverC', type: 'foo', deviceCount: 1 }
  				]));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../controllers/driver');

            const drivers = {
                driverA: new class DriverADriver {
                    getName() {
                        return 'driverA';
                    }
                    getType() {
                        return 'foo';
                    }
				}(),
                driverB: new class DriverBDriver {
                    getName() {
                        return 'driverB';
                    }
                    getType() {
                        return 'bar';
                    }
				}(),
                driverC: new class DriverCDriver {
                    getName() {
                        return 'driverC';
                    }
                    getType() {
                        return 'foo';
                    }
				}()
            };

            expect(moduleToBeTested.getDriversWithStats).to.be.a.function;
            return moduleToBeTested.getDriversWithStats(drivers)
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([
						{ _id: 'driverA', type: 'foo', deviceCount: 3 },
						{ _id: 'driverB', type: 'bar', deviceCount: 2 },
						{ _id: 'driverC', type: 'foo', deviceCount: 1 }
    ]));

    expect(aggregateStub).to.have.been.calledOnce;
    expect(aggregateStub).to.have.been.calledWith([{
        $group: {
            _id: '$driver',
            type: {
                $first: '$type'
            },
            deviceCount: {
                $sum: 1
            }
        }
    }]);

    expect(execStub).to.have.been.calledOnce;
});
        });

        it('should catch any errors and throw them up the promise', () => {
            const deviceModel = {
                aggregate() {},
                exec() {}
            };

            const aggregateStub = sinon.stub(deviceModel, 'aggregate', () => deviceModel);

            const err = new Error('something went wrong');
            err.type = 'BadRequest';

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.reject(err));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            const drivers = {};

            moduleToBeTested = require('../../../controllers/driver');
            expect(moduleToBeTested.getDriversWithStats).to.be.a.function;
            return moduleToBeTested.getDriversWithStats(drivers).catch((errThrown) => {
                expect(errThrown).to.equal(err);
            });
        });
    });

    describe('discover', () => {
        it('should return a list of discovered devices from a driver', () => {
            const driverUtilsMock = {
                doesDriverExist() {}
            };
            const doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', () => Promise.resolve(true));

            const deviceUtilsMock = {
                updateDevice() {},
                createDevice() {}
            };
            const updateDeviceMock = sinon.stub(deviceUtilsMock, 'updateDevice', () => Promise.resolve(true));
            const createDeviceMock = sinon.stub(deviceUtilsMock, 'createDevice', () => Promise.resolve(true));

            const driverFooDriver = new class DriverFooDriver {
                discover() {}
                initDevices() {}
			}();

            const discoverMock = sinon.stub(driverFooDriver, 'discover', () => [
                {
                    deviceId: 'deviceA',
    					name: 'DeviceA',
					    address: '192.168.1.1',
					    capabilities: {
					    	doSomething: true
					    }
                },
                {
                    deviceId: 'deviceB',
    					name: 'DeviceB',
					    address: '192.168.1.2',
					    capabilities: {
					    	doSomething: true
					    }
                },
                {
                    deviceId: 'deviceC',
    					name: 'DeviceC',
					    address: '192.168.1.3',
					    capabilities: {
					    	doSomething: true
					    }
                }
            ]);

            const initDevicesMock = sinon.stub(driverFooDriver, 'initDevices', () => Promise.resolve());

            const deviceModel = {
                find() {},
                remove() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const removeStub = sinon.stub(deviceModel, 'remove', () => deviceModel);


            const execCallback1 = function () {
                return Promise.resolve([
                    {
                        _id: '13c5295b5e55cdc347c6e05d0acfce3c',
					    type: 'foo',
					    driver: 'driverFoo',
					    specs: {
        deviceId: 'deviceB',
        name: 'DeviceB',
        address: '192.168.1.2',
        capabilities: {}
					   }
                    },
                    {
                        _id: '13c5295b5e55cdc347c6e05d0acfce3d',
					    type: 'foo',
					    driver: 'driverFoo',
					    specs: {
        deviceId: 'deviceD',
        name: 'DeviceD',
        address: '192.168.1.4',
        capabilities: {}
					   }
                    }
    			]);
            };

            const execCallback2 = function () {
                return Promise.resolve();
            };

            const execCallback3 = function () {
                return Promise.resolve([
					{ _id: 'deviceAId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceA', name: 'DeviceA', address: '192.168.1.1', capabilities: {} } },
					{ _id: 'deviceBId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceB', name: 'DeviceB', address: '192.168.1.2', capabilities: {} } },
					{ _id: 'deviceCId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceC', name: 'DeviceC', address: '192.168.1.3', capabilities: {} } }
                ]);
            };

            const execStub = sinon.stub(deviceModel, 'exec');
            execStub.onCall(0).returns(execCallback1.bind()());
            execStub.onCall(1).returns(execCallback2.bind()());
            execStub.onCall(2).returns(execCallback3.bind()());

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };


            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('../utils/driver', driverUtilsMock);
            mockery.registerMock('../utils/device', deviceUtilsMock);


            moduleToBeTested = require('../../../controllers/driver');

            const drivers = {
                driverFoo: driverFooDriver
            };

            expect(moduleToBeTested.discover).to.be.a.function;
            return moduleToBeTested.discover('driverFoo', 'foo', drivers)
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([
						{ _id: 'deviceAId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceA', name: 'DeviceA', address: '192.168.1.1', capabilities: {} } },
						{ _id: 'deviceBId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceB', name: 'DeviceB', address: '192.168.1.2', capabilities: {} } },
						{ _id: 'deviceCId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceC', name: 'DeviceC', address: '192.168.1.3', capabilities: {} } }
    ]));

    expect(doesDriverExistMock).to.have.been.calledOnce;
    expect(doesDriverExistMock).to.have.been.calledWith('driverFoo', 'foo');

    expect(execStub).to.have.been.calledThrice;

    expect(discoverMock).to.have.been.calledOnce;
    expect(findStub).to.have.been.calledTwice;
    expect(findStub.firstCall).to.have.been.calledWith({
        type: 'foo',
        driver: 'driverFoo'
    });

    expect(updateDeviceMock).to.have.been.calledOnce;
    expect(updateDeviceMock).to.have.been.calledWith({
					  _id: '13c5295b5e55cdc347c6e05d0acfce3c',
					  driver: 'driverFoo',
					  specs: {
					  	address: '192.168.1.2',
					  	capabilities: {},
					  	deviceId: 'deviceB',
					  	name: 'DeviceB'
					  },
					  type: 'foo'
    },
        {
					  address: '192.168.1.2',
					  capabilities: { doSomething: true },
					  deviceId: 'deviceB',
					  name: 'DeviceB'
        });

    expect(removeStub).to.have.been.calledOnce;
    expect(removeStub).to.have.been.calledWith({
        _id: {
            $in: ['13c5295b5e55cdc347c6e05d0acfce3d']
        }
    });

    expect(createDeviceMock).to.have.been.calledTwice;
    expect(createDeviceMock.firstCall).to.have.been.calledWith('foo', 'driverFoo', {
					  address: '192.168.1.1',
					  capabilities: { doSomething: true },
					  deviceId: 'deviceA',
					  name: 'DeviceA'
    });
    expect(createDeviceMock.secondCall).to.have.been.calledWith('foo', 'driverFoo', {
					  address: '192.168.1.3',
					  capabilities: { doSomething: true },
					  deviceId: 'deviceC',
					  name: 'DeviceC'
    });

    expect(findStub.secondCall).to.have.been.calledWith({
        type: 'foo',
        driver: 'driverFoo'
    });

    expect(initDevicesMock).to.have.been.calledOnce;
    expect(initDevicesMock).to.have.been.calledWith([{
					  _id: 'deviceAId',
					  driver: 'driverFoo',
					  specs: { address: '192.168.1.1', capabilities: { }, deviceId: 'deviceA', name: 'DeviceA' },
					  type: 'foo'
    }, {
					  _id: 'deviceBId',
					  driver: 'driverFoo',
					  specs: { address: '192.168.1.2', capabilities: { }, deviceId: 'deviceB', name: 'DeviceB' },
					  type: 'foo'
    }, {
					  _id: 'deviceCId',
					  driver: 'driverFoo',
					  specs: { address: '192.168.1.3', capabilities: { }, deviceId: 'deviceC', name: 'DeviceC' },
					  type: 'foo'
    }]);
});
        });

        it('should return a list of discovered devices from a driver, even if there are no existing ones that no longer exist', () => {
            const driverUtilsMock = {
                doesDriverExist() {}
            };
            const doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', () => Promise.resolve(true));

            const deviceUtilsMock = {
                updateDevice() {},
                createDevice() {}
            };
            const updateDeviceMock = sinon.stub(deviceUtilsMock, 'updateDevice', () => Promise.resolve(true));
            const createDeviceMock = sinon.stub(deviceUtilsMock, 'createDevice', () => Promise.resolve(true));

            const driverFooDriver = new class DriverFooDriver {
                discover() {}
                initDevices() {}
			}();

            const discoverMock = sinon.stub(driverFooDriver, 'discover', () => [
                {
                    deviceId: 'deviceA',
    					name: 'DeviceA',
					    address: '192.168.1.1',
					    capabilities: {
					    	doSomething: true
					    }
                },
                {
                    deviceId: 'deviceB',
    					name: 'DeviceB',
					    address: '192.168.1.2',
					    capabilities: {
					    	doSomething: true
					    }
                },
                {
                    deviceId: 'deviceC',
    					name: 'DeviceC',
					    address: '192.168.1.3',
					    capabilities: {
					    	doSomething: true
					    }
                }
            ]);

            const initDevicesMock = sinon.stub(driverFooDriver, 'initDevices', () => Promise.resolve());

            const deviceModel = {
                find() {},
                remove() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const removeStub = sinon.stub(deviceModel, 'remove', () => deviceModel);


            const execCallback1 = function () {
                return Promise.resolve([
                    {
                        _id: '13c5295b5e55cdc347c6e05d0acfce3c',
					    type: 'foo',
					    driver: 'driverFoo',
					    specs: {
        deviceId: 'deviceB',
        name: 'DeviceB',
        address: '192.168.1.2',
        capabilities: {}
					   }
                    }
    			]);
            };

            const execCallback2 = function () {
                return Promise.resolve([
					{ _id: 'deviceAId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceA', name: 'DeviceA', address: '192.168.1.1', capabilities: {} } },
					{ _id: 'deviceBId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceB', name: 'DeviceB', address: '192.168.1.2', capabilities: {} } },
					{ _id: 'deviceCId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceC', name: 'DeviceC', address: '192.168.1.3', capabilities: {} } }
                ]);
            };

            const execStub = sinon.stub(deviceModel, 'exec');
            execStub.onCall(0).returns(execCallback1.bind()());
            execStub.onCall(1).returns(execCallback2.bind()());

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('../utils/driver', driverUtilsMock);
            mockery.registerMock('../utils/device', deviceUtilsMock);


            moduleToBeTested = require('../../../controllers/driver');

            const drivers = {
                driverFoo: driverFooDriver
            };

            expect(moduleToBeTested.discover).to.be.a.function;
            return moduleToBeTested.discover('driverFoo', 'foo', drivers)
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([
						{ _id: 'deviceAId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceA', name: 'DeviceA', address: '192.168.1.1', capabilities: {} } },
						{ _id: 'deviceBId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceB', name: 'DeviceB', address: '192.168.1.2', capabilities: {} } },
						{ _id: 'deviceCId', type: 'foo', driver: 'driverFoo', specs: { deviceId: 'deviceC', name: 'DeviceC', address: '192.168.1.3', capabilities: {} } }
    ]));


    expect(removeStub).to.not.have.been.called;
});
        });

        it('should throw a driver not found error if the driver can\'t be found', () => {
            const driverUtilsMock = {
                doesDriverExist() {}
            };
            const doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', () => Promise.resolve(false));

            const deviceUtilsMock = {};

            modelsMock = {
                device: {
                    Model: {}
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('../utils/driver', driverUtilsMock);
            mockery.registerMock('../utils/device', deviceUtilsMock);


            moduleToBeTested = require('../../../controllers/driver');

            const driverFooDriver = new class DriverFooDriver {}();

            const drivers = {
                driverFoo: driverFooDriver
            };

            expect(moduleToBeTested.discover).to.be.a.function;
            return moduleToBeTested.discover('driverFoo', 'foo', drivers)
				.catch((err) => {
    expect(err.message).to.equal('driver not found');
    expect(err.type).to.equal('NotFound');
});
        });


        it('should catch any errors and throw them up the promise', () => {
            const driverUtilsMock = {
                doesDriverExist() {}
            };

            const err = new Error('this is an error');
            err.type = 'BadRequest';

            const doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', () => Promise.reject(err));

            const deviceUtilsMock = {};

            modelsMock = {
                device: {
                    Model: {}
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('../utils/driver', driverUtilsMock);
            mockery.registerMock('../utils/device', deviceUtilsMock);


            moduleToBeTested = require('../../../controllers/driver');

            const driverFooDriver = new class DriverFooDriver {}();

            const drivers = {
                driverFoo: driverFooDriver
            };

            expect(moduleToBeTested.discover).to.be.a.function;
            return moduleToBeTested.discover('driverFoo', 'foo', drivers)
				.catch((err) => {
    expect(err.message).to.equal('this is an error');
    expect(err.type).to.equal('BadRequest');
    expect(err.driver).to.equal(undefined);
});
        });

        it('should catch any unknown type errors and throw them up the promise', () => {
            const driverUtilsMock = {
                doesDriverExist() {}
            };

            const err = new Error('this is an error');

            const doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', () => Promise.reject(err));

            const deviceUtilsMock = {};

            modelsMock = {
                device: {
                    Model: {}
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('../utils/driver', driverUtilsMock);
            mockery.registerMock('../utils/device', deviceUtilsMock);


            moduleToBeTested = require('../../../controllers/driver');

            const driverFooDriver = new class DriverFooDriver {}();

            const drivers = {
                driverFoo: driverFooDriver
            };

            expect(moduleToBeTested.discover).to.be.a.function;
            return moduleToBeTested.discover('driverFoo', 'foo', drivers)
				.catch((err) => {
    expect(err.message).to.equal('this is an error');
    expect(err.type).to.equal(undefined);
    expect(err.driver).to.equal(undefined);
});
        });

        it('should catch any driver errors and throw them up the promise', () => {
            const driverUtilsMock = {
                doesDriverExist() {}
            };

            const err = new Error('this is an error');
            err.type = 'Driver';

            const doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', () => Promise.reject(err));

            const deviceUtilsMock = {};

            modelsMock = {
                device: {
                    Model: {}
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('../utils/driver', driverUtilsMock);
            mockery.registerMock('../utils/device', deviceUtilsMock);


            moduleToBeTested = require('../../../controllers/driver');

            const driverFooDriver = new class DriverFooDriver {}();

            const drivers = {
                driverFoo: driverFooDriver
            };

            expect(moduleToBeTested.discover).to.be.a.function;
            return moduleToBeTested.discover('driverFoo', 'foo', drivers)
				.catch((err) => {
    expect(err.message).to.equal('this is an error');
    expect(err.type).to.equal('Driver');
    expect(err.driver).to.equal('driverFoo');
});
        });
    });
});
