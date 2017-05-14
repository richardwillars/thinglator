const fs = require('fs');
const chalk = require('chalk');

const utils = {
    loadInterfaces() {
        const interfacesArr = {
            http: 'http'
        };
        fs.readdirSync('./node_modules').forEach((file) => {
            if (file.match(/thinglator-interface-/) !== null) {
                const name = file.replace('thinglator-interface-', '');
                const interfaceObj = require(`thinglator-interface-${name}`);

                if (!interfacesArr[interfaceObj.type]) {
                    interfacesArr[interfaceObj.type] = name;
                }
            }
        });
        return interfacesArr;
    },
    loadComms(availableInterfaces, interfaceConfig) {
        const newInterfaceConfig = Object.assign(interfaceConfig, {});
        const interfacesArr = {};

        fs.readdirSync('./comms').forEach((file) => {
            const commsId = file.slice(0, -3);
            // if there's an interface for this particular communication protocol, initialise it
            if (availableInterfaces[commsId]) {
                console.log(chalk.blue(`Connecting to comms: ${chalk.white(`${commsId} using ${availableInterfaces[commsId]} interface`)}`));
                const CommsClass = require(`../comms/${file}`);
                if (typeof interfaceConfig[commsId] === 'undefined') {
                    newInterfaceConfig[commsId] = {};
                }
                interfacesArr[commsId] = new CommsClass(availableInterfaces[commsId], newInterfaceConfig[commsId]);
            }
        });

        return interfacesArr;
    }
};

module.exports = utils;
