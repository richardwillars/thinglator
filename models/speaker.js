var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var EventModel = require('./event').Model;

var SpeakerSchema = new mongoose.Schema({
	_id: false,
	name: {
		type: String,
		required: true
	},
	deviceId: {
		type: String,
		required: true
	},
	additionalInfo: {
		type: Object,
		required: false,
		default: {}
	},
	capabilities: {
		getCurrentTrack: {
			type: Boolean,
			default: false,
			eventName: 'currentTrack',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"artist": {
						"type": "string"
					},
					"track": {
						"type": "string"
					},
					"album": {
						"type": "string"
					},
					"length": {
						"type": "integer"
					},
					"currentPosition": {
						"type": "integer"
					},
					"artUrl": {
						"type": "string"
					}
				},
				"required": [
					"artist",
					"track"
				]
			}
		},

		flushQueue: {
			type: Boolean,
			default: false,
			eventName: 'queueFlushed',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"queueFlushed": {
						"type": "boolean"
					}
				},
				"required": [
					"queueFlushed"
				]
			}
		},

		getLEDState: {
			type: Boolean,
			default: false,
			eventName: 'LEDState',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					}
				},
				"required": [
					"on"
				]
			}
		},

		getMuted: {
			type: Boolean,
			default: false,
			eventName: 'muted',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"muted": {
						"type": "boolean"
					}
				},
				"required": [
					"muted"
				]
			}
		},

		getVolume: {
			type: Boolean,
			default: false,
			eventName: 'volume',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"volume": {
						"type": "integer"
					}
				},
				"required": [
					"volume"
				]
			}
		},

		next: {
			type: Boolean,
			default: false,
			eventName: 'next',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"muted": {
						"next": "boolean"
					}
				},
				"required": [
					"next"
				]
			}
		},

		pause: {
			type: Boolean,
			default: false,
			eventName: 'playingState',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"paused": {
						"paused": "boolean"
					},
					"playing": {
						"paused": "boolean"
					},
					"stopped": {
						"paused": "boolean"
					}
				},
				"required": [
					"paused", "playing", "stopped"
				]
			}
		},

		play: {
			type: Boolean,
			default: false,
			eventName: 'playingState',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"paused": {
						"paused": "boolean"
					},
					"playing": {
						"paused": "boolean"
					},
					"stopped": {
						"paused": "boolean"
					}
				},
				"required": [
					"paused", "playing", "stopped"
				]
			}
		},

		previous: {
			type: Boolean,
			default: false,
			eventName: 'previous',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"previous": {
						"type": "boolean"
					}
				},
				"required": [
					"previous"
				]
			}
		},

		addToQueueBottom: {
			type: Boolean,
			default: false,
			eventName: 'addedToQueueBottom',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"uri": {
						"type": "string"
					}
				},
				"required": [
					"uri"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"uri": {
						"type": "string"
					}
				},
				"required": [
					"queued"
				]
			}
		},

		addToQueueNext: {
			type: Boolean,
			default: false,
			eventName: 'addedToQueueNext',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"uri": {
						"type": "string"
					}
				},
				"required": [
					"uri"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"uri": {
						"type": "string"
					}
				},
				"required": [
					"queued"
				]
			}
		},

		seek: {
			type: Boolean,
			default: false,
			eventName: 'seek',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"position": {
						"type": "integer",
						"minimum": 0
					}
				},
				"required": [
					"position"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"position": {
						"type": "integer",
						"minimum": 0
					}
				},
				"required": [
					"position"
				]
			}
		},

		setLEDState: {
			type: Boolean,
			default: false,
			eventName: 'LEDState',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					}
				},
				"required": [
					"on"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					}
				},
				"required": [
					"on"
				]
			}
		},

		setMuted: {
			type: Boolean,
			default: false,
			eventName: 'muted',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"muted": {
						"type": "boolean"
					}
				},
				"required": [
					"muted"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"muted": {
						"type": "boolean"
					}
				},
				"required": [
					"muted"
				]
			}
		},

		setName: {
			type: Boolean,
			default: false,
			eventName: 'name',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"name": {
						"type": "string"
					}
				},
				"required": [
					"name"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"name": {
						"type": "string"
					}
				},
				"required": [
					"name"
				]
			}
		},

		setPlayMode: {
			type: Boolean,
			default: false,
			eventName: 'playMode',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"playMode": {
						"type": "string",
						"enum": [
							"normal", "repeat_all", "shuffle", "shuffle_norepeat"
						]
					}
				},
				"required": [
					"playMode"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"playMode": {
						"type": "string",
						"enum": [
							"normal", "repeat_all", "shuffle", "shuffle_norepeat"
						]
					}
				},
				"required": [
					"playMode"
				]
			}
		},

		setVolume: {
			type: Boolean,
			default: false,
			eventName: 'volume',
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"volume": {
						"type": "integer",
						"minimum": 0,
						"maximum": 100
					}
				},
				"required": [
					"volume"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"volume": {
						"type": "integer",
						"minimum": 0,
						"maximum": 100
					}
				},
				"required": [
					"volume"
				]
			}
		},

		stop: {
			type: Boolean,
			default: false,
			eventName: 'playingState',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"paused": {
						"paused": "boolean"
					},
					"playing": {
						"paused": "boolean"
					},
					"stopped": {
						"paused": "boolean"
					}
				},
				"required": [
					"paused", "playing", "stopped"
				]
			}
		}
	}
});


var Speaker = mongoose.model('Speaker', SpeakerSchema);
var deviceEventEmitter = new EventEmitter2();

deviceEventEmitter.on('playMode', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'playMode',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('name', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'name',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('LEDState', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'LEDState',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('addedToQueueBottom', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'addedToQueueBottom',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('addedToQueueNext', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'addedToQueueNext',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('previous', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'previous',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('next', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'next',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('queueFlushed', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'queueFlushed',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('playingState', function(driverId, deviceId, obj) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'playingState',
		value: obj
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('currentTrack', function(driverId, deviceId, trackId) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'currentTrack',
		value: trackId
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('volume', function(driverId, deviceId, volume) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'volume',
		value: volume
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('muted', function(driverId, deviceId, state) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'muted',
		value: state
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('seek', function(driverId, deviceId, seekPosition) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'seek',
		value: seekPosition
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});


module.exports = {
	Model: Speaker,
	DeviceEventEmitter: deviceEventEmitter
};
