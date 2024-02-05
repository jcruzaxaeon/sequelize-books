

// app.js

// Dependencies
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Routing
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Environment
var app = express();
var port = process.env.PORT || 3000;

// View Engine Configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Initialization
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// // Test: Create a 500 Server-Error
// app.use( (req, res, next) => {
//   next(createError(500, "Sorry! There was an unexpected error on the server."));
// });

// Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Database
const db = require('./models/index.js');
// const {Book} = db.models;

// Async IIFE
(async ()=>{
  try {
    // Test DB Wiring
    // await db.sequelize.authenticate();
    // console.log('App connected to database.');
    
    // Sync DB
    // await db.sequelize.sync({force: true,});
    await db.sequelize.sync();


  } catch(error) {
      console.log('Error connecting to database:', error);
      // if(error.name === 'SequelizeValidationError') {
      //   const errors = error.errors.map(err => err.message );
      //   console.error('Validation errors: ', errors);
      // }
      // else throw error;
  }

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404, "Sorry! We couldn't find the page you were looking for."));
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if(err.status === 404) { res.render('page-not-found', {err}); }
    else { res.render('error', {err}); }

    console.log(`Status: ${err.status}`);
    console.log(`Message: ${err.message} \n`);
  });

  // Dev: Run Server
  app.listen(port, ()=>{
    console.log(`Server is running on port ${port}\n`);
  });

  module.exports = app;
}) ();

