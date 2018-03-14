module.exports = {
  _id: {
    type: String,
    required: true,
    unique: true
  },
  settings: {
    type: Object,
    required: true,
    default: {}
  }
};
