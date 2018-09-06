const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportConfig = require('./config/passport');


const v1 = express.Router();
const v1Router = require('./routes/v1/index');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

let whitelist = ['http://localhost:3001'];
let corsOptions = {
  origin: (origin, callback)=>{
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
          },
  credentials: true
}

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, 'public')));

// passport config
passportConfig.setup(passport);

v1.use('/', v1Router);

app.use('/v1', v1);
app.use('/', v1); // Set the default version to latest.

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
