var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//routes(controllers)
var routes = require('./routes/index');
var users = require('./routes/users');
// var api = require('./routes/api');
// var unit = require('./routes/unit');
// var train = require('./routes/train');

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

// API server
app.post('/api/iOS', function(req, res){

    // 解析body
    var DataRaw = req.body;
    console.log(DataRaw);

    //DONG API-function resolve
    var DB = require('./libraries/firebase_db.js');
    var RefPath = "DONGCloud/UserData";
    var ChildName = "User";

    // DB._set(ref_path, ChildName, DataRaw);
    // DB.on_childAdded(ref_path, ChildName);

    // // socket 更新處理後數據到前端
    // io.sockets.emit('data_update', { data: DataRaw });

    //傳到計算層處理 (DONG_Calculate.js)
    var api = require('./DONG_Calculate.js');

    var DataFinish = api._postData(DataRaw);
    console.log(DataFinish);

    // 存到DB
    DB._set(RefPath, ChildName, DataFinish);
    DB._onChildAdded(RefPath, ChildName);

    res.json(DataFinish);
  
    // DONG motion request TEST.
    _requestDong();

});


/*
request DONG Motion
*/

function _requestDong(){
var querystring = require('querystring');
var http = require('http');

var data = querystring.stringify({
    username: 'yourUsernameValue',
    password: 'yourPasswordValue'
});

var options = {
    host: '192.168.11.100',
    port: 3000,
    path: '/api/mac_password',
    method: 'GET'
};

var req = http.request(options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
        console.log("body: " + chunk);
    });
});
// request DONG Motion
  req.write(data);
  req.end();
}








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
