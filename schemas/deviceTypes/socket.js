module.exports = (events, constants) => {
  const deviceCommands = {
    on: {
      type: Boolean,
      description: "Turns the socket on",
      friendly: "Turn on"
    },
    off: {
      type: Boolean,
      description: "Turns the socket off",
      friendly: "Turn off"
    }
  };
  const deviceEvents = {};

  Object.keys(constants.sensor).forEach(key => {
    deviceEvents[key] = events[key];
  });

  return {
    commands: deviceCommands,
    events: deviceEvents
  };
};
