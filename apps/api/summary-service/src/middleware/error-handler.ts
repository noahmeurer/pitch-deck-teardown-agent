import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.error(err);
    
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
};

export default errorHandler; 