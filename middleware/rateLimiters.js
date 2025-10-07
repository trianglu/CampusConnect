const rateLimit = require('express-rate-limit');

exports.logInLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: "Too many login requests. Try again later."
});