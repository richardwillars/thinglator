module.exports = {
    addedToQueueBottom: {
        type: Boolean,
        description: 'Fired when an item is added to the bottom of the queue',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                uri: {
                    type: 'string'
                }
            },
            required: [
                'queued'
            ]
        }
    },
    addedToQueueNext: {
        type: Boolean,
        description: 'Fired when an item is added to the top of the queue',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                uri: {
                    type: 'string'
                }
            },
            required: [
                'queued'
            ]
        }
    },
    audioPlayingState: {
        type: Boolean,
        description: 'Represents the current playing state (playing, paused, stopped)',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                paused: {
                    paused: 'boolean'
                },
                playing: {
                    paused: 'boolean'
                },
                stopped: {
                    paused: 'boolean'
                }
            },
            required: [
                'paused', 'playing', 'stopped'
            ]
        }
    },
    audioPlayMode: {
        type: Boolean,
        description: 'The current play mode of the audio device (normal, shuffle, repeat etc)',
        responseSchema: {
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
    batteryLevel: {
        type: Boolean,
        description: 'The current battery level of the device',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                level: {
                    type: 'double',
                    minimum: 0,
                    maxiumum: 100
                }
            },
            required: [
                'level'
            ]
        }
    },
    breatheLightEffect: {
        type: Boolean,
        description: 'Whether the light is running a breathe effect or not',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                breatheEffect: {
                    type: 'boolean'
                }
            },
            required: [
                'breatheEffect'
            ]
        }
    },
    contact: {
        type: Boolean,
        description: 'Whether the contact sensor is closed or open',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                contact: {
                    type: Boolean
                }
            },
            required: [
                'contact'
            ]
        }
    },
    currentAudioTrack: {
        type: Boolean,
        description: 'Information about the current audio',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                artist: {
                    type: 'string'
                },
                track: {
                    type: 'string'
                },
                album: {
                    type: 'string'
                },
                length: {
                    type: 'integer'
                },
                currentPosition: {
                    type: 'integer'
                },
                artUrl: {
                    type: 'string'
                }
            },
            required: [
                'artist',
                'track'
            ]
        }
    },
    energy: {
        type: Boolean,
        description: 'The current energy level in watts',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                energy: {
                    type: 'number'
                }
            },
            required: [
                'energy'
            ]
        }
    },
    humidity: {
        type: Boolean,
        description: 'The current humidity level',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                level: {
                    type: 'double',
                    minimum: 0,
                    maxiumum: 100
                }
            },
            required: [
                'level'
            ]
        }
    },
    ledState: {
        type: Boolean,
        description: 'The current state of the LED',
        responseSchema: {
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
    light: {
        type: Boolean,
        description: 'The current light level in lux',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                level: {
                    type: 'double',
                    minimum: 0,
                    maxiumum: 30000
                }
            },
            required: [
                'level'
            ]
        }
    },
    lightState: {
        type: Boolean,
        description: 'The current state of the light (hue, saturation, brightness etc)',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                on: {
                    type: 'boolean'
                },
                colour: {
                    type: 'object',
                    properties: {
                        hue: {
                            type: 'integer',
                            minimum: 0,
                            maxiumum: 360
                        },
                        saturation: {
                            type: 'double',
                            minimum: 0,
                            maximum: 1
                        },
                        brightness: {
                            type: 'double',
                            minimum: 0,
                            maximum: 1
                        }
                    }
                }
            },
            required: [
                'colour',
                'on'
            ]
        }
    },
    on: {
        type: Boolean,
        description: 'Whether the device is on or not',
        responseSchema: {
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
    motion: {
        type: Boolean,
        description: 'Represents if motion is detected or not',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                detected: {
                    type: 'boolean'
                }
            },
            required: [
                'detected'
            ]
        }
    },
    mutedAudio: {
        type: Boolean,
        description: 'Whether the audio is muted or not',
        responseSchema: {
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
    name: {
        type: Boolean,
        description: 'The current name of the device',
        responseSchema: {
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
    nextAudioTrack: {
        type: Boolean,
        description: 'Fired when changing to the next audio track',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                next: {
                    type: 'boolean'
                }
            },
            required: [
                'next'
            ]
        }
    },
    previousAudioTrack: {
        type: Boolean,
        description: 'Fired when changing to the previous audio track',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                previous: {
                    type: 'boolean'
                }
            },
            required: [
                'previous'
            ]
        }
    },
    pulseLightEffect: {
        type: Boolean,
        description: 'Whether the light is running a pulse effect or not',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                pulseEffect: {
                    type: 'boolean'
                }
            },
            required: [
                'pulseEffect'
            ]
        }
    },
    queueFlushed: {
        type: Boolean,
        description: 'Fired when the queue has been emptied',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                queueFlushed: {
                    type: 'boolean'
                }
            },
            required: [
                'queueFlushed'
            ]
        }
    },
    seek: {
        type: Boolean,
        description: 'Represents the current position',
        responseSchema: {
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
    tamper: {
        type: Boolean,
        description: 'If the device is being tampered with or not',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                detected: {
                    type: 'boolean'
                }
            },
            required: [
                'detected'
            ]
        }
    },
    temperature: {
        type: Boolean,
        description: 'The current temperature in degrees celcius',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                level: {
                    type: 'double',
                    minimum: -50,
                    maxiumum: 100
                }
            },
            required: [
                'level'
            ]
        }
    },
    uv: {
        type: Boolean,
        description: 'The current UV level',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                level: {
                    type: 'double',
                    minimum: 0,
                    maxiumum: 15
                }
            },
            required: [
                'level'
            ]
        }
    },
    vibration: {
        type: Boolean,
        description: 'The current vibration level',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                level: {
                    type: 'double',
                    minimum: 0,
                    maxiumum: 100
                }
            },
            required: [
                'level'
            ]
        }
    },
    volume: {
        type: Boolean,
        description: 'The current volume level',
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                volume: {
                    type: 'integer',
                    minimum: 0,
                    maxiumum: 100
                }
            },
            required: [
                'volume'
            ]
        }
    }
};
