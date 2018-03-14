const AuthenticationSchemas = {
  requested: {
    RequestData: {
      type: "object",
      properties: {
        type: {
          type: "string"
        },
        message: {
          type: "string"
        },
        button: {
          type: "object",
          properties: {
            url: {
              type: "string"
            },
            label: {
              type: "string"
            }
          },
          required: ["url", "label"]
        },
        dataLabel: {
          type: "string"
        }
      },
      required: ["type", "message", "dataLabel"]
    },
    ManualAction: {
      type: "object",
      properties: {
        type: {
          type: "string"
        },
        message: {
          type: "string"
        }
      },
      required: ["type", "message"]
    }
  },
  returned: {
    RequestData: {
      type: "object",
      properties: {
        data: {
          type: "string"
        }
      },
      required: ["data"]
    },
    ManualAction: {
      type: "object",
      properties: {
        success: {
          type: "boolean"
        },
        message: {
          type: "string"
        }
      },
      required: ["success"]
    }
  }
};

module.exports = AuthenticationSchemas;
