const mongoose = require('mongoose');

const events = require('../events');
const eventUtils = require('../utils/event');
const EventModel = require('../models/event').Model;

const SpeakerSchema = new mongoose.Schema({
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
    commands: {
        getCurrentTrack: {
            type: Boolean
        },

        flushQueue: {
            type: Boolean
        },

        getLEDState: {
            type: Boolean
        },

        getMuted: {
            type: Boolean
        },

        getVolume: {
            type: Boolean
        },

        next: {
            type: Boolean
        },

        pause: {
            type: Boolean
        },

        play: {
            type: Boolean
        },

        previous: {
            type: Boolean
        },

        addToQueueBottom: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    uri: {
                        type: 'string'
                    }
                },
                required: [
                    'uri'
                ]
            }
        },

        addToQueueNext: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    uri: {
                        type: 'string'
                    }
                },
                required: [
                    'uri'
                ]
            }
        },

        seek: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    position: {
                        type: 'integer',
                        minimum: 0
                    }
                },
                required: [
                    'position'
                ]
            }
        },

        setLEDState: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    on: {
                        type: 'boolean'
                    }
                },
                required: [
                    'on'
                ]
            }
        },

        setMuted: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    muted: {
                        type: 'boolean'
                    }
                },
                required: [
                    'muted'
                ]
            }
        },

        setName: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                },
                required: [
                    'name'
                ]
            }
        },

        setPlayMode: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    playMode: {
                        type: 'string',
                        enum: [
                            'normal', 'repeat_all', 'shuffle', 'shuffle_norepeat'
                        ]
                    }
                },
                required: [
                    'playMode'
                ]
            }
        },

        setVolume: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    volume: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 100
                    }
                },
                required: [
                    'volume'
                ]
            }
        },

        stop: {
            type: Boolean
        }
    },
    events: {
        currentAudioTrack: events.currentAudioTrack,
        queueFlushed: events.queueFlushed,
        ledState: events.ledState,
        mutedAudio: events.mutedAudio,
        volume: events.volume,
        nextAudioTrack: events.nextAudioTrack,
        audioPlayingState: events.audioPlayingState,
        previousAudioTrack: events.previousAudioTrack,
        addedToQueueBottom: events.addedToQueueBottom,
        addedToQueueNext: events.addedToQueueNext,
        seek: events.seek,
        name: events.name,
        audioPlayMode: events.audioPlayMode
    }
});

const Speaker = mongoose.model('Speaker', SpeakerSchema);

module.exports = {
    Model: Speaker,
    DeviceEventEmitter: eventUtils.processIncomingEvents(Speaker.schema, 'speaker', EventModel)
};
