'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

describe('models/device', () => {
	var moduleToBeTested;
	var deviceConstructorSpy;
	var modelSpy = sinon.spy();
	var onSaveAction = null;

	beforeEach((done) => {
		deviceConstructorSpy = sinon.spy();


		var schemaClass = class Event {
			constructor(props) {
				deviceConstructorSpy(props);
			}
		};
		var mongooseMock = {
			Schema: schemaClass,
			model: (schemaId, schema) => {
				modelSpy(schemaId, schema);
				return schema;
			}
		};


		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});

		mockery.registerMock('mongoose', mongooseMock);
		done();
	});

	afterEach(function(done) {
		mockery.deregisterMock('mongoose');
		done();
	});

	it('should create a mongoose schema representing a device', () => {
		//call the module to be tested

		moduleToBeTested = require('../../../models/device');
		expect(deviceConstructorSpy).to.have.been.calledOnce;
		expect(deviceConstructorSpy).to.have.been.calledWith({
			_id: {
				type: String,
				required: true,
				unique: true
			},
			created: {
				type: Date,
				required: false,
				default: Date.now
			},
			type: {
				type: String,
				required: true
			},
			driver: {
				type: String,
				required: true
			},
			specs: {
				type: Object,
				required: true,
				default: {}
			}
		});

	});

	it('should create a mongoose model from the schema', () => {
		moduleToBeTested = require('../../../models/device');
		expect(modelSpy).have.been.calledOnce;
		expect(modelSpy).to.have.been.calledWith('Device');
		expect(moduleToBeTested.Model).to.be.an.object;
	});
});