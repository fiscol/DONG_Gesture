/*
api.js
*/
var express = require('express');
var router = express.Router();

/*
API Server
*/
router.post('/iOS', function (req, res, next){
    // 解析body
    var DataRaw = req.body;
/*
Unit Part
*/
    // minderBetaService
    var minderBetaService = require('../services/unit/minderbeta.js');
    // var SDKRawCode = [4, 5, 3, 3, 7, 5, 4, 4, 6, 1, 2, 2, 3, 2, 4, 4, 3, 3, 4, 4, 5, 2, 3, 1, 4, 4, 2, 3, 1, 4, 4, 2, 3, 3, 4, 4, 2, 3, 4, 6, 2];
    var SDKThreshold = 0.55;
    var SDKSimilarity = 1;
    var SDKParam = 1;
    var MinderResult = minderBetaService._lcsRateComputing(DataRaw.SDKRawCode, SDKThreshold, SDKSimilarity, SDKParam);

    //DONG_Calculate
    var api = require('../DONG_Calculate.js');
    var DataFinish = api._postData(DataRaw);

    // Send RealTimeData to View 
    req.io.sockets.emit('RealTimeData', { 
    	MaxSpeed: DataFinish.MaxSpeed,
    	MaxPower: DataFinish.MaxPower,
    	Similarity: DataFinish.Similarity, 
    	GestureNum: DataFinish.GestureNum
    });

/*
Learn Part
*/

/*
DB Part
*/
    var DB = require('../libraries/firebase_db.js');
    // DB Path
    var RefPath = "DONGCloud/Test";
    // Child Name
    var RandomChildName = (Math.floor((Math.random() * 3) + 1));//Random Test
    var ChildName = "User" + RandomChildName;
    // Read DB data
    // 存到DB
    // DB._set(RefPath, ChildName, DataFinish);

    DB._onValue(RefPath, ChildName, function(onValueResult){
        // Send DBdata to View
        req.io.sockets.emit('DBData', { 
            Name: onValueResult.User,
            Rawdata: DataRaw.SDKRawCode,
            Rate: MinderResult.Rate,
            ActionCode: MinderResult.ActionCode
        });
    });
    // DONG motion request TEST.
    _requestDong();
    res.json(MinderResult);
});

// 傳到DongMotion測試
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

module.exports = router;