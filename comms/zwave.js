const commsClass = class ZwaveComms {
    constructor(interfaceId, config) {
        this.interfaceId = interfaceId;
        this.config = config;
        this.loadInterface();
    }

    loadInterface() {
        const interfaceObj = require(`../node_modules/thinglator-interface-${this.interfaceId}`);
        this.interface = new interfaceObj.interface(this.config);
    }

    getType() { // eslint-disable-line class-methods-use-this
        return 'zwave';
    }

    getInterface() {
        return this.interfaceId;
    }

    connect() {
        return this.interface.connect();
    }

    disconnect() {
        return this.interface.disconnect();
    }

    addDevices() {
        return this.interface.addDevices();
    }

    getAllNodes() {
        return this.interface.getAllNodes();
    }

    getUnclaimedNodes() {
        return this.interface.getUnclaimedNodes();
    }

    getNodesClaimedByDriver(driverId) {
        return this.interface.getNodesClaimedByDriver(driverId);
    }

    claimNode(driverId, nodeId) {
        return this.interface.claimNode(driverId, nodeId);
    }

    setValue() {
        return this.interface.setValue();
    }
};

module.exports = commsClass;
