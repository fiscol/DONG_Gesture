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
    // 
    var string2arr = JSON.parse(DataRaw.SDKRawCode);
    // console.log(string2arr);

    var MinderResult = minderBetaService._lcsRateComputing(string2arr, SDKThreshold, SDKSimilarity, SDKParam);

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
            // Rawdata: DataRaw.SDKRawCode,
            Rawdata: string2arr,
            Rate: MinderResult.Rate,
            ActionCode: MinderResult.ActionCode
        });
        console.log(MinderResult.Rate,MinderResult.ActionCode);
        if ( MinderResult.Rate > 0.5) {
            if (MinderResult.ActionCode == 19) {
                _requestDongMotion();
                console.log('Good');
            };
        };
    });
    // 傳到DongSlide測試
    // _requestDongSlide();
    // 傳到DongMotion測試
    res.json(MinderResult);
});


var localurl;
router.post('/localurl', function (req, res, next){
    localurl = req.body.url;
    res.send(localurl);
});
// 傳到DongMotion測試
function _requestDongSlide(){
    var request = require('request')
    
    var postData = {
      name: 'mark'
    }

    var url = 'http://dongslide.herokuapp.com/api/MotionID'
    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: url
    }
    request(options, function (err, res, body) {
      if (err) {
        return
      }
    })
}

// 傳到DongMotion測試
function _requestDongMotion(){
    var request = require('request');
    var url = localurl + "/api/mac_password";
    console.log(url);
    var options = {
      method: 'get',
      url: url
    }
    request(options, function (err, res, body) {
      if (err) {
        return
      }
    })
    console.log('request');
}

module.exports = router;