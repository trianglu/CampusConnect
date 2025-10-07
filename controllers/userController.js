const model = require('../models/user');
const Event = require('../models/event');
const Rsvp = require('../models/rsvp');

function safeRedirectBack(req, res, fallbackUrl = '/') {
    const backURL = req.get('Referer') || fallbackUrl;
    return res.redirect(backURL);
}

exports.new = (req, res) => {
    return res.render('users/new');
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    user.save()
        .then(() => {
            req.flash('success', 'Account created successfully! Please login.');
            res.redirect('/users/login');
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used');
                return safeRedirectBack(req, res, '/users/new');
            }

            next(err);
    });
};

exports.getUserLogin = (req, res) => {
    return res.render('users/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Wrong email address');
                return safeRedirectBack(req, res, '/users/login');
            } else {
                return user.comparePassword(password).then(result => {
                    if (result) {
                        req.session.user = user._id;
                        req.session.userName = user.firstName + ' ' + user.lastName;
                        req.flash('success', 'You are logged in.');
                        res.redirect('/users/profile');
                    } else {
                        req.flash('error', 'Wrong password');
                        return safeRedirectBack(req, res, '/users/login');
                    }
                });
            }
        })
        .catch(err => next(err));
};


exports.profile = (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user;
    let user = model.findById(userId);
    let rsvps = Rsvp.find({ user: userId }).populate('event');

    Promise.all([user, Event.find({ author: userId }), rsvps])
        .then(([user, events, rsvps]) => {
            if (!user) {
                let err = new Error('User not found');
                err.status = 404;
                return next(err);
            }
            res.render('users/profile', { user, events, rsvps });
        })
        .catch(err => next(err));
};


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) return next(err);
        else res.redirect('/');
    });
};
