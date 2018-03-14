module.exports = (events, constants) => {
  const deviceCommands = {
    type: "object",
    properties: {
      toggle: {
        type: "boolean",
        description: "Toggles the light on and off",
        friendly: "Toggle"
      },
      setHSBState: {
        type: "boolean",
        description:
          "Sets the hue, saturation and brightness, allowing you to change the colour of the light",
        friendly: "Set colour and brightness",
        requestSchema: {
          type: "object",
          properties: {
            colour: {
              type: "object",
              properties: {
                hue: {
                  type: "integer",
                  minimum: 0,
                  maximum: 360
                },
                saturation: {
                  type: "double",
                  minimum: 0,
                  maximum: 1
                },
                brightness: {
                  type: "double",
                  minimum: 0.01,
                  maximum: 1
                }
              },
              required: ["hue", "saturation", "brightness"]
            },
            duration: {
              type: "integer",
              minimum: 0,
              maximum: 99999
            }
          },
          required: ["colour", "duration"]
        }
      },
      setBrightnessState: {
        type: "boolean",
        description: "Sets the brightness of the light",
        friendly: "Set the brightness",
        requestSchema: {
          type: "object",
          properties: {
            colour: {
              type: "object",
              properties: {
                brightness: {
                  type: "double",
                  minimum: 0.01,
                  maximum: 1
                }
              },
              required: ["brightness"]
            },
            duration: {
              type: "integer",
              minimum: 0,
              maximum: 99999
            }
          },
          required: ["colour", "duration"]
        }
      },
      setBooleanState: {
        type: "boolean",
        description: "Turns the light on or off",
        friendly: "Turn on or off",
        requestSchema: {
          type: "object",
          properties: {
            on: {
              type: "boolean"
            },
            duration: {
              type: "integer",
              minimum: 0,
              maximum: 99999
            }
          },
          required: ["on", "duration"]
        }
      },
      breatheEffect: {
        type: "boolean",
        friendly: "Breathe effect",
        description: "Performs a breathe effect by fading between colours",
        requestSchema: {
          type: "object",
          properties: {
            colour: {
              type: "object",
              properties: {
                hue: {
                  type: "integer",
                  minimum: 0,
                  maximum: 360
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
              },
              required: ["hue", "saturation", "brightness"]
            },
            fromColour: {
              type: "object",
              properties: {
                hue: {
                  type: "integer",
                  minimum: 0,
                  maximum: 360
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
              },
              required: ["hue", "saturation", "brightness"]
            },
            period: {
              type: "double",
              minimum: 0.01,
              maximum: 100
            },
            cycles: {
              duration: "double",
              minimum: 0.01,
              maximum: 99999
            },
            persist: {
              type: "boolean"
            },
            peak: {
              type: "double",
              minimum: 0,
              maximum: 1
            }
          },
          required: ["colour", "period", "cycles", "persist", "peak"]
        }
      },
      pulseEffect: {
        type: "boolean",
        friendly: "Pulse effect",
        description: "Performs a pulse effect by flashing between colours",
        requestSchema: {
          type: "object",
          properties: {
            colour: {
              type: "object",
              properties: {
                hue: {
                  type: "integer",
                  minimum: 0,
                  maximum: 360
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
              },
              required: ["hue", "saturation", "brightness"]
            },
            fromColour: {
              type: "object",
              properties: {
                hue: {
                  type: "integer",
                  minimum: 0,
                  maximum: 360
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
              },
              required: ["hue", "saturation", "brightness"]
            },
            period: {
              type: "double",
              minimum: 0.01,
              maximum: 100
            },
            cycles: {
              duration: "double",
              minimum: 0.01,
              maximum: 99999
            },
            persist: {
              type: "boolean"
            }
          },
          required: ["colour", "period", "cycles", "persist"]
        }
      }
    }
  };

  const deviceEvents = [
    constants.events.LIGHT_STATE,
    constants.events.BREATHE_LIGHT_EFFECT,
    constants.events.PULSE_LIGHT_EFFECT,
    constants.events.NAME
  ];

  const eventSchema = {
    type: "object",
    properties: {}
  };

  deviceEvents.forEach(eventId => {
    eventSchema.properties[eventId] = events[eventId];
    eventSchema.properties[eventId].constant = eventId;
  });

  return {
    commands: deviceCommands,
    events: eventSchema
  };
};
