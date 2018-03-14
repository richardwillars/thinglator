module.exports = (events, constants) => {
  const deviceCommands = {
    type: "object",
    properties: {
      on: {
        type: "boolean",
        description: "Turns the socket on",
        friendly: "Turn on"
      },
      off: {
        type: "boolean",
        description: "Turns the socket off",
        friendly: "Turn off"
      }
    }
  };

  const deviceEvents = [
    constants.events.ON,
    constants.events.ENERGY,
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
