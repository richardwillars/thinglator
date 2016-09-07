'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('models/event', () => {
	var moduleToBeTested;
	var eventConstructorSpy;
	var modelSpy = sinon.spy();
	var preSpy = sinon.spy();
	var newEventCreatedSpy = sinon.spy();
	var onSaveAction = null;

	beforeEach((done) => {
		eventConstructorSpy = sinon.spy();


		var schemaClass = class Event {
			constructor(props) {
				eventConstructorSpy(props);
			}

			pre(action, cb) {
				preSpy(action, cb);
				onSaveAction = cb;
			}
		};
		var mongooseMock = {
			Schema: schemaClass,
			model: (schemaId, schema) => {
				modelSpy(schemaId, schema);
				return schema;
			}
		};

		var eventUtilsMock = {
			newEventCreated: (eventModelInstance) => {
				newEventCreatedSpy(eventModelInstance);
			}
		}

		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});

		mockery.registerMock('mongoose', mongooseMock);
		mockery.registerMock('../utils/event', eventUtilsMock);
		done();
	});

	afterEach(function(done) {
		mockery.deregisterMock('mongoose');
		mockery.deregisterMock('../utils/event');
		done();
	});

	it('should create a mongoose schema representing an event', () => {
		//call the module to be tested

		moduleToBeTested = require('../../../models/event');
		expect(eventConstructorSpy).to.have.been.calledOnce;
		expect(eventConstructorSpy).to.have.been.calledWith({
			eventType: {
				type: String,
				required: true,
				enum: ['request', 'device']
			},
			driverType: {
				type: String,
				required: true
			},
			driverId: {
				type: String,
				required: true
			},
			deviceId: {
				type: String,
				required: true
			},
			event: {
				type: String,
				required: true
			},
			value: {
				type: Object,
				required: false,
				default: {}
			},
			when: {
				type: Date,
				required: false,
				default: Date.now
			}
		});

	});

	it('should create a mongoose model from the schema', () => {
		moduleToBeTested = require('../../../models/event');
		expect(modelSpy).have.been.calledOnce;
		expect(modelSpy).to.have.been.calledWith('Event');
		expect(moduleToBeTested.Model).to.be.an.object;
	});

	it('should call eventUtils.newEventCreated whenever a new event is created', (done) => {
		moduleToBeTested = require('../../../models/event');
		expect(preSpy).to.have.been.calledOnce;
		expect(preSpy).to.have.been.calledWith('save');

		expect(newEventCreatedSpy).to.have.not.been.called;
		onSaveAction.call({
			isNew: true,
			foo: 'bar'
		}, function() {
			expect(newEventCreatedSpy).to.have.been.calledOnce;
			expect(newEventCreatedSpy).to.have.been.calledWith({
				isNew: true,
				foo: 'bar'
			});
			done();
		});
	});
});