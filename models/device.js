module.exports = (mongoose) => {
  const schema = {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    created: {
      type: Date,
      required: false,
      default: Date.now,
    },
    type: {
      type: String,
      required: true,
    },
    driver: {
      type: String,
      required: true,
    },
    specs: {
      type: Object,
      required: true,
      default: {},
    },
  };

  return {
    model: mongoose.model('Device', new mongoose.Schema(schema)),
    schema,
  };
};
