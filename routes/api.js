/*
api.js 負責處理
*/

var express = require('express');
var router = express.Router();


// API server
router.post('/iOS', function (req, res, next){

    // 解析body
    var DataRaw = req.body;
    console.log(DataRaw);

    // DB._set(ref_path, ChildName, DataRaw);
    // DB.on_childAdded(ref_path, ChildName);

    //傳到計算層處理 (DONG_Calculate.js)
    var api = require('../DONG_Calculate.js');

    var DataFinish = api._postData(DataRaw);
    // console.log(DataFinish);

    // socket 更新處理後數據到後端管理view(admin.ejs)
    // socket.io 參數須 req
    req.io.sockets.emit('RealTimeData', { 
    	MaxSpeed: DataFinish.MaxSpeed,
    	MaxPower: DataFinish.MaxPower,
    	Similarity: DataFinish.Similarity, 
    	GestureNum: DataFinish.GestureNum
    });

    // DB Library
    var DB = require('../libraries/firebase_db.js');
    // DB Path
    var RefPath = "DONGCloud/Test";
    // Child Name
    var RandomChildName = (Math.floor((Math.random() * 3) + 1));//Random Test
    var ChildName = "User" + RandomChildName;

    // 存到DB
    // DB._set(RefPath, ChildName, DataFinish);

    // Read DB data
    DB._onValue(RefPath, ChildName, function(onValueResult){
        console.log(onValueResult);
        req.io.sockets.emit('DataBaseData', { 
            Name: onValueResult.User,
            Member: onValueResult.IsDongMember,
            Rawdata: onValueResult.RawCode
        });
    });
    

    // respond JSON
    
    res.end();
  
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