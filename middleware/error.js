// utils files
const ErrorHandler = require('../utils/error');

// handling error
const errorHandler = (err, req, res, next) => {
    let error;
    if (err.name == 'ObjectId') {
        const message = 'objectId is not found'
        error = new ErrorHandler(message, 404);
    }
    if (err.name == 'ValidationError') {
        const message = err.message
        error = new ErrorHandler(message, 322);
    }

    if (err.code == 11000) {
        const message = err.message
        error = new ErrorHandler(message, 322);
    }

    res.status(error.statusCode || 500).json({
        succus: false,
        error: error.message || 'server error'         
    })
};

module.exports = errorHandler;