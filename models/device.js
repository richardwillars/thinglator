var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SpeakerSchema = require('./speaker');

var DeviceSchema = new mongoose.Schema({
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
  specs: {
    type: Object,
    required: true,
    default: {}
  }
});


var Device = mongoose.model('Device', DeviceSchema);

module.exports = {
  Device: Device
}