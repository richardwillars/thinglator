const zwaveCommsModule = require("./zwave");

describe("comms/zwave", () => {
  it("should initialise the interface and return the available methods", async () => {
    const connect = jest.fn().mockReturnValue(Promise.resolve());
    const interfaceObj = {
      initialise: jest.fn().mockReturnValue({
        connect
      })
    };
    const interfaceConfig = {
      foo: "bar"
    };
    const eventEmitter = {};
    await zwaveCommsModule(interfaceObj, interfaceConfig, eventEmitter);
    expect(interfaceObj.initialise).toHaveBeenCalledTimes(1);
    expect(interfaceObj.initialise.mock.calls[0][0]).toEqual(interfaceConfig);
    expect(connect).toHaveBeenCalledTimes(1);
  });

  it("should return the type of the comms interface", async () => {
    const connect = jest.fn().mockReturnValue(Promise.resolve());
    const interfaceObj = {
      initialise: jest.fn().mockReturnValue({
        connect
      })
    };
    const interfaceConfig = {
      foo: "bar"
    };
    const zwaveComms = await zwaveCommsModule(interfaceObj, interfaceConfig);
    expect(zwaveComms.getType()).toEqual("zwave");
  });

  it("should disconnect from the comms interface", async () => {
    const connect = jest.fn().mockReturnValue(Promise.resolve());
    const disconnect = jest.fn().mockReturnValue(Promise.resolve());
    const interfaceObj = {
      initialise: jest.fn().mockReturnValue({
        connect,
        disconnect
      })
    };
    const interfaceConfig = {
      foo: "bar"
    };
    const zwaveComms = await zwaveCommsModule(interfaceObj, interfaceConfig);
    await zwaveComms.disconnect();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("should enter pairing mode", async () => {
    const connect = jest.fn().mockReturnValue(Promise.resolve());
    const pairingMode = jest.fn().mockReturnValue(Promise.resolve(2));
    const interfaceObj = {
      initialise: jest.fn().mockReturnValue({
        connect,
        pairingMode
      })
    };
    const interfaceConfig = {
      foo: "bar"
    };
    const zwaveComms = await zwaveCommsModule(interfaceObj, interfaceConfig);
    const result = await zwaveComms.pairingMode();
    expect(pairingMode).toHaveBeenCalledTimes(1);
    expect(result).toEqual(2);
  });

  describe("methodsAvailableToDriver", () => {
    it("should return a list of methods to make available to drivers that require the zwave comms", async () => {
      const connect = jest.fn().mockReturnValue(Promise.resolve());
      const disconnect = jest.fn().mockReturnValue(Promise.resolve());
      const interfaceObj = {
        initialise: jest.fn().mockReturnValue({
          connect,
          disconnect
        })
      };
      const interfaceConfig = {
        foo: "bar"
      };
      const zwaveComms = await zwaveCommsModule(interfaceObj, interfaceConfig);
      expect(typeof zwaveComms.methodsAvailableToDriver).toEqual("object");
    });

    describe("getAllNodes", () => {
      it("should expose the method", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        expect(typeof zwaveComms.methodsAvailableToDriver.getAllNodes).toEqual(
          "function"
        );
      });

      it("should return a list of all the nodes", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        const zwaveCommsApi = interfaceObj.initialise.mock.calls[0][1];
        zwaveCommsApi.addNode("node1", {});
        zwaveCommsApi.addNode("node2", {});
        zwaveCommsApi.addNode("node3", {});
        const nodes = await zwaveComms.methodsAvailableToDriver.getAllNodes();
        expect(nodes).toMatchSnapshot();
      });
    });

    describe("getNodesClaimedByDriver", () => {
      it("should expose the method", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        expect(
          typeof zwaveComms.methodsAvailableToDriver.getNodesClaimedByDriver
        ).toEqual("function");
      });

      it("should return a list of all the nodes claimed by the specified driver", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        const zwaveCommsApi = interfaceObj.initialise.mock.calls[0][1];
        zwaveCommsApi.addNode("node1", {});
        zwaveCommsApi.addNode("node2", { driverId: "driver1" });
        zwaveCommsApi.addNode("node3", { driverId: "driver1" });
        zwaveCommsApi.addNode("node4", { driverId: "driver2" });
        const nodes = await zwaveComms.methodsAvailableToDriver.getNodesClaimedByDriver(
          "driver1"
        );
        expect(nodes).toMatchSnapshot();
      });
    });

    describe("getUnclaimedNodes", () => {
      it("should expose the method", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        expect(
          typeof zwaveComms.methodsAvailableToDriver.getUnclaimedNodes
        ).toEqual("function");
      });

      it("should return a list of all the nodes not claimed by drivers", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        const zwaveCommsApi = interfaceObj.initialise.mock.calls[0][1];
        zwaveCommsApi.addNode("node1", {});
        zwaveCommsApi.addNode("node2", { driverId: "driver1" });
        zwaveCommsApi.addNode("node3", {});
        zwaveCommsApi.addNode("node4", { driverId: "driver2" });
        const nodes = await zwaveComms.methodsAvailableToDriver.getUnclaimedNodes();
        expect(nodes).toMatchSnapshot();
      });
    });

    describe("setValue", () => {
      it("should expose the method", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        expect(typeof zwaveComms.methodsAvailableToDriver.setValue).toEqual(
          "function"
        );
      });

      it("should call the setValue method on the zwave interface", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const setValue = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect,
            setValue
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );

        await zwaveComms.methodsAvailableToDriver.setValue(
          "nodeId",
          "classId",
          "instanceId",
          "index",
          "value"
        );
        expect(setValue).toHaveBeenCalledTimes(1);
        expect(setValue).toHaveBeenCalledWith(
          "nodeId",
          "classId",
          "instanceId",
          "index",
          "value"
        );
      });
    });

    describe("setConfig", () => {
      it("should expose the method", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        expect(typeof zwaveComms.methodsAvailableToDriver.setConfig).toEqual(
          "function"
        );
      });

      it("should call the setValue method on the zwave interface", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const setConfig = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect,
            setConfig
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );

        await zwaveComms.methodsAvailableToDriver.setConfig(
          "nodeId",
          "instanceId",
          "index",
          "value"
        );
        expect(setConfig).toHaveBeenCalledTimes(1);
        expect(setConfig).toHaveBeenCalledWith(
          "nodeId",
          "instanceId",
          "index",
          "value"
        );
      });
    });

    describe("claimNode", () => {
      it("should expose the method", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        expect(typeof zwaveComms.methodsAvailableToDriver.claimNode).toEqual(
          "function"
        );
      });

      it("should claim the node if the node exists", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        const zwaveCommsApi = interfaceObj.initialise.mock.calls[0][1];
        zwaveCommsApi.addNode("node1", {});
        await zwaveComms.methodsAvailableToDriver.claimNode("driver1", "node1");
        const nodes = await zwaveComms.methodsAvailableToDriver.getAllNodes();
        expect(nodes).toMatchSnapshot();
      });

      it("should not claim the node if the node does not exist", async () => {
        const connect = jest.fn().mockReturnValue(Promise.resolve());
        const disconnect = jest.fn().mockReturnValue(Promise.resolve());
        const interfaceObj = {
          initialise: jest.fn().mockReturnValue({
            connect,
            disconnect
          })
        };
        const interfaceConfig = {
          foo: "bar"
        };
        const zwaveComms = await zwaveCommsModule(
          interfaceObj,
          interfaceConfig
        );
        const zwaveCommsApi = interfaceObj.initialise.mock.calls[0][1];
        zwaveCommsApi.addNode("node1", {});
        await zwaveComms.methodsAvailableToDriver.claimNode("driver1", "node2");
        const nodes = await zwaveComms.methodsAvailableToDriver.getAllNodes();
        expect(nodes).toMatchSnapshot();
      });
    });
  });
});
