const http = require("./http");
const zwave = require("./zwave");

const comms = {
  http,
  zwave
};

const activeComms = {};

module.exports = (fs, chalk) => ({
  installInterfaces: () => {
    const interfacesArr = {};
    fs.readdirSync("./node_modules").forEach(file => {
      if (file.match(/thinglator-interface-/) !== null) {
        const name = file.replace("thinglator-interface-", "");
        /* eslint-disable global-require, import/no-dynamic-require */
        const interfaceObj = require(`thinglator-interface-${name}`);
        /* eslint-enable global-require, import/no-dynamic-require */
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
    commIds.forEach(async commsId => {
      if (availableInterfaces[commsId]) {
        /* eslint-disable no-console */
        console.log(
          chalk.blue(
            `Connecting to comms: ${chalk.white(
              `${commsId} using ${
                availableInterfaces[commsId].interfaceId
              } interface`
            )}`
          )
        );
        /* eslint-enable no-console */
        if (typeof interfaceConfig[commsId] === "undefined") {
          newInterfaceConfig[commsId] = {};
        }
        activeComms[commsId] = await comms[commsId](
          availableInterfaces[commsId],
          newInterfaceConfig[commsId],
          eventEmitter
        );
      }
    });
  },

  disconnectAll: async () => {
    /* eslint-disable no-console */
    Object.keys(activeComms).forEach(async commId => {
      console.log(
        chalk.blue(
          `Disconnecting from comms: ${chalk.white(
            activeComms[commId].getType()
          )}`
        )
      );
      await activeComms[commId].disconnect();
    });
    console.log(chalk.blue("All comms disconnected!"));
    /* eslint-enable no-console */
  },
  getActiveComms: () => activeComms,
  getActiveCommsById: commId => activeComms[commId]
});
