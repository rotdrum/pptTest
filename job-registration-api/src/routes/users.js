const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController');
const settingsController = require('../controllers/settingsController');
const { validateUserRegistration, validateLogin } = require('../middleware/validators');
const { handleValidationErrors, handleResponse } = require('../middleware/handler');

// Apply response handler middleware
router.use(handleResponse);

// Register user route with validation middleware and error handling
router.post('/register', validateUserRegistration, handleValidationErrors, userController.registerUser);
router.post('/login', validateLogin, handleValidationErrors, userController.login);

// List users route
router.get('/users', userController.listUsers);

// API positions route
router.get('/remaining-positions', userController.countRemainingPositions);
router.put('/total-positions', settingsController.updateTotalPositions);
router.put('/users/:phoneNumber/position', userController.updatePosition);


module.exports = router;
