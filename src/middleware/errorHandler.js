// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Middleware Error:', err);
    
    // Default error
    let error = {
        message: err.message || 'Internal Server Error',
        status: err.status || 500
    };
    
    // Database errors
    if (err.code === '23505') { // Unique constraint violation
        error.message = 'Bu TC kimlik numarası zaten kullanılıyor';
        error.status = 400;
    }
    
    // Validation errors
    if (err.name === 'ValidationError') {
        error.message = 'Validation Error';
        error.status = 400;
    }
    
    res.status(error.status).json({
        error: error.message,
        timestamp: new Date().toISOString()
    });
};

module.exports = errorHandler; 