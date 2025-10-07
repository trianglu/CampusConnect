const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const eventRoutes = require('./routes/eventRoutes');
const mainRoutes = require('./routes/mainRoutes');
const userRoutes = require('./routes/userRoutes');
const morgan = require('morgan');
const methodOverride = require('method-override');
const multer = require('multer');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const app = express();

let port = 3000;
let host = 'localhost';
let url = 'mongodb+srv://arnavg:campus123@cluster0.2dlvsnm.mongodb.net/nbda-project5';
app.set('view engine', 'ejs');

// Connect to MongoDB Atlas
mongoose.connect(url)
  .then(() => {
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
  })
  .catch(err => console.log(err));

// Middlewares
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    },
    store: MongoStore.create({
        mongoUrl: url
    })
}))

app.use(flash());

// (optional) Make flash messages available in views
app.use((req, res, next) => {
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    res.locals.userName = req.session.userName;
    next();
});


app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', mainRoutes);
app.use('/events', eventRoutes);
app.use('/users', userRoutes);

// Error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);

});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});
