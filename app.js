var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


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

app.use('/', routes);
app.use('/users', users);





//DONG API-function resolve
var api = require('./api_function.js');
var db = require('./firebase_db.js');
var ref_path = "DONGCloud";
var UserData = "UserData";


// API server
app.post('/api', function(req, res){

  // 解析body
  var data_raw = req.body;
  console.log(data_raw);

  // 存到DB
  // db._set(UserData, ref_path, data_raw);
  db._push(UserData, ref_path, data_raw);

  // socket 更新處理後數據到前端
  io.sockets.emit('data_update', { data: data_raw });
  res.json({ data: data_raw });

  //傳到api層處理 (api_function.js)
  var data_finish = api.post_data(data_raw);
  console.log(data_finish);


});







// db._push(ref_path, haha);
// db._update(ref_path, haha2);
// db.on_value(ref_path);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};
