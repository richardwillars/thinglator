module.exports = (events, constants) => {
  const deviceCommands = {};
  const deviceEvents = {};

  Object.keys(constants.sensor).forEach(key => {
    deviceEvents[key] = events[key];
  });

  return {
    commands: deviceCommands,
    events: deviceEvents
  };
};
