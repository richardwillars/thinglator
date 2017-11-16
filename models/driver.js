module.exports = (mongoose) => {
  const schema = {
    _id: {
      type: String,
      required: true,
      unique: true,
    },
    settings: {
      type: Object,
      required: true,
      default: {},
    },
  };

  return {
    model: mongoose.model('Driver', new mongoose.Schema(schema)),
    schema,
  };
};
