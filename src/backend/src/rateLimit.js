const rateLimit = require('express-rate-limit');
require('dotenv').config();

const limiter = rateLimit({
    windowMs: process.env.API_LIMITER_MINUTES * 60 * 1000,
    max: process.env.API_LIMITER_MAX_REQUESTS,
    handler: function (req, res, next) {
        res.status(this.statusCode).json({
            error: 'Limite de requisições por minuto excedido, tente novamente em alguns minutos.',
            status: this.statusCode,
            timeout: this.after,
        });
    },
});

module.exports = limiter;