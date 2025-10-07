const { body } = require('express-validator');
const { validationResult } = require('express-validator');

function safeRedirectBack(req, res, fallbackUrl = '/users/new') {
    const backURL = req.get('Referer') || fallbackUrl;
    return res.redirect(backURL);
}

exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid ID format');
        err.status = 400;
        return next(err);
    }
    return next();
};

exports.validateSignUp = [
    body('firstName', "First name cannot be empty")
        .notEmpty().trim().escape(),
    body('lastName', "Last name cannot be empty")
        .notEmpty().trim().escape(),
    body('email', "Email must be a valid email address")
        .isEmail().trim().escape().normalizeEmail(),
    body('password', "Password must be at least 8 characters and at most 64 characters")
        .isLength({ min: 8, max: 64 })
];

exports.validateLogin = [
    body('email', "Email must be a valid email address")
        .isEmail().trim().escape().normalizeEmail(),
    body('password', "Password must be at least 8 characters and at most 64 characters")
        .isLength({ min: 8, max: 64 })
];

exports.validateEvent = [
    body('title', "Title cannot be empty")
        .notEmpty().trim().escape(),
        body('category', "Invalid category")
        .isIn(['Tech', 'Wellness', 'Arts', 'Networking', 'Sports', 'Food', 'Music'])
        .trim().escape(),
    body('location', "Location cannot be empty")
        .notEmpty().trim().escape(),
    body('startDateTime', "Start date must be a valid ISO 8601 date after today")
        .isISO8601()
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error("Start date must be in the future");
            }
            return true;
        }),
    body('endDateTime', "End date must be a valid ISO 8601 date and after start date")
        .isISO8601()
        .custom((value, { req }) => {
            const start = new Date(req.body.startDateTime);
            const end = new Date(value);
            if (end <= start) {
                throw new Error("End date must be after start date");
            }
            return true;
        }),
    body('details', "Details cannot be empty")
        .notEmpty().trim().escape()
];

exports.validateRsvp = [
    body('status', "Invalid RSVP status")
        .isIn(['YES', 'NO', 'MAYBE']).trim().escape()
];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });
        return safeRedirectBack(req, res);
    }
    return next();
};
