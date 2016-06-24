var mongoose = require('mongoose');
var Schema = mongoose.Schema;


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
	capabilities: {
		getCurrentTrack: {
			type: Boolean,
			default: false,
			returnSchema: {
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
			default: false
		},
		getCurrentState: {
			type: Boolean,
			default: false
		},
		getLEDState: {
			type: Boolean,
			default: false
		},
		getMusicLibrary: {
			type: Boolean,
			default: false
		},
		getMuted: {
			type: Boolean,
			default: false
		},
		getTopology: {
			type: Boolean,
			default: false
		},
		getVolume: {
			type: Boolean,
			default: false
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
			default: false
		},
		pause: {
			type: Boolean,
			default: false
		},
		play: {
			type: Boolean,
			default: false
		},
		previous: {
			type: Boolean,
			default: false
		},
		addToQueueBottom: {
			type: Boolean,
			default: false
		},
		addToQueueNext: {
			type: Boolean,
			default: false
		},
		seek: {
			type: Boolean,
			default: false
		},
		setLEDState: {
			type: Boolean,
			default: false
		},
		setMuted: {
			type: Boolean,
			default: false
		},
		setName: {
			type: Boolean,
			default: false
		},
		setPlayMode: {
			type: Boolean,
			default: false
		},
		setVolume: {
			type: Boolean,
			default: false
		},
		stop: {
			type: Boolean,
			default: false
		}
	}
});


var Speaker = mongoose.model('Speaker', SpeakerSchema);

module.exports = Speaker;