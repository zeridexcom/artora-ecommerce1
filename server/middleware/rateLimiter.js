const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict limiter for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 login attempts per 15 minutes
    message: {
        error: 'Too many login attempts, please try again later.',
        retryAfter: '15 minutes'
    },
    skipSuccessfulRequests: true,
});

// Checkout limiter (prevent spam orders)
const checkoutLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 3, // 3 checkout attempts per minute
    message: {
        error: 'Too many checkout attempts, please slow down.',
        retryAfter: '1 minute'
    },
});

// Product creation limiter (admin)
const adminLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20, // 20 admin actions per minute
    message: {
        error: 'Too many admin actions, please slow down.',
        retryAfter: '1 minute'
    },
});

module.exports = {
    apiLimiter,
    authLimiter,
    checkoutLimiter,
    adminLimiter,
};
