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
            type: Boolean,
            description: 'Gets the current track from the speaker'
        },

        flushQueue: {
            type: Boolean,
            description: 'Empties the queue on the speaker'
        },

        getLEDState: {
            type: Boolean,
            description: 'Gets the state of the LED on the speaker'
        },

        getMuted: {
            type: Boolean,
            description: 'Gets whether the speaker is muted or not'
        },

        getVolume: {
            type: Boolean,
            description: 'Gets the volume level of the speaker'
        },

        next: {
            type: Boolean,
            description: 'Plays the next track in the queue'
        },

        pause: {
            type: Boolean,
            description: 'Pauses the currently playing audio'
        },

        play: {
            type: Boolean,
            description: 'Plays the current audio'
        },

        previous: {
            type: Boolean,
            description: 'Plays the previous track in the queue'
        },

        addToQueueBottom: {
            type: Boolean,
            description: 'Adds audio to the bottom of the queue',
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
            description: 'Adds audio to the top of the queue so that it plays next',
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
            description: 'Seeks to the specified position within the current audio',
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
            description: 'Sets the state of the LED on the speaker',
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
            description: 'Sets whether the speaker is muted or not',
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
            description: 'Sets the name of the speaker',
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
            description: 'Sets the play mode of the speaker',
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
            description: 'Sets the volume of the speaker',
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
            type: Boolean,
            description: 'Stops the currently playing audio'
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
