var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource11');
});

// API server
router.post('/iOS', function(req, res){

    // 解析body
    var DataRaw = req.body;
    console.log(DataRaw);

    // DB._set(ref_path, ChildName, DataRaw);
    // DB.on_childAdded(ref_path, ChildName);

    //傳到計算層處理 (DONG_Calculate.js)
    var api = require('../DONG_Calculate.js');

    var DataFinish = api._postData(DataRaw);
    console.log(DataFinish);

    // socket 更新處理後數據到前端
    // socket.io 參數須 req
    // io.sockets.emit('data_update', { data: DataRaw });
    req.io.sockets.emit('NumData', { 
    	MaxSpeed: DataFinish.MaxSpeed,
    	MaxPower: DataFinish.MaxPower,
    	Similarity: DataFinish.Similarity, 
    	GestureNum: DataFinish.GestureNum
    });


    // DB Library
    var DB = require('../libraries/firebase_db.js');
    // DB Path
    var RefPath = "DONGCloud/UserData";
    var UserName = "BigQ"
    RefPath = RefPath + "/" + UserName;
    // Child Name
    var ChildName = "Data";

    // 存到DB
    DB._set(RefPath, ChildName, DataFinish);
    // DB._onChildAdded(RefPath, ChildName);

    // respond JSON
    res.json(DataFinish);
    // res.end();
  
    // DONG motion request TEST.
    // _requestDong();

});


// 傳到DongMotion測試
// function _requestDong(){
// var querystring = require('querystring');
// var http = require('http');

// var data = querystring.stringify({
//     username: 'yourUsernameValue',
//     password: 'yourPasswordValue'
// });

// var options = {
//     host: '192.168.11.100',
//     port: 3000,
//     path: '/api/mac_password',
//     method: 'GET'
// };

// var req = http.request(options, function(res) {
//     res.setEncoding('utf8');
//     res.on('data', function (chunk) {
//         console.log("body: " + chunk);
//     });
// });
// // request DONG Motion
//   req.write(data);
//   req.end();
// }

module.exports = router;