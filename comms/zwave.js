const EventEmitter2 = require('eventemitter2').EventEmitter2;

const commsClass = class ZwaveComms {
    constructor(interfaceId, config) {
        this.onValueChanged = this.onValueChanged.bind(this);
        this.interfaceId = interfaceId;
        this.config = config;
        this.loadInterface();
        this.eventEmitter = new EventEmitter2();
        return this;
    }

    loadInterface() {
        const interfaceObj = require(`../node_modules/thinglator-interface-${this.interfaceId}`);
        this.interface = new interfaceObj.interface(this.config, this.onValueChanged);
    }

    onValueChanged(driverId, nodeId, comClass, value) {
        this.eventEmitter.emit(driverId, {
            nodeId,
            comClass,
            value
        });
    }

    getType() { // eslint-disable-line class-methods-use-this
        return 'zwave';
    }

    getInterface() {
        return this.interfaceId;
    }

    getValueChangedEventEmitter() {
        return this.eventEmitter;
    }

    connect() {
        return this.interface.connect();
    }

    disconnect() {
        return this.interface.disconnect();
    }

    addDevices(secure) {
        return this.interface.addDevices(secure);
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
