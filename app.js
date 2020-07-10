const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const validator= require('express-validator');
const MongoStore = require('connect-mongo')(session);

const userRouter = require('./routes/user');
const ENV = require('dotenv');
ENV.config();
//console.log(process.env.DATABASE_URL);
const app = express();


mongoose.Promise = Promise; 
mongoose.set('useCreateIndex', true);
const mongooseOptions = {  useUnifiedTopology: true }


mongoose.connect(process.env.DATABASE_URL, mongooseOptions, function(err) {
    if (err) {
        console.error('System could not connect to mongo server.');
        console.log(err) ;    
    } else {
        console.log('System connected to mongo server.');
    } 
});
app.listen(process.env.PORT || 8000);
require('./config/passport');
// view engine setup
app.engine('.hbs',expressHbs({defualtLayout:'layout',extname:'.hbs'}));
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session(
  {secret: 'mysupersecret', 
  resave:false, 
  saveUninitialized: false,
  store:new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge:180 * 60 * 1000} 
}
  
  ));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
  res.locals.isLogin = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


app.use('/user', userRouter);
app.use('/', indexRouter);

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
