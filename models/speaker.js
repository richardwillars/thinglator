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

		getDeviceDescription: {
			type: Boolean,
			default: false
		},

		flushQueue: {
			type: Boolean,
			default: false,
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

		getCurrentState: {
			type: Boolean,
			default: false
		},

		getLEDState: {
			type: Boolean,
			default: false,
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

		getMusicLibrary: {
			type: Boolean,
			default: false
		},

		getMuted: {
			type: Boolean,
			default: false,
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

		getTopology: {
			type: Boolean,
			default: false
		},

		getVolume: {
			type: Boolean,
			default: false,
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

		getZoneAttrs: {
			type: Boolean,
			default: false
		},

		getZoneInfo: {
			type: Boolean,
			default: false
		},

		next: {
			type: Boolean,
			default: false,
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
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"muted": {
						"paused": "boolean"
					}
				},
				"required": [
					"paused"
				]
			}
		},

		play: {
			type: Boolean,
			default: false,
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"playing": {
						"type": "boolean"
					}
				},
				"required": [
					"playing"
				]
			}
		},

		previous: {
			type: Boolean,
			default: false,
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
			requestSchema: {

			}
		},

		addToQueueNext: {
			type: Boolean,
			default: false,
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
					"queued": {
						"type": "boolean"
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
			}
		},

		setVolume: {
			type: Boolean,
			default: false,
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
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"stopped": {
						"type": "boolean"
					}
				},
				"required": [
					"stopped"
				]
			}
		}
	}
});


var Speaker = mongoose.model('Speaker', SpeakerSchema);
var deviceEventEmitter = new EventEmitter2();

deviceEventEmitter.on('playing', function(driverId, deviceId, trackId) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'playing',
		value: trackId
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('paused', function(driverId, deviceId, trackId) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'paused',
		value: trackId
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('stopped', function(driverId, deviceId) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'stopped',
		value: {}
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});

deviceEventEmitter.on('changedTrack', function(driverId, deviceId, trackId) {
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'speaker',
		driverId: driverId,
		deviceId: deviceId,
		event: 'changedTrack',
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