var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SpeakerSchema = require('./speaker');

var DeviceSchema = new mongoose.Schema({
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
  specs: {
    type: Object,
    required: true,
    default: {}
  }
});


var Device = mongoose.model('Device', DeviceSchema);

module.exports.Model = Device;