//20160815 Ver.1 Fiscol
//Note : iOS串上RawData做ViewData串接與寫入DB測試;
//20160815 Ver.2 Fiscol
//Note : 將minder/raw兩種input, 拆成兩組api
//20160815 Ver.3 Fiscol
//Note : 當Rate > 門檻值(0.5)時，才觸發監控介面動畫，表格更新

/*
api.js
*/
var express = require('express');
var router = express.Router();
var dataCounter = 0;
/*
API Server
*/
router.post('/iOS/Raw', function (req, res, next){
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
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (MinderResult.Rate >= MinderThreshold) {
        // Send RealTimeData to View 
        req.io.sockets.emit('RealTimeData', { 
            MaxSpeed: DataFinish.MaxSpeed,
            MaxPower: DataFinish.MaxPower,
            Similarity: DataFinish.Similarity, 
            GestureNum: DataFinish.GestureNum
        });
    }
/*
Learn Part
*/

/*
DB Part
*/
    // 存到DB
    _updateDB(UID, DataFinish);

    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才寫到介面Table
    if (MinderResult.Rate >= MinderThreshold) {
        // Send DBdata to View
        req.io.sockets.emit('DBData', { 
            Name: UID,
            Rawdata: ProcessedCode,
            Rate: MinderResult.Rate,
            ActionCode: MinderResult.ActionCode
        });
    }

    // 過門檻值則觸發DONGSlide, DongMotion
    if (MinderResult.Rate >= MinderThreshold) {
        if (MinderResult.ActionCode == 19) {
            _requestDongSlide();
            _requestDongMotion();
            console.log('Good');
        };
    };
    // 傳到DongSlide測試
    // _requestDongSlide();
    // 傳到DongMotion測試
    res.json(MinderResult);
});

router.post('/iOS/Minder', function (req, res, next){
    // 解析body
    var DataRaw = req.body;
/*
Kernal Part
*/
    // 運算Rate, Pattern
    var minderBetaService = require('../services/unit/kernal/minderbeta.js');
    var ProcessedCode = JSON.parse(DataRaw.Code);
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

    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才觸發DashBoard動畫
    if (MinderResult.Rate >= MinderThreshold) {
        // Send RealTimeData to View
        req.io.sockets.emit('RealTimeData', { 
            MaxSpeed: DataFinish.MaxSpeed,
            MaxPower: DataFinish.MaxPower,
            Similarity: DataFinish.Similarity, 
            GestureNum: DataFinish.GestureNum
        });
    }

/*
Learn Part
*/

/*
DB Part
*/
    // 存到DB
    _updateDB(UID, DataFinish);
    //160815 Fiscol DEMO用，監控頁面當Rate > 0.5時才寫到介面Table
    if (MinderResult.Rate >= MinderThreshold) {
        // Send DBdata to View
        req.io.sockets.emit('DBData', { 
            Name: UID,
            Rawdata: ProcessedCode,
            Rate: MinderResult.Rate,
            ActionCode: MinderResult.ActionCode
        });
    }

    // 過門檻值則觸發DONGSlide, DongMotion
    if (MinderResult.Rate >= MinderThreshold) {
        if (MinderResult.ActionCode == 19) {
            _requestDongSlide();
            _requestDongMotion();
            console.log('Good');
        };
    };
    // 傳到DongSlide測試
    // _requestDongSlide();
    // 傳到DongMotion測試
    res.json(MinderResult);
});

function _updateDB(_UID, _DataResult){
    var DB = require('../libraries/firebase_db.js');
    // DB Path
    var RefPath = "DONGCloud/MotionData/" + _UID;
    // Child Name
    dataCounter++;
    var ChildName = "Data" + dataCounter;
    // Read DB data
    // 存到DB
    DB._set(RefPath, ChildName, _DataResult);
}

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