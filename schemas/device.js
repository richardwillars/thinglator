module.exports = {
  _id: {
    type: String,
    required: true,
    unique: true
  },
  created: {
    type: Date,
    required: false,
    default: Date.now
  },
  type: {
    type: String,
    required: true
  },
  driver: {
    type: String,
    required: true
  },
  commands: {
    type: Object,
    required: true,
    default: {}
  },
  events: {
    type: Object,
    required: true,
    default: {}
  },
  name: {
    type: String,
    required: true
  },
  originalId: {
    type: String,
    required: true
  },
  additionalInfo: {
    type: Object,
    required: false,
    default: {}
  }
};
