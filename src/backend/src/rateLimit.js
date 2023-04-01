const rateLimit = require('express-rate-limit');
require('dotenv').config();

const limiter = rateLimit({
    windowMs: process.env.API_LIMITER_MINUTES * 60 * 1000,
    max: process.env.API_LIMITER_MAX_REQUESTS,
});

module.exports = limiter;