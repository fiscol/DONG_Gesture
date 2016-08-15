//20160815 Ver.1 Fiscol
//Note : iOS串上RawData做ViewData串接與寫入DB測試;

/*
api.js
*/
var express = require('express');
var router = express.Router();
var dataCounter = 0;
/*
API Server
*/
router.post('/iOS', function (req, res, next){
    // 解析body
    var DataRaw = req.body;
/*
Kernal Part
*/
    // 編碼處理 + 運算Rate, Pattern
    var minderBetaService = require('../services/unit/kernal/minderbeta.js');
    var processBetaService = require('../services/unit/kernal/processbeta.js');
    var Threshold = 0.18;
    // 轉換為一列編碼
    var ProcessedCode = processBetaService._processData(DataRaw, Threshold).mixBinaryCodes;
    var MinderThreshold = 0.5;
    var PatternModel = 1;
    var PatternType = 1;
    // 運算Rate, Pattern 
    var MinderResult = minderBetaService._lcsRateComputing(
ProcessedCode, MinderThreshold, PatternModel, PatternType);
/*
Unit Part
*/
    var api = require('../DONG_Calculate.js');
    var UID = DataRaw.UID;
    var DataResult = {
        User : UID,
        ProcessCode : ProcessedCode,
        MotionCode : MinderResult.ActionCode,
        Similarity : parseInt(MinderResult.Rate * 100)
    }
    var DataFinish = api._postData(DataResult);

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
    var RefPath = "DONGCloud/MotionData/" + UID;
    // Child Name
    dataCounter++;
    var ChildName = "Data" + dataCounter;
    // Read DB data
    // 存到DB
    DB._set(RefPath, ChildName, DataFinish);

    // Send DBdata to View
    req.io.sockets.emit('DBData', { 
        Name: UID,
        Rawdata: ProcessedCode,
        Rate: MinderResult.Rate,
        ActionCode: MinderResult.ActionCode
    });

    // 過門檻值則觸發DONG Motion
    if (MinderResult.Rate >= MinderThreshold) {
        if (MinderResult.ActionCode == 19) {
            _requestDongMotion();
            console.log('Good');
        };
    };
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