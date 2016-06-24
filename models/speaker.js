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
			returnSchema: {
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
			default: false
		},
		getMusicLibrary: {
			type: Boolean,
			default: false
		},
		getMuted: {
			type: Boolean,
			default: false,
			returnSchema: {
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
			default: false,
			returnSchema: {
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
			returnSchema: {
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
			returnSchema: {
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
			returnSchema: {
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
			default: false,
			returnSchema: {
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