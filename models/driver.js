const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
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


const Driver = mongoose.model('Driver', DriverSchema);

module.exports.Model = Driver;
