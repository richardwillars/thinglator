const http = require('./http');
const zwave = require('./zwave');

const comms = {
  http,
  zwave,
};

const activeComms = {};

module.exports = (fs, chalk) => ({
  installInterfaces: () => {
    const interfacesArr = {};
    fs.readdirSync('./node_modules').forEach((file) => {
      if (file.match(/thinglator-interface-/) !== null) {
        const name = file.replace('thinglator-interface-', '');
        const interfaceObj = require(`thinglator-interface-${name}`);
        if (!interfacesArr[interfaceObj.commsType]) {
          interfacesArr[interfaceObj.commsType] = interfaceObj;
        }
      }
    });
    return interfacesArr;
  },

  initialise: async (availableInterfaces, interfaceConfig, eventEmitter) => {
    const newInterfaceConfig = Object.assign(interfaceConfig, {});

    const commIds = Object.keys(comms);
    for (const commsId of commIds) {
      if (availableInterfaces[commsId]) {
        console.log(chalk.blue(`Connecting to comms: ${chalk.white(`${commsId} using ${availableInterfaces[commsId].interfaceId} interface`)}`));
        if (typeof interfaceConfig[commsId] === 'undefined') {
          newInterfaceConfig[commsId] = {};
        }
        activeComms[commsId] = await comms[commsId](availableInterfaces[commsId], newInterfaceConfig[commsId], eventEmitter);
      }
    }
  },

  disconnectAll: async () => {
    Object.keys(activeComms).forEach(async (commId) => {
      console.log(chalk.blue(`Disconnecting from comms: ${chalk.white(activeComms[commId].getType())}`));
      await activeComms[commId].disconnect();
    });
    console.log(chalk.blue('All comms disconnected!'));
  },

  getActiveCommsById: commId => activeComms[commId],
});
