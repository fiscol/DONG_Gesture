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
    _requestDongSlide()
    _requestDongMotion()
    res.json(MinderResult);
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
    var request = require('request')
    
    var postData = {
      name: 'mark'
    }

    var url = 'https://127f9eae.ngrok.io/api/mac_password'
    var options = {
      method: 'get',
      url: url
    }
    request(options, function (err, res, body) {
      if (err) {
        return
      }
    })
}

module.exports = router;