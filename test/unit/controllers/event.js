const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

let moduleToBeTested;

describe('controllers/event', () => {
    let modelsMock;

    afterEach((done) => {
        mockery.deregisterMock('../models');
        mockery.disable();
        done();
    });

    describe('getEventsByType', () => {
        it('should return a list of events by type', () => {
            const eventModel = {
                find() {},
                sort() {},
                limit() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(eventModel, 'find', () => eventModel);

            const sortStub = sinon.stub(eventModel, 'sort', () => eventModel);

            const limitStub = sinon.stub(eventModel, 'limit', () => eventModel);

            const leanStub = sinon.stub(eventModel, 'lean', () => eventModel);

            const execStub = sinon.stub(eventModel, 'exec', () => Promise.resolve([{
                foo: 'bar'
            }, {
                foo: 'bar'
            }]));

            modelsMock = {
                event: {
                    Model: eventModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../controllers/event');
            expect(moduleToBeTested.getEventsByType).to.be.a.function;
            return moduleToBeTested.getEventsByType('event')
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([{
        foo: 'bar'
    }, {
        foo: 'bar'
    }]));

    expect(findStub).to.have.been.calledOnce;
    expect(findStub).to.have.been.calledWith({
        eventType: 'event'
    });

    expect(sortStub).to.have.been.calledOnce;
    expect(sortStub).to.have.been.calledWith('when');

    expect(limitStub).to.have.been.calledOnce;
    expect(limitStub).to.have.been.calledWith(100);

    expect(leanStub).to.have.been.calledOnce;

    expect(execStub).to.have.been.calledOnce;
});
        });


        it('should return a list of events by type after the specified from record', () => {
            const eventModel = {
                find() {},
                findOne() {},
                sort() {},
                limit() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(eventModel, 'find', () => eventModel);

            const findOneStub = sinon.stub(eventModel, 'findOne', () => eventModel);

            const sortStub = sinon.stub(eventModel, 'sort', () => eventModel);

            const limitStub = sinon.stub(eventModel, 'limit', () => eventModel);

            const leanStub = sinon.stub(eventModel, 'lean', () => eventModel);

            const d = new Date();

            const execCallback1 = function () {
                return Promise.resolve({
                    _id: 'abc123',
                    when: d
                });
            };
            const execCallback2 = function () {
                return Promise.resolve([{
                    foo: 'bar'
                }, {
                    foo: 'bar'
                }]);
            };
            const execStub = sinon.stub(eventModel, 'exec');
            execStub.onCall(0).returns(execCallback1.bind()());
            execStub.onCall(1).returns(execCallback2.bind()());

            modelsMock = {
                event: {
                    Model: eventModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../controllers/event');
            expect(moduleToBeTested.getEventsByType).to.be.a.function;
            return moduleToBeTested.getEventsByType('event', 'abc123')
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([{
        foo: 'bar'
    }, {
        foo: 'bar'
    }]));

    expect(findOneStub).to.have.been.calledOnce;
    expect(findOneStub).to.have.been.calledWith({
        _id: 'abc123'
    });

    expect(leanStub).to.have.been.calledTwice;
    expect(execStub).to.have.been.calledTwice;

    expect(findStub).to.have.been.calledOnce;
    expect(findStub).to.have.been.calledWith({
        when: {
            $gte: d
        },
        eventType: 'event',
        _id: {
            $ne: 'abc123'
        }
    });

    expect(sortStub).to.have.been.calledOnce;
    expect(sortStub).to.have.been.calledWith('when');

    expect(limitStub).to.have.been.calledOnce;
    expect(limitStub).to.have.been.calledWith(100);
});
        });

        it('should catch any errors and throw them up the promise', () => {
            const eventModel = {
                find() {},
                sort() {},
                limit() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(eventModel, 'find', () => eventModel);

            const sortStub = sinon.stub(eventModel, 'sort', () => eventModel);

            const limitStub = sinon.stub(eventModel, 'limit', () => eventModel);

            const leanStub = sinon.stub(eventModel, 'lean', () => eventModel);

            const err = new Error('something went wrong');
            err.type = 'BadRequest';

            const execStub = sinon.stub(eventModel, 'exec', () => Promise.reject(err));

            modelsMock = {
                event: {
                    Model: eventModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../controllers/event');
            expect(moduleToBeTested.getEventsByType).to.be.a.function;
            return moduleToBeTested.getEventsByType('event').catch((errThrown) => {
                expect(errThrown).to.equal(err);
            });
        });
    });
});
