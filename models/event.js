var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new mongoose.Schema({
	eventType: {
		type: String,
		required: true,
		enum: ['request','device']
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

var Event = mongoose.model('Event', EventSchema);

module.exports = {
	Model: Event,
};