module.exports = constants => ({
  [constants.events.ADDED_TO_QUEUE_BOTTOM]: {
    type: "boolean",
    description: "Fired when an item is added to the bottom of the queue",
    friendly: "Added to bottom of queue",
    responseSchema: {
      type: "object",
      properties: {
        uri: {
          type: "string"
        }
      },
      required: ["queued"]
    }
  },
  [constants.events.ADDED_TO_QUEUE_NEXT]: {
    type: "boolean",
    description: "Fired when an item is added to the top of the queue",
    friendly: "Added to top of queue",
    responseSchema: {
      type: "object",
      properties: {
        uri: {
          type: "string"
        }
      },
      required: ["queued"]
    }
  },
  [constants.events.AUDIO_PLAYING_STATE]: {
    type: "boolean",
    description:
      "Represents the current playing state (playing, paused, stopped)",
    friendly: "Playing state",
    responseSchema: {
      type: "object",
      properties: {
        paused: {
          paused: "boolean"
        },
        playing: {
          paused: "boolean"
        },
        stopped: {
          paused: "boolean"
        }
      },
      required: ["paused", "playing", "stopped"]
    }
  },
  audioPlayMode: {
    type: "boolean",
    description:
      "The current play mode of the audio device (normal, shuffle, repeat etc)",
    friendly: "Play mode",
    responseSchema: {
      type: "object",
      properties: {
        playMode: {
          type: "string",
          enum: ["normal", "repeat_all", "shuffle", "shuffle_norepeat"]
        }
      },
      required: ["playMode"]
    }
  },
  [constants.events.BATTERY_LEVEL]: {
    type: "boolean",
    description: "The current battery level of the device",
    friendly: "Battery level",
    responseSchema: {
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.BREATHE_LIGHT_EFFECT]: {
    type: "boolean",
    description: "Whether the light is running a breathe effect or not",
    friendly: "Breathe effect",
    responseSchema: {
      type: "object",
      properties: {
        breatheEffect: {
          type: "boolean"
        }
      },
      required: ["breatheEffect"]
    }
  },
  [constants.events.CONTACT]: {
    type: "boolean",
    description: "Whether the contact sensor is closed or open",
    friendly: "Contact",
    responseSchema: {
      type: "object",
      properties: {
        contact: {
          type: "boolean"
        }
      },
      required: ["contact"]
    }
  },
  [constants.events.CURRENT_AUDIO_TRACK]: {
    type: "boolean",
    description: "Information about the current audio",
    friendly: "Current track",
    responseSchema: {
      type: "object",
      properties: {
        artist: {
          type: "string"
        },
        track: {
          type: "string"
        },
        album: {
          type: "string"
        },
        length: {
          type: "integer"
        },
        currentPosition: {
          type: "integer"
        },
        artUrl: {
          type: "string"
        }
      },
      required: ["artist", "track"]
    }
  },
  [constants.events.ENERGY]: {
    type: "boolean",
    description: "The current energy level in watts",
    friendly: "Energy",
    responseSchema: {
      type: "object",
      properties: {
        energy: {
          type: "double"
        }
      },
      required: ["energy"]
    }
  },
  [constants.events.HUMIDITY]: {
    type: "boolean",
    description: "The current humidity level",
    friendly: "Humidity",
    responseSchema: {
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.LED_STATE]: {
    type: "boolean",
    description: "The current state of the LED",
    friendly: "LED",
    responseSchema: {
      type: "object",
      properties: {
        on: {
          type: "boolean"
        }
      },
      required: ["on"]
    }
  },
  [constants.events.LIGHT]: {
    type: "boolean",
    description: "The current light level in lux",
    friendly: "Light level",
    responseSchema: {
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 30000
        }
      },
      required: ["level"]
    }
  },
  [constants.events.LIGHT_STATE]: {
    type: "boolean",
    description:
      "The current state of the light (hue, saturation, brightness etc)",
    friendly: "Light state",
    responseSchema: {
      type: "object",
      properties: {
        on: {
          type: "boolean"
        },
        colour: {
          type: "object",
          properties: {
            hue: {
              type: "integer",
              minimum: 0,
              maxiumum: 360
            },
            saturation: {
              type: "double",
              minimum: 0,
              maximum: 1
            },
            brightness: {
              type: "double",
              minimum: 0,
              maximum: 1
            }
          }
        }
      },
      required: ["colour", "on"]
    }
  },
  [constants.events.ON]: {
    type: "boolean",
    description: "Whether the device is on or not",
    friendly: "On",
    responseSchema: {
      type: "object",
      properties: {
        on: {
          type: "boolean"
        }
      },
      required: ["on"]
    }
  },
  [constants.events.MOTION]: {
    type: "boolean",
    description: "Represents if motion is detected or not",
    friendly: "Motion",
    responseSchema: {
      type: "object",
      properties: {
        detected: {
          type: "boolean"
        }
      },
      required: ["detected"]
    }
  },
  [constants.events.MUTED_AUDIO]: {
    type: "boolean",
    description: "Whether the audio is muted or not",
    friendly: "Muted",
    responseSchema: {
      type: "object",
      properties: {
        muted: {
          type: "boolean"
        }
      },
      required: ["muted"]
    }
  },
  [constants.events.NAME]: {
    type: "boolean",
    description: "The current name of the device",
    friendly: "Name",
    responseSchema: {
      type: "object",
      properties: {
        name: {
          type: "string"
        }
      },
      required: ["name"]
    }
  },
  [constants.events.NEXT_AUDIO_TRACK]: {
    type: "boolean",
    description: "Fired when changing to the next audio track",
    friendly: "Next audio track",
    responseSchema: {
      type: "object",
      properties: {
        next: {
          type: "boolean"
        }
      },
      required: ["next"]
    }
  },
  [constants.events.PREVIOUS_AUDIO_TRACK]: {
    type: "boolean",
    description: "Fired when changing to the previous audio track",
    friendly: "Previous audio track",
    responseSchema: {
      type: "object",
      properties: {
        previous: {
          type: "boolean"
        }
      },
      required: ["previous"]
    }
  },
  [constants.events.PULSE_LIGHT_EFFECT]: {
    type: "boolean",
    description: "Whether the light is running a pulse effect or not",
    friendly: "Pulse effect",
    responseSchema: {
      type: "object",
      properties: {
        pulseEffect: {
          type: "boolean"
        }
      },
      required: ["pulseEffect"]
    }
  },
  [constants.events.QUEUE_FLUSHED]: {
    type: "boolean",
    description: "Fired when the queue has been emptied",
    friendly: "Queue flushed",
    responseSchema: {
      type: "object",
      properties: {
        queueFlushed: {
          type: "boolean"
        }
      },
      required: ["queueFlushed"]
    }
  },
  [constants.events.SEEK]: {
    type: "boolean",
    description: "Represents the current position",
    friendly: "Current position",
    responseSchema: {
      type: "object",
      properties: {
        position: {
          type: "integer",
          minimum: 0
        }
      },
      required: ["position"]
    }
  },
  [constants.events.TAMPER]: {
    type: "boolean",
    description: "If the device is being tampered with or not",
    friendly: "Tamper",
    responseSchema: {
      type: "object",
      properties: {
        detected: {
          type: "boolean"
        }
      },
      required: ["detected"]
    }
  },
  [constants.events.TEMPERATURE]: {
    type: "boolean",
    description: "The current temperature in degrees celcius",
    friendly: "Temperature",
    responseSchema: {
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: -50,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.UV]: {
    type: "boolean",
    description: "The current UV level",
    friendly: "UV level",
    responseSchema: {
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 15
        }
      },
      required: ["level"]
    }
  },
  [constants.events.VIBRATION]: {
    type: "boolean",
    description: "The current vibration level",
    friendly: "Vibration level",
    responseSchema: {
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.VOLUME]: {
    type: "boolean",
    description: "The current volume level",
    friendly: "Volume level",
    responseSchema: {
      type: "object",
      properties: {
        volume: {
          type: "integer",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["volume"]
    }
  }
});
