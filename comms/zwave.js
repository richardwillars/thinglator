/* eslint-disable no-console */
let nodes = {};

const getNode = nodeId => nodes[nodeId];

const addNode = (nodeId, nodeInfo) => {
  console.log("addNode", nodeId, nodeInfo);
  nodes[nodeId] = {
    nodeId,
    driverId: nodeInfo.driverId || null,
    manufacturer: nodeInfo.manufacturer || "",
    manufacturerId: nodeInfo.manufacturerId || "",
    product: nodeInfo.product || "",
    productType: nodeInfo.productType || "",
    productId: nodeInfo.productId || "",
    type: nodeInfo.type || "",
    name: nodeInfo.name || "",
    loc: nodeInfo.loc || "",
    classes: nodeInfo.classes || {},
    ready: nodeInfo.ready || false
  };
};

const nodeEvent = (nodeId, comClass, index, value, onValueChanged) => {
  console.log("nodeEvent", nodeId, comClass, index, value);
  const node = getNode(nodeId);
  if (typeof node !== "undefined") {
    if (node.driverId !== null) {
      onValueChanged(node.driverId, nodeId, comClass, index, value);
    }
  }
};

const updateNode = (nodeId, nodeInfo) => {
  console.log("updateNode", nodeId, nodeInfo);
  console.log("updated from", nodes[nodeId]);
  nodes[nodeId] = Object.assign(nodes[nodeId], nodeInfo);
  console.log("updated to", JSON.stringify(nodes[nodeId]));
};

const valueAdded = (nodeId, comClass, index, value) => {
  console.log("valueAdded", nodeId, comClass, index, value);
  const node = getNode(nodeId);
  if (typeof node !== "undefined") {
    if (!node.classes[comClass]) {
      node.classes[comClass] = {};
    }
    node.classes[comClass][index] = value;
    updateNode(nodeId, node);
  }
};

const valueChanged = (nodeId, comClass, index, value, onValueChanged) => {
  console.log("valueChanged", nodeId, comClass, index, value);
  const node = getNode(nodeId);
  if (typeof node !== "undefined") {
    if (typeof node.classes[comClass] === "undefined") {
      node.classes[comClass] = {};
    }
    if (typeof node.classes[comClass][index] === "undefined") {
      node.classes[comClass][index] = null;
    }
    node.classes[comClass][index] = value;
    if (node.driverId !== null) {
      onValueChanged(node.driverId, nodeId, comClass, index, value);
    }
  }
};

const valueRemoved = (nodeId, comClass, index) => {
  console.log("valueRemoved", nodeId, comClass, index);
  const node = getNode(nodeId);
  if (typeof node !== "undefined") {
    if (node.classes[comClass] && node.classes[comClass][index]) {
      delete node.classes[comClass][index];
      updateNode(nodeId, node);
    }
  }
};

const getAllNodes = async () => Object.keys(nodes).map(key => nodes[key]);

const getUnclaimedNodes = async () =>
  Object.keys(nodes)
    .map(key => nodes[key])
    .filter(node => node.driverId === null);

const getNodesClaimedByDriver = async driverId =>
  Object.keys(nodes)
    .map(key => nodes[key])
    .filter(node => node.driverId === driverId);

const claimNode = async (driverId, nodeId) => {
  // console.log("claimNode", driverId, nodeId);
  if (nodes[nodeId]) {
    nodes[nodeId].driverId = driverId;
  }
  // console.log("claimed", nodes[nodeId]);
};

module.exports = async (interfaceObj, interfaceConfig, eventEmitter) => {
  nodes = {};
  const onValueChanged = (driverId, nodeId, comClass, index, value) => {
    eventEmitter.emit(driverId, {
      nodeId,
      comClass,
      index,
      value
    });
  };
  const initialisedInterface = await interfaceObj.initialise(interfaceConfig, {
    getNode,
    addNode,
    updateNode,
    nodeEvent: (nodeId, comClass, index, value) =>
      nodeEvent(nodeId, comClass, index, value, onValueChanged),
    valueAdded,
    valueChanged: (nodeId, comClass, index, value) =>
      valueChanged(nodeId, comClass, index, value, onValueChanged),
    valueRemoved
  });

  await initialisedInterface.connect();
  return {
    getType: () => "zwave",
    disconnect: async () => initialisedInterface.disconnect(),
    pairingMode: async () => initialisedInterface.pairingMode(),
    methodsAvailableToDriver: {
      getAllNodes: async () => getAllNodes(),
      getNodesClaimedByDriver: async driverId =>
        getNodesClaimedByDriver(driverId),
      getUnclaimedNodes: async () => getUnclaimedNodes(),
      setValue: async (nodeId, classId, instance, index, value) =>
        initialisedInterface.setValue(nodeId, classId, instance, index, value),
      setConfig: async (nodeId, instance, index, value) =>
        initialisedInterface.setConfig(nodeId, instance, index, value),
      claimNode: async (driverId, nodeId) => claimNode(driverId, nodeId)
    }
  };
};
