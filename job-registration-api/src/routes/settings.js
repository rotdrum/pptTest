const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.put('/total-positions', settingsController.updateTotalPositions);

module.exports = router;
