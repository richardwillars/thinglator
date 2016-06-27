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

			}
		},
		seek: {
			type: Boolean,
			default: false,
			requestSchema: {

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
			              "normal","repeat_all","shuffle","shuffle_norepeat"
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

module.exports = Speaker;