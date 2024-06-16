const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  totalPositions: {
    type: Number,
    required: true,
    default: 100, // Default value if not set
  },
});

const Settings = mongoose.model('Settings', settingsSchema);
module.exports = Settings;
