const { validationResult } = require('express-validator');

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ 
            data: [], 
            status: {
                code: 422, 
                message: 'Validation Error', 
                errors: errors.array() 
            }
        });
    }
    next();
};

exports.handleResponse = (req, res, next) => {
    res.handleSuccess = (data, message = 'OK') => {
        res.status(200).json({
            data: data,
            status: {
                code: 200,
                message: message
            }
        });
    };

    res.handleNotFound = (data, message = 'Not Found') => {
        res.status(404).json({
            data: data,
            status: {
                code: 404,
                message: message
            }
        });
    };

    res.handleError = (error) => {
        res.status(500).json({
            data: [],
            status: {
                code: 500,
                message: 'Internal Server Error',
                error: error.message
            }
        });
    };

    next();
};
