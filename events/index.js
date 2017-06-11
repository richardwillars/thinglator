module.exports = {
    addedToQueueBottom: {
        type: Boolean,
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
        responseSchema: {
            $schema: 'http://json-schema.org/draft-04/schema#',
            type: 'object',
            properties: {
                muted: {
                    next: 'boolean'
                }
            },
            required: [
                'next'
            ]
        }
    },
    previousAudioTrack: {
        type: Boolean,
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
