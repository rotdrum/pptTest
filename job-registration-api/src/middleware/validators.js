const { body } = require('express-validator');

// Middleware to validate user registration data
exports.validateUserRegistration = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('phoneNumber')
    .isMobilePhone('any', { strictMode: false }) // Allow any phone number format
    .withMessage('Valid phone number is required')
    .custom((value, { req }) => {
        if (!value || value.length >= 10) {
            return true;
        }
        throw new Error('Phone number must be at least 10 characters long');
    }),
];

exports.validateLogin = [
    body('phoneNumber')
    .isMobilePhone('any', { strictMode: false }) // Allow any phone number format
    .withMessage('Valid phone number is required')
    .custom((value, { req }) => {
        if (!value || value.length >= 10) {
            return true;
        }
        throw new Error('Phone number must be at least 10 characters long');
    }),
];
