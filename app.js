var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// routes(controllers)
var routes = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');
var api = require('./routes/api');
var devapi = require('./routes/devapi');


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log("onConnect:" + io.engine.clientsCount);
  socket.on('disconnect', function () {
    console.log("onDisConnect:" + io.engine.clientsCount);
  });
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'PVDPlusUser',
  cookie: { maxAge: 60 * 1000 * 60 * 24 * 14 }, //cookie存在兩週
  resave: false,
  saveUninitialized: true
}));

// Pass Socket.io to routes 
app.use(function (req, res, next) {
  req.io = io;
  next();
});
app.use('/', routes);
app.use('/users', users);
app.use('/admin', admin);
app.use('/api/v1', api); //api
app.use('/devapi', devapi); //devapi

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = { app: app, server: server };
