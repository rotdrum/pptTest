const Settings = require('../models/settings');

exports.updateTotalPositions = async (req, res) => {
  const { totalPositions } = req.body;
  
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }
    settings.totalPositions = totalPositions;
    await settings.save();
    res.handleSuccess(settings, 'Total positions updated successfully');
  } catch (error) {
    res.handleError(error);
  }
};
