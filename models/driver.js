var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DriverSchema = new mongoose.Schema({
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
});


var Driver = mongoose.model('Driver', DriverSchema);

module.exports.Model = Driver;