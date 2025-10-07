const Event = require('../models/event');
const Rsvp = require('../models/rsvp');

function safeRedirectBack(req, res, fallbackUrl) {
    const backURL = req.get('Referer') || fallbackUrl;
    return res.redirect(backURL);
}

exports.index = (req, res, next) => {
    Event.find()
      .populate('author', 'firstName lastName')
      .sort({ category: 1, startDateTime: 1 }) // sort by category + date
      .then(events => {
          // group by category
          const groupedEvents = events.reduce((acc, event) => {
            if (!acc[event.category]) {
              acc[event.category] = [];
            }
            acc[event.category].push(event);
            return acc;
          }, {});
          
          res.render('events/index', { groupedEvents });
      })
      .catch(err => next(err));
  };  

exports.new = (req, res) => {
  res.render('./events/new');
};

exports.create = (req, res, next) => {
    let event = new Event(req.body);
    event.author = req.session.user;
    console.log("image: " + event.image);
    if (req.file) {
        event.image = '/images/' + req.file.filename;
    }
    console.log("image after: " + event.image);
    event.save()
    .then(() => {
        req.flash('success', 'Event created successfully!');
        res.redirect('/events');
    })
    .catch((err) => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Event creation failed. Please check required fields.');
            return safeRedirectBack(req, res, '/events/new');  // fallback to form
        }
        next(err);
    });
};


exports.show = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400; // Bad Request
        return next(err);
    }

    Event.findById(id)
    .populate('author', 'firstName lastName')
    .then((event) => {
        if (!event) {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }

        Rsvp.countDocuments({ event: id, status: 'YES' })
        .then(yesCount => {
            let isAuthor = false;
            if (req.session.user && event.author._id.toString() === req.session.user) {
                isAuthor = true;
            }
            
            res.render('./events/show', { event, yesCount, user: req.session.user, isAuthor });
        });
    })
    .catch(err => next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    
    Event.findById(id)
    .then(event => {
        if(event) {
            res.render('./events/edit', {event});
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
};

/*exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    event.image = '/images/' + event.image;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400; // Bad Request
        return next(err);
    }

    console.log(event.image);
    console.log("req params: " + req.url);
    console.log("outside function");
    // Check if the image file was uploaded
    /*if (req.file) {
        //console.log("inside function");
        //event.image = '/images/' + req.file.filename;
    }*/

    /*console.log(event.image);

    Event.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
        if(event) {
            console.log("inside findandupdate")
            res.redirect('/events/'+id);
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Event update failed. Please check required fields.');
            return res.redirect('back');
        }
        next(err);
    });
}; */

exports.update = (req, res, next) => {
    let event = req.body;
    let id = req.params.id;

    console.log("image: " + event.image);

    if (req.file) {
        event.image = '/images/' + req.file.filename;
    }
    console.log("image after: " + event.image);

    Event.findByIdAndUpdate(id, event, { useFindAndModify: false, runValidators: true })
    .then(event => {
        if (event) {
            res.redirect('/events/' + id);
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Event update failed. Please check required fields.');
            return safeRedirectBack(req, res, `/events/${id}/edit`);
        }
        next(err);
    });
};

exports.handleRsvp = async (req, res, next) => {
    try {
        if (!req.session.user) {
            req.flash('error', 'You must be logged in to RSVP.');
            return res.redirect('/users/login');
        }

        const eventId = req.params.id;
        const status = req.body.status;
        const userId = req.session.user;

        if (!req.session.user) {
            return res.redirect('/users/login');
        }

        const event = await Event.findById(eventId).populate('author');

        if (!event) {
            return res.status(404).render('error', { error: 'Event not found' });
        }

        if (event.author._id.equals(userId)) {
            return res.status(401).render('error', { error: 'You cannot RSVP to your own event' });
        }

        // Save or update RSVP
        const rsvp = await Rsvp.findOneAndUpdate(
            { user: userId, event: eventId },
            { status },
            { upsert: true, new: true, runValidators: true }
        );

        req.flash('success', `RSVP status updated to ${status}`);
        // Redirect to the user profile page
        res.redirect('/users/profile');
    } catch (err) {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Invalid RSVP');
            res.redirect(`/events/${eventId}`);
        }
        next(err);
    }
};



/*exports.delete = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400; // Bad Request
        return next(err);
    }

    Event.findByIdAndDelete(id)
    .then(event => {
        if(event) {
            res.redirect('/events');
        } else {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Invalid event deletion request.');
            return res.redirect('back');
        }        
        next(err);
    });
};*/

exports.delete = (req, res, next) => {
    let id = req.params.id;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid event id');
        err.status = 400;
        return next(err);
    }

    Event.findByIdAndDelete(id)
    .then(event => {
        if (!event) {
            let err = new Error('Cannot find an event with id ' + id);
            err.status = 404;
            throw err; // this will be caught in .catch
        }
        // Delete RSVPs after the event is deleted
        return Rsvp.deleteMany({ event: id });
    })
    .then(() => {
        req.flash('success', 'Event and RSVPs deleted successfully.');
        res.redirect('/events');
    })
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Invalid deletion request.');
            return safeRedirectBack(req, res, '/events');
        }
        next(err);
    });

};

/*exports.createImage = (req, res, next) => {
    let event = new Event({
        image: req.body.imageName
    });
    // Check if the image file was uploaded
    if (req.file) {
        event.image = '/images/' + req.file.filename;
    }
    event.save() //save the document to the database
    .then(event => res.redirect('/events'))
    .catch((err) => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Image upload failed. Please check required fields.');
            return res.redirect('back');
        }        
        next(err);
    });
}*/

exports.createImage = (req, res, next) => {
    let event = new Event({
        image: req.body.imageName
    });

    if (req.file) {
        event.image = '/images/' + req.file.filename;
    }

    event.save()
    .then(event => res.redirect('/events'))
    .catch(err => {
        if (err.name === 'ValidationError') {
            req.flash('error', 'Image upload failed. Please check required fields.');
            return safeRedirectBack(req, res, '/events/new');  // fallback page as suitable
        }
        next(err);
    });
};