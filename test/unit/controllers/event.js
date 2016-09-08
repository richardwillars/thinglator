var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

var moduleToBeTested;

describe('controllers/event', () => {
	var modelsMock;

	afterEach((done) => {
		mockery.deregisterMock('../models');
		mockery.disable();
		done();
	});

	describe('getEventsByType', () => {
		it('should return a list of events by type', () => {
			var eventModel = {
				find: function() {},
				sort: function() {},
				limit: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(eventModel, 'find', function() {
				return eventModel;
			});

			var sortStub = sinon.stub(eventModel, 'sort', function() {
				return eventModel;
			});

			var limitStub = sinon.stub(eventModel, 'limit', function() {
				return eventModel;
			});

			var leanStub = sinon.stub(eventModel, 'lean', function() {
				return eventModel;
			});

			var execStub = sinon.stub(eventModel, 'exec', function() {
				return Promise.resolve([{
					'foo': 'bar'
				}, {
					'foo': 'bar'
				}]);
			});

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
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([{
						'foo': 'bar'
					}, {
						'foo': 'bar'
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
			var eventModel = {
				find: function() {},
				findOne: function() {},
				sort: function() {},
				limit: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(eventModel, 'find', function() {
				return eventModel;
			});

			var findOneStub = sinon.stub(eventModel, 'findOne', function() {
				return eventModel;
			});

			var sortStub = sinon.stub(eventModel, 'sort', function() {
				return eventModel;
			});

			var limitStub = sinon.stub(eventModel, 'limit', function() {
				return eventModel;
			});

			var leanStub = sinon.stub(eventModel, 'lean', function() {
				return eventModel;
			});

			var d = new Date();

			var execCallback1 = function() {
				return Promise.resolve({
					'_id': 'abc123',
					'when': d
				});
			};
			var execCallback2 = function() {
				return Promise.resolve([{
					'foo': 'bar'
				}, {
					'foo': 'bar'
				}]);
			};
			var execStub = sinon.stub(eventModel, 'exec');
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
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([{
						'foo': 'bar'
					}, {
						'foo': 'bar'
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
			var eventModel = {
				find: function() {},
				sort: function() {},
				limit: function() {},
				lean: function() {},
				exec: function() {}
			};

			var findStub = sinon.stub(eventModel, 'find', function() {
				return eventModel;
			});

			var sortStub = sinon.stub(eventModel, 'sort', function() {
				return eventModel;
			});

			var limitStub = sinon.stub(eventModel, 'limit', function() {
				return eventModel;
			});

			var leanStub = sinon.stub(eventModel, 'lean', function() {
				return eventModel;
			});

			var err = new Error('something went wrong');
			err.type = 'BadRequest';

			var execStub = sinon.stub(eventModel, 'exec', function() {
				return Promise.reject(err);
			});

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
			return moduleToBeTested.getEventsByType('event').catch(function(errThrown) {
				expect(errThrown).to.equal(err);
			});
		});
	});
});