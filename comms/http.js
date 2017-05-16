/* eslint-disable class-methods-use-this */
const commsClass = class HttpComms {
    constructor(interfaceId, config) {
        this.interfaceId = interfaceId;
        this.config = config;
        return this;
    }

    getType() {
        return 'http';
    }

    connect() {
        return Promise.resolve();
    }

    disconnect() {
        return Promise.resolve();
    }

};

module.exports = commsClass;
