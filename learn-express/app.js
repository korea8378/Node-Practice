var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(function(req, res, next) {
  console.log(req.url, '저도 미들웨이입니다.');
  next(); // 반드시 미들웨어에서는 next() 함수가 존재 해야한다. 다른 미들웨어들은 내부에 next() 함수가 추가되어 있다.
});
app.use(logger('dev'));
//short : http version, common : time, http version, combined : time, http version, user-agent
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//body-parser가 express에  내장되어 있음
app.use(cookieParser('secret code'));
app.use(session({
  resave: false,
  saveUninitalized: false,
  secret: 'secret code',
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
